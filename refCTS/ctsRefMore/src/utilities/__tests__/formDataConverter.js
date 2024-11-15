import { formDataConverter } from '../formDataConverter';

const DEFAULT_BASIC_EVARS = {
	fieldUsage: 'none',
	canTypeKwPhrAge: 'none|none',
	loc: 'all',
	// No 19 & 20 for basic
};

const DEFAULT_ADV_EVARS = {
	fieldUsage: 'none',
	canTypeKwPhrAge: 'all|all|all|all|none|none',
	loc: 'all',
	ttDrugTreat: 'all|none|none',
	tpTidInvLo: 'all|none|none|none',
};

const TEST_CASES = [
	[
		'basic - no params',
		{
			formType: 'basic',
			formData: {
				location: 'search-location-all',
			},
		},
		{
			...DEFAULT_BASIC_EVARS,
		},
	],
	[
		'basic - keyword all',
		{
			formType: 'basic',
			formData: {
				keywordPhrases: 'Breast cancer',
				age: 35,
				location: 'search-location-zip',
				zip: 20874,
			},
		},
		{
			...DEFAULT_BASIC_EVARS,
			fieldUsage: 'a:q:loc:z',
			canTypeKwPhrAge: 'keyword|breast cancer|35',
			loc: 'zip|20874|none',
		},
	],
	[
		'basic - disease all',
		{
			formType: 'basic',
			formData: {
				cancerType: ['c1111'],
				age: 35,
				location: 'search-location-zip',
				zip: 20874,
			},
		},
		{
			...DEFAULT_BASIC_EVARS,
			fieldUsage: 't:a:loc:z',
			canTypeKwPhrAge: 'typecondition|c1111|35',
			loc: 'zip|20874|none',
		},
	],
	[
		'adv - no params',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-all',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
		},
	],
	// "Location" -- VA Only
	[
		'adv - location - vaOnly',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-all',
				vaOnly: true,
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:va',
			loc: 'all|va-only',
		},
	],
	// Location -- Zip Code
	[
		'adv - zip location',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-zip',
				zip: '20852',
				zipRadius: '100',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:z:zp',
			loc: 'zip|20852|100',
		},
	],
	[
		'adv - zip location + va',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-zip',
				zip: '20852',
				zipRadius: '100',
				vaOnly: true,
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:va:z:zp',
			loc: 'zip|20852|100|va-only',
		},
	],
	// Location -- NIH
	[
		'adv - location nih',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-nih',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc',
			loc: 'at nih',
		},
	],
	// Location -- CSC
	[
		'adv - location CSC - Country',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-country',
				country: 'United States',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:lcnty',
			loc: 'csc|united states|none|none',
		},
	],
	[
		'adv - location CSC - Country, City',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-country',
				country: 'United States',
				city: 'Baltimore',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:lcnty:lcty',
			loc: 'csc|united states|none|baltimore',
		},
	],
	[
		'adv - location CSC - Country, State',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-country',
				country: 'United States',
				states: ['MD', 'VA'],
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:lcnty:lst',
			loc: 'csc|united states|md,va|none',
		},
	],
	[
		'adv - location CSC - Country, State, City',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-country',
				country: 'United States',
				states: ['MD', 'VA'],
				city: 'Baltimore',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:lcnty:lst:lcty',
			loc: 'csc|united states|md,va|baltimore',
		},
	],
	[
		'adv - location CSC - Country, State, City - VA',
		{
			formType: 'advanced',
			formData: {
				location: 'search-location-country',
				country: 'United States',
				states: ['MD', 'VA'],
				city: 'Baltimore',
				vaOnly: true,
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 'loc:va:lcnty:lst:lcty',
			loc: 'csc|united states|md,va|baltimore|va-only',
		},
	],

	//https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?t=C3167&st=C8644%7CC9143%7CC9140&stg=C7883%7CC7784&fin=C3586&a=35&q=cancer&va=1&loc=0&hv=1&tt=treatment&tt=supportive_care&d=C1647&i=C65008&tp=I&tp=II&tid=nci&in=smith&lo=mayo&rl=2
	[
		'adv - minimum all non-location fields used',
		{
			formType: 'advanced',
			formData: {
				cancerType: ['c3167'],
				subtypes: [['c8644', 'c9140', 'c9143']],
				stages: [['c7784', 'c7883']],
				findings: [['c3586']],
				age: 35,
				keywordPhrases: 'Cancer',
				vaOnly: true,
				trialTypes: ['treatment', 'supportive_care'],
				drugs: [['C1647']],
				treatments: [['c65008']],
				healthyVolunteers: true,
				trialPhases: ['i', 'ii'],
				trialId: 'NCI',
				investigator: 'Smith',
				leadOrg: 'Mayo',
				location: 'search-location-all',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 't:st:stg:fin:a:q:loc:va:tt:d:i:hv:tp:tid:in:lo',
			canTypeKwPhrAge: 'c3167|c8644,c9140,c9143|c7784,c7883|c3586|35|cancer',
			loc: 'all|va-only',
			ttDrugTreat: 'tre,sup|c1647|c65008|hv',
			tpTidInvLo: 'i,ii|single:nci|smith|mayo',
		},
	],
	//https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/r?t=C4872&st=C40367&st=C162648&st=C66719&st=C161830&st=C53558&st=C8287&st=C5214&st=C4017&st=C2924&st=C2918&st=C53556&st=C9245&stg=C139556%7CC139535%7CC88375&stg=C7768%7CC139538%7CC139569&stg=C139582%7CC139541%7CC88376%7CC7769&stg=C139542%7CC139583%7CC7770&stg=C139584%7CC139543%7CC7782&stg=C139545%7CC139587%7CC3995&fin=C150629&fin=C150630&fin=C68749&fin=C68748&fin=C118311&fin=C162184&fin=C162183&a=&q=&loc=0&tt=treatment&tt=supportive_care&tt=diagnostic&tt=basic_science&tt=prevention&tt=health_services_research&tt=screening&d=C855&d=C2039&d=C308%7CC15262&d=C1687&d=C307&d=C143250&i=C15722&i=C15329&i=C94626&i=C15751&i=C15358&i=C15313&tp=I&tp=II&tp=III&tp=IV&tid=nci%2Cnct%2Ccct%2Cdcp%2Cswog%2Cctep&in=&lo=&rl=2
	[
		'adv - Overload a bunch of fields',
		{
			formType: 'advanced',
			formData: {
				cancerType: ['c4872'],
				subtypes: [['c1111'], ['c2222'], ['c3333'], ['c4444'], ['c5555']],
				stages: [['c1111'], ['c2222'], ['c3333'], ['c4444'], ['c5555']],
				findings: [['c1111'], ['c2222'], ['c3333'], ['c4444'], ['c5555']],
				trialTypes: [
					'treatment',
					'prevention',
					'supportive_care',
					'health_services_research',
					'diagnostic',
					'screening',
					'basic_science',
					'other',
				],
				drugs: [['c1111'], ['c2222'], ['c3333'], ['c4444'], ['c5555']],
				treatments: [['c1111'], ['c2222'], ['c3333'], ['c4444'], ['c5555']],
				trialPhases: ['i', 'ii', 'iii', 'iv'],
				trialId: 'nci,nct,cct,dcp,swog,ctep',
				location: 'search-location-all',
			},
		},
		{
			...DEFAULT_ADV_EVARS,
			fieldUsage: 't:st:stg:fin:tt:d:i:tp:tid',
			canTypeKwPhrAge: 'c4872|more than 5|more than 5|more than 5|none|none',
			loc: 'all',
			ttDrugTreat: 'tre,sup,dia,bas,pre,hea,scr,oth|more than 5|more than 5',
			tpTidInvLo: 'i,ii,iii,iv|multiple:nci,nct,cct,dcp,swog,ctep|none|none',
		},
	],
];

describe('FormDataConverter - load_results', () => {
	it.each(TEST_CASES)('%# - %s', (scenario, eventdata, expected) => {
		const actual = formDataConverter(eventdata.formType, eventdata.formData);
		expect(actual).toEqual(expected);
	});
});
