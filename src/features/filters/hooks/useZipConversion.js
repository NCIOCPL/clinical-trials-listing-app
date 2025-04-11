import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useStateValue } from '../../../store/store.jsx';

export const useZipConversion = () => {
	const [isError, setIsError] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [validationStatus, setValidationStatus] = useState(null);
	const abortControllerRef = useRef(null);

	const [{ zipConversionEndpoint }] = useStateValue();
	const zipBase = zipConversionEndpoint;

	const getZipCoords = useCallback(
		async (lookupZip) => {
			// Skip if no ZIP code
			if (!lookupZip || lookupZip === '') {
				setValidationStatus(null);
				return;
			}

			// Cancel any previous requests
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			// Create new abort controller for this request
			abortControllerRef.current = new AbortController();

			setIsLoading(true);
			setIsError(false);
			// Reset validation status when starting a new request
			setValidationStatus(null);

			const url = `${zipBase}/${lookupZip}`;

			try {
				const response = await axios.get(url, {
					signal: abortControllerRef.current.signal,
				});
				// if we don't get back a message, good to go
				if (response.data && !response.data.message) {
					setValidationStatus({
						isValid: true,
						coordinates: response.data,
					});
				} else {
					console.warn(`Invalid ZIP response for ${lookupZip}:`, response.data);
					setValidationStatus({
						isValid: false,
						coordinates: null,
					});
				}
			} catch (error) {
				if (error.name === 'AbortError') {
					console.debug(`ZIP lookup for ${lookupZip} aborted`);
					return;
				}

				// Enhanced error logging
				console.error(`Error fetching coordinates for ZIP ${lookupZip}:`, error);

				setValidationStatus({
					isValid: false,
					coordinates: null,
				});
				setIsError(true);
			} finally {
				setIsLoading(false);
			}
		},
		[zipBase]
	);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return [{ getZipCoords, isError, isLoading, validationStatus }];
};
