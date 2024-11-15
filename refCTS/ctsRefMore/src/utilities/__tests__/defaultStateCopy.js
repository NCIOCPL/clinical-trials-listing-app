// eslint-disable-next-line jest/no-export
export const defaultState = {
	age: '', // (a) Age
	cancerType: { name: '', codes: [] }, // (ct) Cancer Type/Condition
	subtypes: [], // (st) Subtype
	stages: [], // (stg) Stage
	findings: [], // (fin) Side effects
	keywordPhrases: '', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
	zip: '', // (z) Zipcode
	zipCoords: { lat: '', long: '' },
	zipRadius: '100', //(zp) Radius
	country: 'United States', // (lcnty) Country
	states: [], // (lst) State
	city: '', // (lcty) City
	hospital: { term: '', termKey: '' }, // (hos) Hospital
	healthyVolunteers: false, // (hv) Healthy Volunteers,
	trialTypes: [
		{ label: 'Treatment', value: 'treatment', checked: false },
		{ label: 'Prevention', value: 'prevention', checked: false },
		{ label: 'Supportive Care', value: 'supportive_care', checked: false },
		{
			label: 'Health Services Research',
			value: 'health_services_research',
			checked: false,
		},
		{ label: 'Diagnostic', value: 'diagnostic', checked: false },
		{ label: 'Screening', value: 'screening', checked: false },
		{ label: 'Basic Science', value: 'basic_science', checked: false },
		{ label: 'Other', value: 'other', checked: false },
	], // (tt) Trial Type
	trialPhases: [
		{ label: 'Phase I', value: 'i', checked: false },
		{ label: 'Phase II', value: 'ii', checked: false },
		{ label: 'Phase III', value: 'iii', checked: false },
		{ label: 'Phase IV', value: 'iv', checked: false },
	], // (tp) Trial phase
	vaOnly: false, // (va) VA facilities only
	drugs: [], // (dt) Drug/Drug family
	treatments: [], // (ti) Treatment/Interventions
	trialId: '', // (tid) Trial ID,
	investigator: { term: '', termKey: '' }, // (in) Trial investigators ('in' is legacy but is a keyword and does not work well as a key name; be ready to handle both in query string)
	leadOrg: { term: '', termKey: '' }, // (lo) Lead Organization
	resultsPage: 1,
	formType: '', // (empty string (default) | basic | advanced)
	location: 'search-location-all', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
	qs: '', // The query string associated with this SCO
};
describe('placeholder', () => {
	it('placeholder', () => {
		expect(true).toEqual(true);
	});
});
