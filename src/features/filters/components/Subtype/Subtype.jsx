import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './Subtype.scss';

import { useSubTypeSearch } from '../../../../hooks/ctsApiSupport/useSubTypeSearch';
import ComboBox from '../ComboBox/ComboBox';

const Subtype = ({ disabled = false, onFocus, setIsInvalidQuery }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;

	// Get the selected maintype code from filters
	const maintypeCode = filters.maintype && filters.maintype.length > 0 ? filters.maintype[0] : null;

	// Use our custom React Query hook with the maintype code
	const { options, isLoading } = useSubTypeSearch(maintypeCode);
	// console.log(options);
	// Ensure each option has required properties for the ComboBox
	const formattedOptions = useMemo(() => {
		return options.map((option) => ({
			value: option.value || option.id || '',
			label: option.label || '',
		}));
	}, [options]);

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.subtype) ? filters.subtype : [];

	// Detect if we need to load subtype data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.subtype) && filters.subtype.length > 0) {
			return filters.subtype[0];
		}
		return null;
	}, [filters.subtype]);

	// Effect to update filter when subtype data loads from URL
	React.useEffect(() => {
		const matchingSubtype = formattedOptions.find((option) => option.value && option.value.includes(conceptCodeFromUrl));
		if (conceptCodeFromUrl) {
			if (formattedOptions.length > 0 && maintypeCode) {
				// Find the subtype with matching concept code
				if (matchingSubtype) {
					// If a valid query param then set isInvalidQuery to false
					setIsInvalidQuery(false);
				} else if (!isLoading && !matchingSubtype) {
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
		if (Array.isArray(filters.subtype) && filters.subtype.length > 0 && filters.subtype[0].name) {
			setIsInvalidQuery(false);
		}
	}, [filters.subtype]);

	const handleChange = (selectedValue) => {
		// Guard against ComboBox calling onChange with undefined during initialization
		if (selectedValue === undefined) {
			return;
		}

		const newValue = selectedValue ? [selectedValue] : [];

		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'subtype',
				value: newValue,
			},
		});

		// Do we want this on a clear? Maybe instead: (onFocus && selectedValue) onFocus();
		if (onFocus) onFocus();

		// Note: Individual filter change tracking removed - FilterApply event covers all changes
	};

	// Determine if the component should be disabled
	const isSubtypeDisabled = disabled || isLoading || !maintypeCode;

	return (
		<FilterGroup title={FILTER_CONFIG.subtype.title} helpText={FILTER_CONFIG.subtype.helpText}>
			<label id="subtype-filter-label" className="usa-label usa-sr-only" htmlFor="subtype-filter">
				Subtype
			</label>
			<ComboBox id="subtype-filter" name="subtype-filter" options={formattedOptions} defaultValue={value.length > 0 ? value[0] : ''} disabled={isSubtypeDisabled} onChange={handleChange} onFocus={onFocus} noResults="No subtypes found" />
		</FilterGroup>
	);
};

Subtype.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
	setIsInvalidQuery: PropTypes.func,
};

export default Subtype;
