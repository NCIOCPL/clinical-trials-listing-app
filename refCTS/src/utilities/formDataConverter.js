// import {formToTrackingData } from './formToTrackingData'

export const formDataConverter = (formType, formData) => {
	const FIELD_TO_KEY_MAP = {
		// We removed gender, so no longer tracking it either
		cancerType: 't',
		subtypes: 'st',
		stages: 'stg',
		findings: 'fin',
		age: 'a',
		keywordPhrases: 'q',
		location: 'loc',
		vaOnly: 'va',
		zip: 'z',
		zipRadius: 'zp',
		country: 'lcnty',
		states: 'lst',
		city: 'lcty',
		hospital: 'hos',
		healthyVolunteers: 'hv',
		trialTypes: 'tt',
		drugs: 'd',
		treatments: 'i',
		trialPhases: 'tp',
		trialId: 'tid',
		investigator: 'in',
		leadOrg: 'lo',
	};

	const ADV_FIELD_ORDER = [
		'cancerType',
		'subtypes',
		'stages',
		'findings',
		'age',
		'keywordPhrases',
		'location',
		'vaOnly',
		'zip',
		'zipRadius',
		'country',
		'states',
		'city',
		'hospital',
		'trialTypes',
		'drugs',
		'treatments',
		'healthyVolunteers',
		'trialPhases',
		'trialId',
		'investigator',
		'leadOrg',
	];

	const BASIC_FIELD_ORDER = [
		'cancerType',
		'age',
		'keywordPhrases',
		'location',
		'zip',
	];

	const TRIAL_TYPE_MAP = {
		treatment: 'tre',
		prevention: 'pre',
		supportive_care: 'sup',
		health_services_research: 'hea',
		diagnostic: 'dia',
		screening: 'scr',
		basic_science: 'bas',
		other: 'oth',
	};

	const TRIAL_TYPE_ORDER = [
		'treatment',
		'supportive_care',
		'diagnostic',
		'basic_science',
		'prevention',
		'health_services_research',
		'screening',
		'other',
	];

	/**
	 * Gets the string for a multicode field like
	 * stage, or drug.
	 * @param {*} fieldName
	 * @param {*} formData
	 */
	const getMultiCodeField = (fieldName, formData, unsetTxt = 'all') => {
		return formData[fieldName]
			? formData[fieldName].length >= 5
				? 'more than 5'
				: // Note these fields are multidimensional arrays of C-Codes
				  formData[fieldName]
						.reduce((ac, codesArr) => {
							return [...ac, ...codesArr];
						}, [])
						.map((id) => id.toLowerCase())
						.join(',')
			: unsetTxt;
	};

	/**
	 * Maps a list of trial types to their short codes, in order.
	 * @param {*} trialTypes
	 */
	const mapTrialTypeCodes = (trialTypes) => {
		if (!trialTypes || trialTypes.length === 0) {
			return 'all';
		}

		return TRIAL_TYPE_ORDER.reduce((ac, type) => {
			if (trialTypes.includes(type)) {
				return [...ac, TRIAL_TYPE_MAP[type]];
			}
			return ac;
		}, []).join(',');
	};

	const searchParamsAdvanced = (formData) => {
		/******
		 * PROP 15: Field Usage (Basic differs from Advanced)
		 ******/
		const searchParamKeys = ADV_FIELD_ORDER.reduce((ac, fieldName) => {
			if (formData[fieldName] && fieldName !== 'location') {
				ac = [...ac, FIELD_TO_KEY_MAP[fieldName]];
			} else if (
				fieldName === 'location' &&
				(formData['location'] !== 'search-location-all' || formData['vaOnly'])
			) {
				ac = [...ac, FIELD_TO_KEY_MAP['location']];
			}
			return ac;
		}, []).join(':');

		/******
		 * Prop 17: Basic Form Data
		 ******/
		const ct = formData['cancerType']
			? formData['cancerType'].map((code) => code.toLowerCase()).join(',')
			: 'all';
		const st = getMultiCodeField('subtypes', formData);
		const stg = getMultiCodeField('stages', formData);
		const fin = getMultiCodeField('findings', formData);
		const age = formData['age'] ? formData['age'] : 'none';
		const kw = formData['keywordPhrases']
			? formData['keywordPhrases'].toLowerCase()
			: 'none';

		const prop17 = `${ct}|${st}|${stg}|${fin}|${age}|${kw}`;

		/******
		 * Prop 19: Other fields pt 1
		 ******/

		const tt = mapTrialTypeCodes(formData['trialTypes']);
		const drug = getMultiCodeField('drugs', formData, 'none');
		const treat = getMultiCodeField('treatments', formData, 'none');
		//all|none|none'
		//all|none|none|hv'
		const prop19 = formData['healthyVolunteers']
			? `${tt}|${drug}|${treat}|hv`
			: `${tt}|${drug}|${treat}`;

		/******
		 * Prop 20: Other fields pt 2
		 ******/

		//'all|none|none|none',
		const tp = formData['trialPhases']
			? formData['trialPhases'].join(',')
			: 'all';
		const tid = formData['trialId']
			? formData['trialId'].includes(',')
				? `multiple:${formData['trialId'].toLowerCase()}`
				: `single:${formData['trialId'].toLowerCase()}`
			: 'none';
		const inv = formData['investigator']
			? formData['investigator'].toLowerCase()
			: 'none';
		const lo = formData['leadOrg'] ? formData['leadOrg'].toLowerCase() : 'none';
		const prop20 = `${tp}|${tid}|${inv}|${lo}`;

		return {
			fieldUsage: searchParamKeys !== '' ? searchParamKeys : 'none',
			canTypeKwPhrAge: prop17,
			ttDrugTreat: prop19,
			tpTidInvLo: prop20,
		};
	};

	/**
	 * Handles parsing of search params for basic form.
	 * (This is complicated enough that if basic then, blah
	 * checks were making it unreadable)
	 * @param {*} data
	 */
	const searchParamsBasic = (formData) => {
		/******
		 * PROP 15: Field Usage (Basic differs from Advanced)
		 ******/
		const searchParamKeys = BASIC_FIELD_ORDER.reduce((ac, fieldName) => {
			if (formData[fieldName] && fieldName !== 'location') {
				ac = [...ac, FIELD_TO_KEY_MAP[fieldName]];
			} else if (
				fieldName === 'location' &&
				formData['location'] === 'search-location-zip'
			) {
				ac = [...ac, FIELD_TO_KEY_MAP['location']];
			}
			return ac;
		}, []).join(':');

		/******
		 * Prop 17: Basic Form Data
		 ******/
		const prop17Main = formData['cancerType']
			? 'typecondition|' +
			  formData['cancerType'].map((code) => code.toLowerCase()).join(',')
			: formData['keywordPhrases']
			? 'keyword|' + formData['keywordPhrases'].toLowerCase()
			: 'none';
		const prop17Age = formData['age'] ? formData['age'] : 'none';

		/******
		 * Prop 18: Location
		 ******/

		return {
			fieldUsage: searchParamKeys !== '' ? searchParamKeys : 'none',
			canTypeKwPhrAge: prop17Main + '|' + prop17Age,
		};
	};

	const locationSearchParams = (formData) => {
		switch (formData['location']) {
			case 'search-location-zip': {
				if (formType === 'basic') {
					return `zip|${formData['zip']}|none`;
				} else {
					const zipStr = `zip|${formData['zip']}|${formData['zipRadius']}`;
					return formData['vaOnly'] ? zipStr + '|va-only' : zipStr;
				}
			}
			case 'search-location-country': {
				// Country should never not exist, but just in case we don't want
				// errors breaking the app.
				const country = formData['country']
					? formData['country'].toLowerCase()
					: 'none';
				const states = formData['states']
					? formData['states'].map((st) => st.toLowerCase()).join(',')
					: 'none';
				const city = formData['city'] ? formData['city'].toLowerCase() : 'none';

				if (formData['vaOnly']) {
					return `csc|${country}|${states}|${city}|va-only`;
				} else {
					return `csc|${country}|${states}|${city}`;
				}
			}
			case 'search-location-hospital': {
				return `hi|${formData['hospital']}`;
			}
			case 'search-location-nih': {
				return 'at nih';
			}
			case 'search-location-all':
			default: {
				if (formType === 'basic' || !formData['vaOnly']) {
					return 'all';
				} else {
					return 'all|va-only';
				}
			}
		}
	};

	const searchFormParams =
		formType === 'advanced'
			? searchParamsAdvanced(formData)
			: searchParamsBasic(formData);

	return {
		...searchFormParams,
		loc: locationSearchParams(formData),
	};
};
