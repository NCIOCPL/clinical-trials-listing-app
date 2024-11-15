import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const useHasLocationChanged = (callback) => {
	const location = useLocation().pathname;
	useEffect(() => {
		callback();
	}, [location, callback]);
};
