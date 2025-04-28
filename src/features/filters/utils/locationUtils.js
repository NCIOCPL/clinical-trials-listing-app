/**
 * Utility functions for location filtering
 */

/**
 * Validates a zipcode format (5 digits)
 * @param {string} zipCode - The zipcode to validate
 * @returns {boolean} - Whether the zipcode is valid
 */
export const isValidZipFormat = (zipCode) => {
	return /^\d{5}$/.test(zipCode);
};

/**
 * Transforms location data into API filter parameters
 * @param {Object} location - The location object with zipCode and radius
 * @param {Object} zipCoords - The coordinates object with lat and long
 * @returns {Object} - The API filter parameters
 */
export const getLocationFilters = (location, zipCoords) => {
	if (!location?.zipCode || !location?.radius || !zipCoords) {
		return {};
	}

	if (!zipCoords.lat || !zipCoords.long) {
		return {};
	}

	const lat = String(zipCoords.lat);
	const lon = String(zipCoords.long);

	if (!lat || !lon) {
		return {};
	}

	return {
		'sites.org_coordinates_lat': lat,
		'sites.org_coordinates_lon': lon,
		'sites.org_coordinates_dist': `${location.radius}mi`,
		'sites.recruitment_status': ['active', 'approved', 'enrolling_by_invitation', 'in_review', 'temporarily_closed_to_accrual'],
	};
};
