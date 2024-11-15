import { filterSitesByActiveRecruitment } from '../filterSitesByActiveRecruitment';

const sites = [
	{
		contact_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		contact_name: 'Site Public Contact',
		contact_phone: '907-212-6871',
		recruitment_status: 'ACTIVE',
		recruitment_status_date: '2020-08-20',
		local_site_identifier: '',
		org_address_line_1: '3200 Providence Drive',
		org_address_line_2: null,
		org_city: 'Anchorage',
		org_country: 'United States',
		org_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		org_family: null,
		org_fax: null,
		org_name: 'Providence Alaska Medical Center',
		org_to_family_relationship: null,
		org_phone: '907-261-3109\r907-224-5205',
		org_postal_code: '99508',
		org_state_or_province: 'AK',
		org_status: 'ACTIVE',
		org_status_date: '2020-08-20',
		org_tty: null,
		org_va: false,
		org_coordinates: {
			lat: 61.198,
			lon: -149.8115,
		},
	},
	{
		contact_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		contact_name: 'Site Public Contact',
		contact_phone: '907-212-6871',
		recruitment_status: 'COMPLETED',
		recruitment_status_date: '2020-08-20',
		local_site_identifier: '',
		org_address_line_1: '2841 DeBarr Road',
		org_address_line_2: null,
		org_city: 'Anchorage',
		org_country: 'United States',
		org_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		org_family: null,
		org_fax: null,
		org_name: 'Anchorage Radiation Therapy Center',
		org_to_family_relationship: null,
		org_phone: '907-212-6871',
		org_postal_code: '99504',
		org_state_or_province: 'AK',
		org_status: 'ACTIVE',
		org_status_date: '2020-08-20',
		org_tty: null,
		org_va: false,
		org_coordinates: {
			lat: 61.2016,
			lon: -149.7414,
		},
	},
	{
		contact_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		contact_name: 'Site Public Contact',
		contact_phone: '907-212-6871',
		recruitment_status: 'IN_REVIEW',
		recruitment_status_date: '2020-08-20',
		local_site_identifier: '',
		org_address_line_1: '3801 University Lake Drive',
		org_address_line_2: 'Suite 300-B2',
		org_city: 'Anchorage',
		org_country: 'United States',
		org_email: 'AKPAMC.OncologyResearchSupport@providence.org',
		org_family: null,
		org_fax: null,
		org_name: 'Anchorage Oncology Centre',
		org_to_family_relationship: null,
		org_phone: '907-569-2627',
		org_postal_code: '99508',
		org_state_or_province: 'AK',
		org_status: 'ACTIVE',
		org_status_date: '2020-08-20',
		org_tty: null,
		org_va: false,
		org_coordinates: {
			lat: 61.198,
			lon: -149.8115,
		},
	},
];

describe('filterSitesByActiveRecruitment()', () => {
	it('should return list of sites with only active recruitment statuses', () => {
		const activeRecruitmentSites = filterSitesByActiveRecruitment(sites);
		const expectedOrgs = [
			'Providence Alaska Medical Center',
			'Anchorage Oncology Centre',
		];

		expect(activeRecruitmentSites).toHaveLength(2);
		activeRecruitmentSites.map((activeSite) => {
			expect(expectedOrgs).toContain(activeSite.org_name);
		});
	});

	it('should return an empty array when no parameter is provided', () => {
		expect(filterSitesByActiveRecruitment()).toHaveLength(0);
	});
});
