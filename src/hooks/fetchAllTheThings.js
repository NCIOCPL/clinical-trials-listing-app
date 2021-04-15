import { useEffect, useState } from 'react';

export const fetchAllTheThings = (theThings) => {
	const [loading, setLoading] = useState(true);
	const [payload, setPayload] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		switch (theThings.fetchName) {
			case 'getListingInformationByName':
				setPayload([
					{
						conceptId: ['C4872'],
						name: {
							label: 'Breast Cancer',
							normalized: 'breast cancer',
						},
						prettyUrlName: 'breast-cancer',
					},
				]);
				setError(false);
				setLoading(false);

			case 'getListingInformationById':
				setPayload([
					{
						conceptId: ['C4872'],
						name: {
							label: 'Breast Cancer',
							normalized: 'breast cancer',
						},
						prettyUrlName: 'breast-cancer',
					},
				]);
				setError(false);
				setLoading(false);

			default:
				setError(new Error('Fetch Name provided is invalid.'));
				setLoading(false);
		}
	}, []);

	return {
		loading: loading,
		payload: payload,
		error: error,
	};
};

// takes in
// param: array[object]
// fetchName: string (getListingInformationByName, getListingInformationbyId, getTrialType)
// fetchParams: string or array

// returns
// array[object]
// payload: object
// loading: bool
