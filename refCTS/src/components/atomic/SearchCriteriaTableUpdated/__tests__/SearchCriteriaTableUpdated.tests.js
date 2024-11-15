import { render, screen } from '@testing-library/react';
import React from 'react';
import { SearchCriteriaTableUpdated } from '../../../atomic';

describe('<Search Criteria Table />', () => {
	/* eslint-disable testing-library/no-node-access */
	it("doesn't draw Search Criteria table when criteria object is empty", () => {
		const searchObject = {
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
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);
		expect(screen.queryByText('Show Search Criteria')).not.toBeInTheDocument();
	});

	it('Kitchen sink test Advanced search- draw a table with all possible values present', () => {
		const searchObject = {
			age: '40', // (a) Age
			cancerType: { name: 'Breast Cancer', codes: ['C4872'] }, // (ct) Cancer Type/Condition
			subtypes: [{ name: 'Bilateral Breast Cancer', codes: ['C6789'] }], // (st) Subtype
			stages: [{ name: 'Early-Stage Breast Cancer', codes: ['C5678'] }], // (stg) Stage
			findings: [{ name: 'Cancer Survivor', codes: ['C1234'] }], // (fin) Side effects
			keywordPhrases: 'breast cancer', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
			zip: '22182', // (z) Zipcode
			zipCoords: { lat: '', long: '' },
			zipRadius: '50', //(zp) Radius
			country: '', // (lcnty) Country
			states: [], // (lst) State
			city: '', // (lcty) City
			hospital: { term: '', termKey: '' }, // (hos) Hospital
			healthyVolunteers: true, // (hv) Healthy Volunteers,
			trialTypes: [
				{ label: 'Treatment', value: 'treatment', checked: true },
				{ label: 'Prevention', value: 'prevention', checked: true },
				{ label: 'Supportive Care', value: 'supportive_care', checked: true },
				{
					label: 'Health Services Research',
					value: 'health_services_research',
					checked: true,
				},
				{ label: 'Diagnostic', value: 'diagnostic', checked: true },
				{ label: 'Screening', value: 'screening', checked: true },
				{ label: 'Basic Science', value: 'basic_science', checked: true },
				{ label: 'Other', value: 'other', checked: true },
			], // (tt) Trial Type
			trialPhases: [
				{ label: 'Phase I', value: 'i', checked: true },
				{ label: 'Phase II', value: 'ii', checked: true },
				{ label: 'Phase III', value: 'iii', checked: true },
				{ label: 'Phase IV', value: 'iv', checked: true },
			], // (tp) Trial phase
			vaOnly: true, // (va) VA facilities only
			drugs: [{ name: 'Bevacizumab', codes: ['C6789'] }], // (dt) Drug/Drug family
			treatments: [{ name: 'Radiation Therapy', codes: ['C5678'] }], // (ti) Treatment/Interventions
			trialId: '', // (tid) Trial ID,
			investigator: { term: 'Peng Wang', termKey: 'in' }, // (in) Trial investigators ('in' is legacy but is a keyword and does not work well as a key name; be ready to handle both in query string)
			leadOrg: { term: 'Sanofi Aventis', termKey: 'lo' }, // (lo) Lead Organization
			formType: 'advanced', // (empty string (default) | basic | advanced)
			location: 'search-location-zip', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(screen.queryByText('Show Search Criteria')).toBeInTheDocument();
		expect(screen.getByText('Category')).toBeInTheDocument();
		expect(screen.getByText('Your Selection')).toBeInTheDocument();

		const expectedTable = [
			{
				key: 'Primary Cancer Type/Condition',
				value: 'Breast Cancer',
			},
			{
				key: 'Subtype',
				value: 'Bilateral Breast Cancer',
			},
			{
				key: 'Stage',
				value: 'Early-Stage Breast Cancer',
			},
			{
				key: 'Side Effects / Biomarkers / Participant Attributes',
				value: 'Cancer Survivor',
			},
			{
				key: 'Age',
				value: '40',
			},

			{
				key: 'Keywords/Phrases',
				value: 'breast cancer',
			},
			{
				key: 'Near ZIP Code',
				value: 'within 50 miles of 22182',
			},
			{
				key: 'Veterans Affairs Facilities',
				value: 'Results limited to trials at Veterans Affairs facilities',
			},
			{
				key: 'Healthy Volunteers',
				value: 'Results limited to trials accepting healthy volunteers',
			},
			{
				key: 'Trial Type',
				value:
					'Treatment, Prevention, Supportive Care, Health Services Research, Diagnostic, Screening, Basic Science, Other',
			},
			{
				key: 'Drug/Drug Family',
				value: 'Bevacizumab',
			},
			{
				key: 'Other Treatments',
				value: 'Radiation Therapy',
			},
			{
				key: 'Trial Phase',
				value: 'Phase I, Phase II, Phase III, Phase IV',
			},
			{
				key: 'Trial Investigators',
				value: 'Peng Wang',
			},
			{
				key: 'Lead Organizations',
				value: 'Sanofi Aventis',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
	});

	it('Kitchen sink for the Basic searc form fields - draw search criteria table', () => {
		const searchObject = {
			age: '40', // (a) Age
			cancerType: { name: '', codes: [] }, // (ct) Cancer Type/Condition
			subtypes: [], // (st) Subtype
			stages: [], // (stg) Stage
			findings: [], // (fin) Side effects
			keywordPhrases: 'breast cancer', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
			zip: '20165', // (z) Zipcode
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

			formType: 'basic', // (empty string (default) | basic | advanced)
			location: 'search-location-zip', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		const expectedTable = [
			{
				key: 'Keywords/Phrases',
				value: 'breast cancer',
			},
			{
				key: 'Age',
				value: '40',
			},
			{
				key: 'Near ZIP Code',
				value: 'within 100 miles of 20165',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
	});

	it('Location section - country, state, city - draw search criteria table', () => {
		const searchObject = {
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
			states: [{ name: 'Alabama' }, { name: 'Alaska' }], // (lst) State
			city: 'Arlington', // (lcty) City
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

			formType: 'advanced', // (empty string (default) | basic | advanced)
			location: 'search-location-country', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		const expectedTable = [
			{
				key: 'Country',
				value: 'United States',
			},
			{
				key: 'State',
				value: 'Alabama, Alaska',
			},
			{
				key: 'City',
				value: 'Arlington',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
	});

	it('Location section - foreign country, city - draw search criteria table', () => {
		const searchObject = {
			age: '', // (a) Age
			cancerType: { name: '', codes: [] }, // (ct) Cancer Type/Condition
			subtypes: [], // (st) Subtype
			stages: [], // (stg) Stage
			findings: [], // (fin) Side effects
			keywordPhrases: '', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
			zip: '', // (z) Zipcode
			zipCoords: { lat: '', long: '' },
			zipRadius: '100', //(zp) Radius
			country: 'Uganda', // (lcnty) Country
			states: [], // (lst) State
			city: 'Arlington', // (lcty) City
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

			formType: 'advanced', // (empty string (default) | basic | advanced)
			location: 'search-location-country', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		const expectedTable = [
			{
				key: 'Country',
				value: 'Uganda',
			},
			{
				key: 'City',
				value: 'Arlington',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
	});

	it('Trial ID with Location section - hospitals/institutions- draw search criteria table', () => {
		const searchObject = {
			age: '', // (a) Age
			cancerType: { name: '', codes: [] }, // (ct) Cancer Type/Condition
			subtypes: [], // (st) Subtype
			stages: [], // (stg) Stage
			findings: [], // (fin) Side effects
			keywordPhrases: '', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
			zip: '', // (z) Zipcode
			zipCoords: { lat: '', long: '' },
			zipRadius: '100', //(zp) Radius
			country: '', // (lcnty) Country
			states: [], // (lst) State
			city: '', // (lcty) City
			hospital: { term: 'Lenox Hill Hospital', termKey: 'hos' }, // (hos) Hospital
			healthyVolunteers: false, // (hv) Healthy Volunteers,
			trialTypes: [
				{ label: 'Treatment', value: 'treatment', checked: true },
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
				{ label: 'Phase I', value: 'i', checked: true },
				{ label: 'Phase II', value: 'ii', checked: false },
				{ label: 'Phase III', value: 'iii', checked: false },
				{ label: 'Phase IV', value: 'iv', checked: false },
			], // (tp) Trial phase
			vaOnly: false, // (va) VA facilities only
			drugs: [], // (dt) Drug/Drug family
			treatments: [], // (ti) Treatment/Interventions
			trialId: 'NCI-2015-00054', // (tid) Trial ID,
			investigator: { term: '', termKey: '' }, // (in) Trial investigators ('in' is legacy but is a keyword and does not work well as a key name; be ready to handle both in query string)
			leadOrg: { term: '', termKey: '' }, // (lo) Lead Organization
			resultsPage: 1,

			formType: 'advanced', // (empty string (default) | basic | advanced)
			location: 'search-location-hospital', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		const expectedTable = [
			{
				key: 'At Hospital/Institution',
				value: 'Lenox Hill Hospital',
			},
			{
				key: 'Trial Type',
				value: 'Treatment',
			},
			{
				key: 'Trial ID',
				value: 'NCI-2015-00054',
			},
			{
				key: 'Trial Phase',
				value: 'Phase I',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
	});

	it('Location section - at NIH only- draw search criteria table', () => {
		const searchObject = {
			age: '', // (a) Age
			cancerType: { name: '', codes: [] }, // (ct) Cancer Type/Condition
			subtypes: [], // (st) Subtype
			stages: [], // (stg) Stage
			findings: [], // (fin) Side effects
			keywordPhrases: '', // (q) Cancer Type Keyword (ALSO Keyword Phrases)
			zip: '', // (z) Zipcode
			zipCoords: { lat: '', long: '' },
			zipRadius: '100', //(zp) Radius
			country: '', // (lcnty) Country
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

			formType: 'advanced', // (empty string (default) | basic | advanced)
			location: 'search-location-nih', // active location option (search-location-all | search-location-zip | search-location-country | search-location-hospital | search-location-nih)
		};
		render(<SearchCriteriaTableUpdated searchCriteriaObject={searchObject} />);

		const expectedTable = [
			{
				key: 'At NIH',
				value: 'Only show trials at the NIH Clinical Center (Bethesda, MD)',
			},
		];

		expect(
			document.querySelector('.cts-accordion.table-dropdown')
		).toBeVisible();
		expect(document.querySelectorAll('tbody tr th')).toHaveLength(
			expectedTable.length
		);
		// verify that the criteria table displays items in the expected order
		for (let i = 0; i < expectedTable.length; i++) {
			expect(document.querySelectorAll('tbody tr th')[i]).toHaveTextContent(
				expectedTable[i].key
			);
			expect(document.querySelectorAll('tbody tr td')[i]).toHaveTextContent(
				expectedTable[i].value
			);
		}
		/* eslint-disable testing-library/no-node-access */
	});
});
