/**
 * @file This file defines the useZipConversion hook, responsible for converting
 * a US ZIP code into geographical coordinates (latitude and longitude) by calling
 * an external API. It handles loading states, errors, and request cancellation.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useStateValue } from '../../../store/store.jsx';

/**
 * Custom hook to fetch geographic coordinates for a given US ZIP code.
 * Manages API request lifecycle including loading, error handling, and cancellation
 * of previous requests if a new ZIP code is provided before the previous one completes.
 *
 * @returns {Array} An array containing an object with:
 *   - getZipCoords {Function}: Async function to initiate the coordinate lookup for a ZIP code.
 *   - isError {boolean}: Flag indicating if the last request resulted in an error.
 *   - isLoading {boolean}: Flag indicating if a request is currently in progress.
 *   - validationStatus {object|null}: Object indicating validation result `{ isValid: boolean, coordinates: object|null }` or null if not yet validated.
 */
export const useZipConversion = () => {
	// State variables to track the request status
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	// State to store the result of the validation (isValid and coordinates)
	const [validationStatus, setValidationStatus] = useState(null);
	// Ref to hold the AbortController for cancelling requests
	const abortControllerRef = useRef(null);

	// Get the ZIP conversion API endpoint from global state
	const [{ zipConversionEndpoint }] = useStateValue();
	// Use the endpoint from state or potentially a default fallback if needed
	const zipBase = zipConversionEndpoint; // || 'DEFAULT_ZIP_API_ENDPOINT';

	/**
	 * Fetches coordinates for the given ZIP code.
	 * Memoized with useCallback to prevent unnecessary re-creation.
	 * Handles request cancellation, loading/error states, and updates validationStatus.
	 *
	 * @param {string} lookupZip - The 5-digit US ZIP code to look up.
	 */
	const getZipCoords = useCallback(
		async (lookupZip) => {
			// Skip if no ZIP code is provided
			if (!lookupZip || lookupZip === '') {
				setValidationStatus(null); // Reset validation if ZIP is cleared
				return;
			}

			// Cancel any ongoing request before starting a new one
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create a new AbortController for the current request
			abortControllerRef.current = new AbortController();

			// Set loading state and reset error/validation status
			setIsLoading(true);
			setIsError(false);
			setValidationStatus(null); // Reset validation status for the new request

			// Construct the API URL
			const url = `${zipBase}/${lookupZip}`;

			try {
				// Make the API request using axios, passing the abort signal
				const response = await axios.get(url, {
					signal: abortControllerRef.current.signal,
				});

				// Check if the response contains valid coordinate data (and not an error message)
				if (response.data && !response.data.message) {
					// Successful validation: update status with coordinates
					setValidationStatus({
						isValid: true,
						coordinates: response.data,
					});
				} else {
					// API returned a message (likely indicating invalid ZIP)
					// console.warn(`Invalid ZIP response for ${lookupZip}:`, response.data);
					setValidationStatus({
						isValid: false,
						coordinates: null,
					});
				}
			} catch (error) {
				// Handle aborted requests specifically - do not treat as an error
				if (error.name === 'AbortError') {
					// console.debug(`ZIP lookup for ${lookupZip} aborted`);
					return; // Exit silently if the request was aborted
				}

				// Log other errors during development
				// console.error(`Error fetching coordinates for ZIP ${lookupZip}:`, error);

				// Set validation status to invalid and indicate an error occurred
				setValidationStatus({
					isValid: false,
					coordinates: null,
				});
				setIsError(true);
			} finally {
				// Always reset loading state when the request finishes (success, error, or abort)
				setIsLoading(false);
			}
		},
		[zipBase] // Dependency: re-create function only if zipBase endpoint changes
	);

	/**
	 * Effect hook for cleanup: Abort any ongoing request when the component unmounts.
	 */
	useEffect(() => {
		// Return a cleanup function
		return () => {
			if (abortControllerRef.current) {
				// Abort the request if it's still active
				abortControllerRef.current.abort();
			}
		};
	}, []); // Empty dependency array ensures this runs only on unmount

	// Return the state and the function to initiate the lookup
	return [{ getZipCoords, isError, isLoading, validationStatus }];
};
