// import querystring from 'query-string';
import {
	UPDATE_FORM_FIELD,
	UPDATE_FORM,
	UPDATE_FORM_SEARCH_CRITERIA,
	CLEAR_FORM,
	RECEIVE_DATA,
} from './identifiers';

import { ACTIVE_TRIAL_STATUSES } from '../constants';

/**
 * Facade wrapping a ClinicalTrialsService instance to create app specific methods
 * and simplify interacting with API.  Ported from ctapi-facade.ts from WCMS
 */

export function updateFormField({ field, value }) {
	return {
		type: UPDATE_FORM_FIELD,
		payload: {
			field,
			value,
		},
	};
}

export function updateForm(newState) {
	return {
		type: UPDATE_FORM,
		payload: newState,
	};
}

export function updateFormSearchCriteria(newState) {
	return {
		type: UPDATE_FORM_SEARCH_CRITERIA,
		payload: newState,
	};
}

export function receiveData(cacheKey, value) {
	return {
		type: RECEIVE_DATA,
		payload: {
			cacheKey,
			value,
		},
	};
}

export function clearForm() {
	return {
		type: CLEAR_FORM,
	};
}

export function getDiseasesForSimpleTypeAhead({
	name,
	size = 10,
	isDebug = false,
}) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: 'diseases',
			requests: [
				{
					method: 'getDiseases',
					requestParams: {
						category: ['maintype', 'subtype', 'stage'],
						ancestorId: undefined,
						additionalParams: {
							name,
							size,
							sort: 'cancergov',
							current_trial_status: ACTIVE_TRIAL_STATUSES,
						},
					},
					fetchHandlers: {
						formatResponse: (res) => {
							let diseases = [...res];

							// TODO: DEBUG
							if (isDebug) {
								diseases.forEach(
									(disease) =>
										(disease.name += ' (' + disease.codes.join('|') + ')')
								);
							}

							return diseases;
						},
					},
				},
			],
		},
	};
}

export function searchTrials({ cacheKey, data }) {
	return {
		type: '@@api/CTS',
		payload: {
			service: 'ctsSearch',
			cacheKey: cacheKey,
			requests: [
				{
					method: 'searchTrials',
					requestParams: {
						document: JSON.stringify(data),
					},
				},
			],
		},
	};
}
