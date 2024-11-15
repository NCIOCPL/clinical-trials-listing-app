import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppSettings } from '../store/store.js';

export const useZipConversion = (updateFunc) => {
	const [zip, setZip] = useState();
	const [isError, setIsError] = useState(false);

	const [{ zipConversionEndpoint }] = useAppSettings();
	const zipBase = zipConversionEndpoint;

	useEffect(() => {
		const fetchZipCoords = async () => {
			setIsError(false);
			const url = `${zipBase}/${zip}`;
			try {
				const response = await axios.get(url);
				// if we don't get back a message, good to go
				if (response.data && !response.data.message) {
					updateFunc('zipCoords', response.data);
					updateFunc('hasInvalidZip', false);
				} else {
					updateFunc('hasInvalidZip', true);
				}
			} catch (error) {
				updateFunc('hasInvalidZip', true);
				setIsError(true);
			}
		};
		if (zip && zip !== '') {
			fetchZipCoords();
		}
	}, [zip]);

	const getZipCoords = (lookupZip) => {
		setZip(lookupZip);
	};
	return [{ getZipCoords, isError }];
};
