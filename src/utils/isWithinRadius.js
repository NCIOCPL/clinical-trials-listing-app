/*
 *
 * Calculates whether the distance from a point (expressed as a latitude and longitude) is
 * within radius miles of this location.
 *
 */

function degreeToRadian(val) {
	return (Math.PI / 180) * val;
}

export const isWithinRadius = (zipCoords, siteCoords, zipRadius) => {
	// Calculate the difference between this point and the other in miles,
	// using the Haversine formula.
	let resultDistance = 0.0;
	const avgRadiusOfEarth = 3960; //Radius of the earth differ, I'm taking the average.
	const zipLat = zipCoords.lat;
	const zipLong = zipCoords.long;
	if (!siteCoords) {
		return false;
	}
	const siteLat = siteCoords.lat;
	const siteLong = siteCoords.lon;

	/**
	 * Converts a Degree to Radians.
	 * @param val The value in degrees
	 * @returns The value in radians.
	 */

	//Haversine formula
	//distance = R * 2 * aTan2 ( square root of A, square root of 1 - A )
	//                   where A = sinus squared (difference in latitude / 2) + (cosine of latitude 1 * cosine of latitude 2 * sinus squared (difference in longitude / 2))
	//                   and R = the circumference of the earth

	let differenceInLat = degreeToRadian(zipLat - siteLat);
	let differenceInLong = degreeToRadian(zipLong - siteLong);
	let aInnerFormula = Math.cos(degreeToRadian(zipLat)) * Math.cos(degreeToRadian(siteLat)) * Math.sin(differenceInLong / 2) * Math.sin(differenceInLong / 2);
	let aFormula = Math.sin(differenceInLat / 2) * Math.sin(differenceInLat / 2) + aInnerFormula;
	resultDistance = avgRadiusOfEarth * 2 * Math.atan2(Math.sqrt(aFormula), Math.sqrt(1 - aFormula));
	return resultDistance <= zipRadius;
};
