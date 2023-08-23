/**
 * @file This file defines the useURLQuery hook, a simple utility hook
 * to easily access the current URL's query parameters as a URLSearchParams object.
 */
import { useLocation } from 'react-router-dom';

/**
 * Custom hook that returns the current URL query string parsed into a URLSearchParams object.
 * This provides a convenient way to read URL parameters within components.
 *
 * @returns {URLSearchParams} A URLSearchParams object representing the current URL's query string.
 */
export const useURLQuery = () => {
	// Get the location object from react-router-dom
	const { search } = useLocation();
	// Create and return a new URLSearchParams object from the search string (e.g., "?foo=bar")
	return new URLSearchParams(search);
};
