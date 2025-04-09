/* eslint-disable */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import ComboBox from '../ComboBox';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { useTracking } from 'react-tracking';
import { createApiClient } from '../../../../api/client';
import { getMainType } from '../../../../services/api/clinical-trials-search-api/getMainType';

const MainTypeFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const [searchTerm, setSearchTerm] = useState('');
	const [mainTypeOptions, setMainTypeOptions] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const tracking = useTracking();
	const client = createApiClient(process.env.REACT_APP_CTS_API_URL || 'https://clinicaltrialsapi.cancer.gov/api/v2');

	// Initialize value as empty array if not already set
	const value = Array.isArray(filters.maintype) ? filters.maintype : [];

	useEffect(() => {
		// Only search when the user has typed at least 2 characters
		if (searchTerm.length >= 2) {
			setIsLoading(true);
			fetchMainTypes();
		} else {
			setMainTypeOptions([]);
		}
	}, [searchTerm]);

	const fetchMainTypes = async () => {
		try {
			const query = { term: searchTerm, size: 10 };
			const response = await getMainType(client, query);

			if (response && Array.isArray(response.terms)) {
				const options = response.terms.map(item => ({
					id: item.key,
					label: item.label || item.key,
					value: item.key,
					count: item.doc_count || 0
				}));

				setMainTypeOptions(options);
			}
		} catch (error) {
			console.error('Error fetching main types:', error);
			setMainTypeOptions([]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSearch = (term) => {
		setSearchTerm(term);
	};

	const handleChange = (selectedValues) => {
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'maintype',
				value: selectedValues,
			},
		});

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'maintype',
			filterValue: selectedValues.join(','),
			action: 'select',
		});
	};

	return (
		<FilterGroup title="Primary Cancer Type/Condition">
			<ComboBox
				name="maintype-filter"
				placeholder={FILTER_CONFIG.maintype.placeholder}
				options={mainTypeOptions}
				value={value}
				onChange={handleChange}
				onSearch={handleSearch}
				multiSelect={FILTER_CONFIG.maintype.multiSelect}
				helpText={FILTER_CONFIG.maintype.helpText}
				disabled={disabled}
				loading={isLoading}
				minChars={2}
			/>
		</FilterGroup>
	);
};

MainTypeFilter.propTypes = {
	onFocus: PropTypes.func,
	disabled: PropTypes.bool,
};

export default MainTypeFilter;
