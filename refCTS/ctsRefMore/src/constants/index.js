// This is for the trial status which comes as "trial.current_trial_status" from the api
export const ACTIVE_TRIAL_STATUSES = [
	// These CTRP statuses appear in results:
	'Active',
	'Approved',
	'Enrolling by Invitation',
	'In Review',
	'Temporarily Closed to Accrual',
	'Temporarily Closed to Accrual and Intervention',
	// These CTRP statuses DO NOT appear in results:
	/// "Administratively Complete",
	/// "Closed to Accrual",
	/// "Closed to Accrual and Intervention",
	/// "Complete",
	/// "Withdrawn"
];

// This is for the study site status (this is actually upper-cased from the api)
export const ACTIVE_RECRUITMENT_STATUSES = [
	// These statuses appear in results:
	'active',
	'approved',
	'enrolling_by_invitation',
	'in_review',
	'temporarily_closed_to_accrual',
	// These statuses DO NOT appear in results:
	/// "closed_to_accrual",
	/// "completed",
	/// "administratively_complete",
	/// "closed_to_accrual_and_intervention",
	/// "withdrawn"
];

// Specify which fields will be returned in the TrialsResults Object from clinicaltrialsapi
export const SEARCH_RETURNS_FIELDS = [
	'nci_id',
	'nct_id',
	'brief_title',
	'sites.org_name',
	'sites.org_postal_code',
	'eligibility.structured',
	'current_trial_status',
	'sites.org_va',
	'sites.org_country',
	'sites.org_state_or_province',
	'sites.org_city',
	'sites.org_coordinates',
	'sites.recruitment_status',
	'diseases',
];

//These are the two catch all buckets that we must add to the bottom of the list.
//ORDER will matter here.
export const OTHER_MAIN_TYPES = [
	'C2916', //Carcinoma not in main type (Other Carcinoma)
	'C3262', //Neoplasm not in main type (Other Neoplasm)
	'C2991', //Disease or Disorder (Other Disease)
];

export const NIH_ZIPCODE = '20892';
export const START_OVER_LINK = 'start_over_link';
export const TRY_NEW_SEARCH_LINK = 'try_a_new_search_link';
export const INVALID_ZIP_TEXT = 'Please enter a valid 5 digit U.S. ZIP code';
export const SEARCH_FORM_ID = 'cts-search-form';

export const defaultSCOState = {
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
	qs: '', // the query string associated with this SCO, defaults to loc=0&rl=1
};
