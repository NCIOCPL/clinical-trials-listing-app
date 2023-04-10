import React from 'react';

import { getLocationInfoFromSites } from '../getLocationInfoFromSites';

describe('getLocationInfoFromSites', () => {
	const currentTrialStatus = 'Active';
	const nctId = 'NCT823704';

	it('should return location info "Wingstop, Gaithersburg, Maryland" when only 1 US location exists', () => {
		const sitesOneLocation = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
				recruitment_status: 'active',
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

	it('should return location info "Wingstop, Gaithersburg" when only 1 US location exists and no matching state code', () => {
		const sitesOneLocationNoMatchingStateCode = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'YY',
				recruitment_status: 'active',
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

	it('should return location count "4 locations" when US locations are more than 1', () => {
		const sitesMultipleLocations = [
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
				recruitment_status: 'active',
			},
			{
				org_country: 'United States',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
				recruitment_status: 'in_review',
			},
			{
				org_country: 'Belgium',
				org_name: 'Popeyes',
				org_city: 'Brussels',
				org_state_or_province: 'N/A',
				recruitment_status: 'approved',
			},
			{
				org_country: 'United States',
				org_name: 'KFC',
				org_city: 'New York City',
				org_state_or_province: 'NY',
				recruitment_status: 'approved',
			},
			{
				org_country: 'United States',
				org_name: "Arby's",
				org_city: 'Arlington',
				org_state_or_province: 'VA',
				recruitment_status: 'enrolling_by_invitation',
			},
		];

		const expectedJSX = (
			<>
				<strong>Location: </strong>4 locations
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

	it('should return expected jsx when no US locations for Active trial status', () => {
		const sitesNoUSLocation = [
			{
				org_country: 'United Kingdom',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
				recruitment_status: 'active',
			},
			{
				org_country: 'Brazil',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
				recruitment_status: 'enrolling_by_invitation',
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

	it('should return expected string when no US locations for [approved | in review | not yet active] trials status', () => {
		const sitesNoUSLocation = [
			{
				org_country: 'United Kingdom',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
				recruitment_status: 'approved',
			},
			{
				org_country: 'Brazil',
				org_name: 'Burger King',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
				recruitment_status: 'enrolling_by_invitation',
			},
		];

		const expectedJSX = (
			<>
				<strong>Location: </strong>Location information is not yet available.
			</>
		);
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

	it('should return expected string when recruitment status is "Completed, Closed_to_accrual, Administratively_complete, Closed_to_accrual_and_intervention, or Withdrawn"', () => {
		const siteLinkCT = `https://www.clinicaltrials.gov/show/${nctId}`;
		const sitesRecruitmentStatus = [
			{
				org_country: 'United States',
				org_name: 'Beechers',
				org_city: 'Seattle',
				org_state_or_province: 'WA',
				recruitment_status: 'completed',
			},
			{
				org_country: 'United States',
				org_name: 'Lenovo',
				org_city: 'Morisville',
				org_state_or_province: 'NC',
				recruitment_status: 'closed_to_accrual',
			},
			{
				org_country: 'United States',
				org_name: 'Wingstop',
				org_city: 'Gaithersburg',
				org_state_or_province: 'MD',
				recruitment_status: 'administratively_complete',
			},
			{
				org_country: 'United States',
				org_name: 'Walmart',
				org_city: 'Tampa',
				org_state_or_province: 'FL',
				recruitment_status: 'closed_to_accrual_and_intervention',
			},
			{
				org_country: 'United States',
				org_name: 'Home Depot',
				org_city: 'Fairfax',
				org_state_or_province: 'VA',
				recruitment_status: 'withdrawn',
			},
		];
		const jsxLink = (
			<a href={siteLinkCT} rel="noopener noreferrer" target="_blank">
				ClinicalTrials.gov
			</a>
		);
		const expectedJSX = (
			<>
				<strong>Location: </strong>
				<span>See {jsxLink}</span>
			</>
		);

		expect(
			getLocationInfoFromSites('completed', nctId, sitesRecruitmentStatus)
		).toMatchObject(expectedJSX);
	});
});
