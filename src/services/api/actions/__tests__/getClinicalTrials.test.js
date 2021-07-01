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
				include: [
					'brief_summary',
					'brief_title',
					'current_trial_status',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'diseases.nci_thesaurus_concept_id': ['C5816', 'C8550', 'C3813'],
				'primary_purpose.primary_purpose_code': 'treatment',
				from: 0,
				size: 50,
			},
		};

		expect(getClinicalTrials({ requestFilters, from: 0, size: 50 })).toEqual(
			expectedAction
		);
	});
});
