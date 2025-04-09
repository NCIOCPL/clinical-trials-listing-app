import { URL_PARAM_MAPPING } from '../constants/urlParams';

export const FILTER_CONFIG = {
	maintype: {
		title: 'Primary Cancer Type/Condition',
		type: 'combobox',
		multiSelect: false,
		helpText: 'Search for a primary cancer type or condition.',
		placeholder: 'Start typing to select a type',
		urlParam: URL_PARAM_MAPPING.maintype?.shortCode,
	},
	subtype: {
		title: 'Subtype',
		type: 'combobox',
		multiSelect: true,
		helpText: 'More than one selection may be made.',
		placeholder: 'Start typing to select a subtype',
		options: [
			{ id: 'her2_pos', label: 'HER2-Positive', value: 'her2_pos' },
			{ id: 'her2_neg', label: 'HER2-Negative', value: 'her2_neg' },
			{ id: 'triple_neg', label: 'Triple Negative', value: 'triple_neg' },
		],
	},

	stage: {
		title: 'Stage',
		type: 'combobox',
		multiSelect: false,
		placeholder: 'Select',
		options: [
			{ id: 'stage_1', label: 'Stage I', value: 'stage_1' },
			{ id: 'stage_2', label: 'Stage II', value: 'stage_2' },
		],
	},

	drugIntervention: {
		title: 'Drug/Intervention',
		type: 'combobox',
		multiSelect: true,
		helpText: "You can use the drug's generic or brand name. More than one selection may be made.",
		placeholder: 'Start typing to select drugs and/or drug combinations',
	},

	age: {
		title: 'Age',
		type: 'number',
		placeholder: 'Enter the age of the participant.',
		min: 0,
		max: 120,
		urlParam: URL_PARAM_MAPPING.age.shortCode,
	},

	location: {
		title: 'Location by Zip Code',
		type: 'text',
		placeholder: 'Enter U.S. Zip Code',
		urlParam: URL_PARAM_MAPPING.zipCode.shortCode,
	},

	radius: {
		title: 'Radius',
		type: 'select',
		options: [
			{ id: '20', label: '20 miles', value: '20' },
			{ id: '50', label: '50 miles', value: '50' },
			{ id: '100', label: '100 miles', value: '100' },
			{ id: '200', label: '200 miles', value: '200' },
			{ id: '500', label: '500 miles', value: '500' },
		],
		urlParam: URL_PARAM_MAPPING.radius.shortCode,
	},
};

// Original was using an arrray of objects for this. Could still be handy to
// encode ordering / iterate over the values in array so adding this.
export const getFilterArray = () => Object.values(FILTER_CONFIG);

/// An array options that can be mapped over
export const getFilterOptions = (id) => FILTER_CONFIG[id]?.options || [];
