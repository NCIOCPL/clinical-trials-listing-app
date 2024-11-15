import { getClinicalTrialsAction } from '../getClinicalTrialsAction';

describe('testing getClinicalTrials', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('creates a query, when given requestFilters', async () => {
		const expectedQuery = {
			type: 'getClinicalTrials',
			payload: {
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
					'eligibility',
					'eligibility.structured.minAgeInt',
					'eligibility.structured.maxAgeInt',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				'arms.interventions.nci_thesaurus_concept_id': ['C1234'],
				primary_purpose: 'treatment',
				from: 0,
				size: 10,
			},
		};

		const requestFilters = {
			'arms.interventions.nci_thesaurus_concept_id': ['C1234'],
			primary_purpose: 'treatment',
		};

		const requestQuery = getClinicalTrialsAction({
			requestFilters,
		});

		expect(requestQuery).toMatchObject(expectedQuery);
	});

	it('creates a query without any requestFilters', async () => {
		const expectedQuery = {
			type: 'getClinicalTrials',
			payload: {
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
					'eligibility',
					'eligibility.structured.minAgeInt',
					'eligibility.structured.maxAgeInt',
					'nci_id',
					'nct_id',
					'sites.org_name',
					'sites.org_country',
					'sites.org_state_or_province',
					'sites.org_city',
					'sites.recruitment_status',
				],
				from: 5,
				size: 10,
			},
		};

		const requestQuery = getClinicalTrialsAction({
			from: 5,
			size: 10,
		});

		expect(requestQuery).toMatchObject(expectedQuery);
	});
});
