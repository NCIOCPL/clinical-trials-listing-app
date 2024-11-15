import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { deepSearchObject } from '../utilities';

export const useCachedValues = (cacheKeys) => {
	const [currentVals, setCurrentVals] = useState({
		...cacheKeys.map((key) => ({ [key]: [] })),
	});
	const cache = useSelector((store) => store.cache);

	useEffect(() => {
		const newVals = Object.assign(
			{},
			...cacheKeys.map((key) => {
				const result = deepSearchObject(key, cache);
				return { [key]: result[0] || [] };
			})
		);
		setCurrentVals(newVals);
	}, [cache]);
	return currentVals;
};
