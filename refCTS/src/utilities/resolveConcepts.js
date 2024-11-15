/**
 * Function to replace concepts (diseases & intervensions) indicated
 * in the URL query params with the fetched concepts.
 *
 * The url parameters will only indicate a concept code (or multiple),
 * and it will not have anything else, such as the label or the type of
 * concept. We must fetch that information from the API using the
 * /diseases or /interventions endpoint. There are 4 parameters that
 * use /diseases (t, st, stg, fin) and 2 that use /interventions ().
 * The purpose of this function is to batch up the queries to go get
 * the full concept details in order to "rehydrate" the form state
 * from the query params.
 *
 * This function helps to ensure there are only 2 requests to the API
 * endpoints listed above. It does this by taking in an object with
 * the same structure as the form state for those fields. Each selected
 * concept has a placeholder that mimicks the shape of a concept in the
 * API. (e.g {name: "UNKNOWN", codes: ["x", "y"]} ) It pulls out
 * all the concept codes of all the selected concepts in order to make
 * the query. It then makes the query and replaces all the concept
 * placeholders. Easy.
 *
 * NOTE: The concept codes for a concept *can* change from day to day,
 * however, they do not normally, but we still need to handle that in
 * this code. This is because the diseases and interventions endpoints
 * contain the concepts that are in use in the current set of trials.
 * Furthermore the concepts in the endpoints are populated from the NCI
 * Thesaurus and are actually a rollup of multiple terms based on more
 * user friendly names for the diseases.
 *
 * For example there may be multiple entries for a single stage of
 * cancer. This based on how the
 * American Joint Committee on Cancer (AJCC) has defined that stage at the
 * point in time the trial was created/indexed. So trials would be tagged
 * with the specific version, (v6, v7, or v8) So instead of the users
 * seeing a bunch of duplicate stages in the form, (Stage II Lung Cancer
 * AJCC v6, Stage II Lung Cancer AJCC v7, etc) Those items are rolled up
 * into a single concept with multiple codes. (e.g. Stage II Lung Cancer)
 *
 * Since this is based on the current trial set, if yesterday there were
 * a single trial in the results tagged with Stage II Lung Cancer AJCC v6,
 * and that trial became closed today, then the ID would be removed from
 * the list of codes for the Stage II Lung Cancer concept if it was
 * requested today. If the trial becomes active once again tomorrow, then
 * the code would be added back in.
 *
 * Since URLs can be bookmarked and saved, we need to do our best guess
 * as to what codes in the URL match to the concepts in the API. For any
 * selected concept in the URL params we can match on any of the codes in
 * use by the API. If a code is no longer in use by trials, that is not a
 * problem as long as at least one of the codes for the selected concept
 * is still in use. HOWEVER, if the codes for the selected concept return
 * multiple concept entries WITH DIFFERENT NAMES, then it is an error for
 * that selected concept. This condition would only happen if the NCI
 * Thesaurus team was remapping the Thesaurus terms to the user friendly
 * names based on changes input from the Cancer Information Service or
 * other reviews of the balance between the user friendly-ness of the
 * labels vs the acuracy of matching *eligable* trials for that user.
 *
 * @param {object} queryConcepts - the selected concepts
 * @param {function} conceptsFetcher - the concept fetcher function
 */
export const resolveConcepts = async (queryConcepts, conceptsFetcher) => {
	// Nothing to fetch.
	if (Object.keys(queryConcepts).length === 0) {
		return {};
	}

	// I was getting all sorts of fancy here and not using variables.
	// I could not set up any breakpoints, so this is now broken
	// out with temp variables to allow for debugging.

	// Turn the object into a key/value pair array
	const selectedFieldCodePairs = Object.entries(queryConcepts);

	// Now consolidate all the concepts into one list of concepts.
	// Remember a concepts is {name, codes, type}
	const allSelected = selectedFieldCodePairs.reduce((ac, pair) => {
		// Some fields may only allow one selection, and thus will not be
		// an array. So make it an array.
		const concepts = Array.isArray(pair[1]) ? pair[1] : [pair[1]];

		// Holder for this round of reduction.
		const round = [...ac, ...concepts];
		return round;
	}, []);

	// Consolodate the list of concepts into a list of ids.
	const allIds = allSelected.reduce((ac, concept) => {
		// Holder for this round of reduction.
		const round = [...ac, ...concept.codes];
		return round;
	}, []);

	// The list of all ids needs to be unique, but an array.
	// Pass allIds to set to make them unique, then
	// Array.from to turn it back into an array.
	const fullIdList = Array.from(new Set(allIds));

	// The expected response is an array of concepts
	// that we can then iterate over.
	const fetchedConcepts = await conceptsFetcher(fullIdList);

	// Now we return a queryConcepts object that has been
	// filled in with the correct concepts.
	const populatedQueryConcepts = selectedFieldCodePairs.reduce((ac, pair) => {
		// Some fields may only allow one selection, and thus will not be
		// an array. So make it an array.
		const concepts = Array.isArray(pair[1]) ? pair[1] : [pair[1]];

		// Iterate over the concepts replaing from fetched list, if found --
		// leaving as is if not found.
		const replacementConcepts = concepts.map((selectedConcept) => {
			// Find all the matching fetched concepts.
			// It is ok that matchedConcepts may contain nulls, those would
			// be ids that the API does not know about any more. What we
			// do need to check is to make sure that there is only 1 unique

			const matchedConcepts = selectedConcept.codes
				.map((code) =>
					fetchedConcepts.find((fetchedConcept) =>
						fetchedConcept.codes.includes(code)
					)
				)
				.filter((fetchedConcept) => fetchedConcept);

			const uniqueMatchedConcepts = Array.from(new Set(matchedConcepts));

			// If there is one we have a match.
			if (uniqueMatchedConcepts.length === 1) {
				return uniqueMatchedConcepts[0];
			} else {
				// Either no ID was found, OR, and this is an issue,
				// multiple concepts were found for this one selected
				// concept. E.g. C123|C456 matched breast cancer AND
				// lung cancer. That is bad.
				return selectedConcept;
			}
		});

		const round = {
			...ac,
			// If the original field was a single value, then we need to keep it
			// a single value.
			[pair[0]]: Array.isArray(pair[1])
				? replacementConcepts
				: replacementConcepts[0],
		};
		return round;
	}, {});

	return populatedQueryConcepts;
};
