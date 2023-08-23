/**
 * @file This file contains utility functions related to geographical coordinates and radius formatting.
 * It includes a hardcoded mapping for ZIP code coordinates (potentially for testing or defaults)
 * and a function to format radius values.
 * NOTE: The primary mechanism for getting coordinates appears to be the useZipConversion hook.
 */

/**
 * A hardcoded mapping of ZIP codes to their approximate coordinates.
 * This might be used for testing, default values, or as a fallback,
 * but the main coordinate lookup likely uses an API via useZipConversion.
 * @type {Object.<string, {lat: string, lon: string}>}
 */
const zipCoordinates = {
	// Example entry for Rockville, MD
	20850: {
		lat: '38.928',
		lon: '-77.2649',
	},
	// Add other hardcoded ZIPs if needed for specific purposes
};

/**
 * Retrieves hardcoded coordinates for a given ZIP code from the local mapping.
 * Returns null if the ZIP code is not found in the hardcoded map.
 *
 * @param {string|number} zipCode - The ZIP code to look up.
 * @returns {{lat: string, lon: string}|null} The coordinates object or null.
 */
export const getCoordinatesForZip = (zipCode) => {
	return zipCoordinates[zipCode] || null;
};

/**
 * Formats a radius value (assumed to be in miles) into a string with 'mi' suffix.
 *
 * @param {string|number} radius - The radius value.
 * @returns {string} The formatted radius string (e.g., "100mi").
 */
export const formatRadius = (radius) => {
	// Appends 'mi' to the radius value
	return `${radius}mi`;
};
