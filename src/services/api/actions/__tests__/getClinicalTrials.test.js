import { getClinicalTrials } from '../index';

describe('getClinicalTrials action', () => {
test('should match getClinicalTrials action', () => {
		const requestFilters = {
			'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
			'primary_purpose.primary_purpose_code': 'treatment',
		};

		const expectedAction = {
			interceptorName: 'clinical-trials-api',
			method: 'POST',
			endpoint: `{{API_HOST}}/clinical-trials`,
			body: {
				current_trial_status: [
					'Active',
					'Approved',
					'Enrolling by Invitation',
					'In Review',
					'Temporarily Closed to Accrual',
					'Temporarily Closed to Accrual and Intervention',
				],
				'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
				'primary_purpose.primary_purpose_code': 'treatment',
			},
		};

		expect(getClinicalTrials({ requestFilters })).toEqual(expectedAction);
	});
});
