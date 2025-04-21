/**
 * @file This file defines the useFilterCounters hook, a simple utility hook
 * to track the number of times filters have been applied and removed/cleared.
 * This can be useful for analytics or conditional logic based on user interaction frequency.
 */
import { useState } from 'react';

/**
 * Custom hook to manage counters for filter application and removal actions.
 *
 * @returns {object} An object containing:
 *   - filterAppliedCounter {number}: The current count of filter applications.
 *   - filterRemovedCounter {number}: The current count of filter removals/clears.
 *   - incrementAppliedCounter {Function}: Function to increment the applied counter.
 *   - incrementRemovedCounter {Function}: Function to increment the removed counter.
 */
export const useFilterCounters = () => {
	// State for the counter tracking filter applications
	const [filterAppliedCounter, setFilterAppliedCounter] = useState(0);
	// State for the counter tracking filter removals/clears
	const [filterRemovedCounter, setFilterRemovedCounter] = useState(0);

	/**
	 * Increments the filter applied counter by one.
	 */
	const incrementAppliedCounter = () => setFilterAppliedCounter((prev) => prev + 1);

	/**
	 * Increments the filter removed/cleared counter by one.
	 */
	const incrementRemovedCounter = () => setFilterRemovedCounter((prev) => prev + 1);

	// Return the counter values and the increment functions
	return {
		filterAppliedCounter,
		filterRemovedCounter,
		incrementAppliedCounter,
		incrementRemovedCounter,
	};
};
