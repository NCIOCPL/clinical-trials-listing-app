import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './StageFilter.scss';

import ComboBox from '../ComboBox/ComboBox';

import { useStageSearch } from '../../../../hooks/ctsApiSupport/useStageSearch';

const StageFilter = ({ disabled = false, onFocus, setIsInvalidQuery }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const isHandlingChangeRef = useRef(false);

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	const { options, isLoading } = useStageSearch(maintypeCode);
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.stage) ? filters.stage : [];

	// Detect if we need to load stage data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.stage) && filters.stage.length > 0) {
			return filters.stage[0];
		}
		return null;
	}, [filters.stage]);

	// Effect to update filter when stage data loads from URL
	React.useEffect(() => {
		const matchingStage = formattedOptions.find((option) => option.value && option.value.includes(conceptCodeFromUrl));
		if (conceptCodeFromUrl) {
			if (formattedOptions.length > 0 && maintypeCode) {
				// Find the stage with matching concept code
				if (matchingStage) {
					// If a valid query param then set isInvalidQuery to false
					setIsInvalidQuery(false);
				} else if (!isLoading && !matchingStage) {
					// If invalid query param then set isInvalidQuery to true
					setIsInvalidQuery(true);
					// If invalid query param then clear out all the filters
					dispatch({
						type: 'CLEAR_FILTERS',
					});
				}
			} else if (!maintypeCode) {
				// If invalid query param then set isInvalidQuery to true
				setIsInvalidQuery(true);
				// If invalid query param then clear out all the filters
				dispatch({
					type: 'CLEAR_FILTERS',
				});
			}
		}
	}, [conceptCodeFromUrl, formattedOptions, isLoading, dispatch]);

	// Effect to update isInvalidQuery if there is no invalid query parameter
	React.useEffect(() => {
		if (Array.isArray(filters.stage) && filters.stage.length > 0 && filters.stage[0].name) {
			setIsInvalidQuery(false);
		}
	}, [filters.stage]);

	const handleChange = (selectedValue) => {
		// Prevent recursive onChange calls
		if (isHandlingChangeRef.current) {
			return;
		}

		// Guard against ComboBox calling onChange with undefined during initialization
		if (selectedValue === undefined) {
			return;
		}

		// Set flag to prevent recursive calls
		isHandlingChangeRef.current = true;

		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'stage',
				value: newValue,
			},
		});

		// Do we want this on a clear? Maybe instead: (onFocus && selectedValue) onFocus();
		if (onFocus) onFocus();

		// Note: Individual filter change tracking removed - FilterApply event covers all changes

		// Reset flag after a short delay to allow state updates to complete
		setTimeout(() => {
			isHandlingChangeRef.current = false;
		}, 100);
	};

	// Determine if the component should be disabled
	const isStageDisabled = disabled || isLoading || !maintypeCode;

	return (
		<FilterGroup title={FILTER_CONFIG.stage.title} helpText={FILTER_CONFIG.stage.helpText}>
			<label id="stage-filter-label" className="usa-label usa-sr-only" htmlFor="stage-filter">
				Stage
			</label>
			<ComboBox id="stage-filter" name="stage-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={isStageDisabled} onChange={handleChange} onFocus={onFocus} noResults="No stages found" />
		</FilterGroup>
	);
};

StageFilter.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
	setIsInvalidQuery: PropTypes.func,
};
export default StageFilter;
