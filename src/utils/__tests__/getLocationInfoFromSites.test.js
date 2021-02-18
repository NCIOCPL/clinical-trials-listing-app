import React from 'react';

import { getLocationInfoFromSites } from '../getLocationInfoFromSites';

describe('getLocationInfoFromSites', () => {
	const currentTrialStatus = 'Active';
	const nctId = 'NCT823704';

	test('should return location info "Wingstop, Gaithersburg, Maryland" when only 1 US location exists', () => {
		const sitesOneLocation = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
			},
		];
		const expectedJSX = (
			<>
				<strong>Location: </strong>Wingstop, Gaithersburg, Maryland
			</>
		);

		expect(
			getLocationInfoFromSites(currentTrialStatus, nctId, sitesOneLocation)
		).toMatchObject(expectedJSX);
	});

	test('should return location info "Wingstop, Gaithersburg" when only 1 US location exists and no matching state code', () => {
		const sitesOneLocationNoMatchingStateCode = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'YY',
			},
		];

		const expectedJSX = (
			<>
				<strong>Location: </strong>Wingstop, Gaithersburg
			</>
		);

		expect(
			getLocationInfoFromSites(
				currentTrialStatus,
				nctId,
				sitesOneLocationNoMatchingStateCode
			)
		).toMatchObject(expectedJSX);
	});

	test('should return location count "4 Locations" when US locations are more than 1', () => {
		const sitesMultipleLocations = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
			},
			{
				org_country: 'United States',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
			},
			{
				org_country: 'Belgium',
				org_name: 'Popeyes',
				org_city: 'Brussels',
				org_state_or_province: 'N/A',
			},
			{
				org_country: 'United States',
				org_name: 'KFC',
				org_city: 'New York City',
				org_state_or_province: 'NY',
			},
			{
				org_country: 'United States',
				org_name: "Arby's",
				org_city: 'Arlington',
				org_state_or_province: 'VA',
			},
		];

		const expectedJSX = (
			<>
				<strong>Location: </strong>4 Locations
			</>
		);

		expect(
			getLocationInfoFromSites(
				currentTrialStatus,
				nctId,
				sitesMultipleLocations
			)
		).toMatchObject(expectedJSX);
	});

	test('should return expected jsx when no US locations for Active trial status', () => {
		const sitesNoUSLocation = [
			{
				org_country: 'United Kingdom',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
			},
			{
				org_country: 'Brazil',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
			},
		];

		const jsxPartial = (
			<a
				href={`https://www.clinicaltrials.gov/show/${nctId}`}
				rel="noopener noreferrer"
				target="_blank">
				ClinicalTrials.gov
			</a>
		);

		const expectedJSX = (
			<>
				<strong>Location: </strong>
				<span>See {jsxPartial}</span>
			</>
		);

		expect(
			getLocationInfoFromSites(currentTrialStatus, nctId, sitesNoUSLocation)
		).toMatchObject(expectedJSX);
	});

	test('should return expected string when no US locations for [approved | in review | not yet active] trials status', () => {
		const sitesNoUSLocation = [
			{
				org_country: 'United Kingdom',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
			},
			{
				org_country: 'Brazil',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
			},
		];

		const expectedJSX = <>Location information is not yet available.</>;
		expect(
			getLocationInfoFromSites('not yet active', nctId, sitesNoUSLocation)
		).toMatchObject(expectedJSX);
		expect(
			getLocationInfoFromSites('in review', nctId, sitesNoUSLocation)
		).toMatchObject(expectedJSX);
		expect(
			getLocationInfoFromSites('approved', nctId, sitesNoUSLocation)
		).toMatchObject(expectedJSX);
	});
});
