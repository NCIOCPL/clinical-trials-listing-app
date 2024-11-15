import { useState, useEffect } from 'react';
import axios from 'axios';

// fetches cache id for clinical trials print service
export const usePrintApi = (printObj = {}, printAPIUrl = '') => {
	const [data, setData] = useState({});
	const [isError, setIsError] = useState(false);
	const [url, setUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setIsError(false);
			setIsLoading(true);
			const headers = {
				'Content-Type': 'application/json',
			};
			try {
				const result = await axios.post(url, printObj, {
					headers: headers,
				});
				setData(result.data);
			} catch (error) {
				setIsError(true);
			}
			setIsLoading(false);
		};
		if (url && url !== '') {
			fetchData();
		}
	}, [url]);

	const doPrint = () => {
		setUrl(printAPIUrl);
	};

	return [{ data, isLoading, isError, doPrint }];
};
