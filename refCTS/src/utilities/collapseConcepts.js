/**
 * Collapses a list of thesaurus concepts (diseases, drugs and other interventions
 * into a collection of ids.
 * @param array typesList the list of diseases
 */
export const collapseConcepts = (typesList) => {
	const ids = typesList.reduce((ac, type) => {
		return [...ac, ...type.codes];
	}, []);
	return [...new Set(ids)];
};
