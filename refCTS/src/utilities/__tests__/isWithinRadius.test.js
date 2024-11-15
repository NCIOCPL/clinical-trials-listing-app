import { isWithinRadius } from '../isWithinRadius';

const siteCoordsInValid = {
	lat: 100,
	lon: 200,
};

const zipCoordsInValid = {
	lat: 300,
	long: 400,
};

const zipRadiusForInvalid = 500;

const siteCoordsValid = {
	lat: 500,
	lon: 600,
};

const zipCoordsValid = {
	lat: 100,
	long: 200,
};

const zipRadiusForValid = 4500;

const siteCoords = {
	lat: 23,
	lon: 11,
};

const zipCoords = {
	lat: 56,
	long: 34,
};

const zipRadius = 2563.069252151362;

describe('isWithinRadius', () => {
	it(`the answer should be false, since the resulting distance calculated by isWithinRadius, is greater than the zipRadius`, () => {
		const answer = isWithinRadius(
			zipCoordsInValid,
			siteCoordsInValid,
			zipRadiusForInvalid
		);
		expect(answer).toEqual(false);
	});

	it(`the answer should be true, since the resulting distance calculated by isWithinRadius, is less than the zipRadius`, () => {
		const answer = isWithinRadius(
			zipCoordsValid,
			siteCoordsValid,
			zipRadiusForValid
		);
		expect(answer).toEqual(true);
	});

	it(`the answer should be true, since the resulting distance calculated by isWithinRadius, is equal to zipRadius`, () => {
		const answer = isWithinRadius(zipCoords, siteCoords, zipRadius);
		expect(answer).toEqual(true);
	});
});
