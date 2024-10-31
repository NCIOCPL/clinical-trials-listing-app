import { useState } from 'react';

export const useFilterCounters = () => {
	const [filterAppliedCounter, setFilterAppliedCounter] = useState(0);
	const [filterRemovedCounter, setFilterRemovedCounter] = useState(0);

	return {
		filterAppliedCounter,
		filterRemovedCounter,
		incrementAppliedCounter: () => setFilterAppliedCounter((prev) => prev + 1),
		incrementRemovedCounter: () => setFilterRemovedCounter((prev) => prev + 1),
	};
};
