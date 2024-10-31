import { useLocation } from 'react-router-dom';

export const useURLQuery = () => {
	const { search } = useLocation();
	return new URLSearchParams(search);
};
