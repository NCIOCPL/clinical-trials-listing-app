import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import { FILTER_CONFIG } from '../../config/filterConfig';
import './DrugInterventionFilter.scss';
import { useTracking } from 'react-tracking';
import { useDrugSearch } from '../../../../hooks/ctsApiSupport/useDrugSearch';
import { useDrugSearchByCode } from '../../../../hooks/ctsApiSupport/useDrugSearchByCode';

const DrugInterventionFilter = ({ onFocus, disabled = false }) => {
	const { state, dispatch } = useFilters();
	const { filters } = state;
	const tracking = useTracking();

	// State for autocomplete functionality
	const [inputValue, setInputValue] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	// Use the real drug search API
	const { drugs, isLoading, error } = useDrugSearch(inputValue);

	// Refs for DOM manipulation
	const inputRef = useRef(null);
	const listboxRef = useRef(null);
	const statusRef = useRef(null);

	// Detect if we need to load drug data for concept codes from URL
	const conceptCodeFromUrl = React.useMemo(() => {
		if (Array.isArray(filters.drugIntervention) && filters.drugIntervention.length > 0) {
			const firstItem = filters.drugIntervention[0];
			if (typeof firstItem === 'string') {
				return firstItem;
			}
		}
		return null;
	}, [filters.drugIntervention]);

	// Use drug search to load drug data by concept code if needed
	const { drugs: drugsByCode } = useDrugSearchByCode(conceptCodeFromUrl);

	// Effect to update filter when drug data loads from URL
	React.useEffect(() => {
		// console.log('[DrugInterventionFilter useEffect] conceptCodeFromUrl:', conceptCodeFromUrl, 'drugsByCode:', drugsByCode);
		if (conceptCodeFromUrl && drugsByCode.length > 0) {
			// Find the drug with matching concept code
			const matchingDrug = drugsByCode.find((drug) => drug.codes && drug.codes.includes(conceptCodeFromUrl));
			if (matchingDrug) {
				// console.log('[DrugInterventionFilter] Found matching drug, dispatching SET_FILTER:', matchingDrug);
				// Update the filter with the complete drug object (without isFallback flag)
				dispatch({
					type: 'SET_FILTER',
					payload: {
						filterType: 'drugIntervention',
						value: [matchingDrug],
					},
				});
				// console.log('[DrugInterventionFilter] Dispatched SET_FILTER with drug object');
			} else {
				// console.log('[DrugInterventionFilter] No matching drug found for code:', conceptCodeFromUrl, 'Available drugs:', drugsByCode);
			}
		}
	}, [conceptCodeFromUrl, drugsByCode, dispatch]);

	// Get selected drug from filters (single object, not array)
	const selectedDrug = React.useMemo(() => {
		// console.log('[DrugInterventionFilter selectedDrug] checking filters.drugIntervention:', filters.drugIntervention);
		if (Array.isArray(filters.drugIntervention) && filters.drugIntervention.length > 0) {
			const firstItem = filters.drugIntervention[0];
			// console.log('[DrugInterventionFilter selectedDrug] firstItem:', firstItem, 'type:', typeof firstItem);

			// If it's a drug object with name, use it directly
			if (firstItem && typeof firstItem === 'object' && firstItem.name) {
				// console.log('[DrugInterventionFilter selectedDrug] Returning drug object:', firstItem);
				return firstItem;
			} else if (typeof firstItem === 'string') {
				// Create a loading placeholder for concept codes while API fetches the name
				// console.log('[DrugInterventionFilter selectedDrug] Creating loading placeholder for concept code:', firstItem);
				return {
					name: 'Loading...',
					codes: [firstItem],
					isLoading: true,
				};
			}
		}
		// console.log('[DrugInterventionFilter selectedDrug] Returning null');
		return null;
	}, [filters.drugIntervention]);

	// Generate unique IDs
	const inputId = 'drug-intervention-filter';
	const listboxId = `${inputId}-listbox`;
	const statusId = `${inputId}-status`;

	// Filter already selected drug from suggestions
	const suggestions = drugs.filter((drug) => !selectedDrug || !(selectedDrug.codes && drug.codes && selectedDrug.codes[0] === drug.codes[0]));

	// Update status for screen readers
	useEffect(() => {
		if (statusRef.current) {
			if (isLoading) {
				statusRef.current.textContent = 'Loading results...';
			} else if (suggestions.length > 0) {
				statusRef.current.textContent = `${suggestions.length} result${suggestions.length === 1 ? '' : 's'} available.`;
			} else if (inputValue.length >= 3) {
				statusRef.current.textContent = 'No results found.';
			} else {
				statusRef.current.textContent = '';
			}
		}
	}, [suggestions, isLoading, inputValue]);

	const handleInputChange = (e) => {
		const value = e.target.value;
		setInputValue(value);
		setIsOpen(value.length >= 3);
		setHighlightedIndex(-1);

		if (onFocus) onFocus();
	};

	const handleInputFocus = () => {
		if (inputValue.length >= 3) {
			setIsOpen(true);
		}
		if (onFocus) onFocus();
	};

	const handleInputBlur = () => {
		// Delay closing to allow for clicks on suggestions
		setTimeout(() => {
			setIsOpen(false);
			setHighlightedIndex(-1);
		}, 200);
	};

	const selectDrug = (drug) => {
		// Single selection - replace any existing selection
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'drugIntervention',
				value: [drug], // Always single item array
			},
		});

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'drugIntervention',
			filterValue: drug.name,
			action: 'select',
		});

		setInputValue('');
		setIsOpen(false);
		setHighlightedIndex(-1);
		inputRef.current?.focus();
	};

	const removeDrug = () => {
		// Clear the single selection
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'drugIntervention',
				value: [],
			},
		});

		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Change',
			filterType: 'drugIntervention',
			filterValue: selectedDrug?.name || '',
			action: 'remove',
		});
	};

	const handleKeyDown = (e) => {
		if (!isOpen || suggestions.length === 0) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
					selectDrug(suggestions[highlightedIndex]);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				setHighlightedIndex(-1);
				break;
		}
	};

	// Format search results like clinical trials search app
	const formatSuggestion = (drug, isHighlighted) => {
		const isDrugFamily = drug.category && drug.category.includes('category');

		// Filter synonyms that match the search
		const matchingSynonyms = drug.synonyms?.filter((synonym) => synonym.toLowerCase().includes(inputValue.toLowerCase())) || [];

		// Smart highlighting function that preserves existing HTML and adds search highlighting
		const highlightSearchTerm = (text) => {
			if (!inputValue || inputValue.length < 2) return text;

			// Use a CSS class for search highlighting instead of <strong> tags
			// This prevents conflicts with existing <strong> tags in the text
			const searchRegex = new RegExp(`(${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
			return text.replace(searchRegex, '<mark class="search-highlight">$1</mark>');
		};

		return (
			<div key={drug.codes?.[0] || drug.name} className={`drug-autocomplete__menu-item ${isHighlighted ? 'highlighted' : ''}`} onClick={() => selectDrug(drug)} onKeyDown={(e) => e.key === 'Enter' && selectDrug(drug)} role="option" aria-selected={isHighlighted} tabIndex={0}>
				<div
					className="preferred-name"
					dangerouslySetInnerHTML={{
						__html: highlightSearchTerm(drug.name) + (isDrugFamily ? ' (DRUG FAMILY)' : ''),
					}}
				/>
				{matchingSynonyms.length > 0 && (
					<div className="synonyms">
						Other Names:{' '}
						{matchingSynonyms
							.map((synonym, i) => (
								<span
									key={i}
									dangerouslySetInnerHTML={{
										__html: highlightSearchTerm(synonym),
									}}
								/>
							))
							.reduce((prev, curr, i) => [prev, i > 0 ? ', ' : '', curr])}
					</div>
				)}
			</div>
		);
	};

	return (
		<FilterGroup title={FILTER_CONFIG.drugIntervention.title} helpText={FILTER_CONFIG.drugIntervention.helpText}>
			{error ? (
				<div>Unable to load drug/drug family options. Please try again later.</div>
			) : (
				<div className="filter-content">
					{/* NCIDS Autocomplete structure */}
					<div className="nci-autocomplete">
						<div id={statusId} className="nci-autocomplete__status" aria-live="assertive" ref={statusRef}></div>

						<label className="usa-label usa-sr-only" htmlFor={inputId}>
							Drug/Drug Family
						</label>

						<div className="drug-input-wrapper">
							{/* Display selected drug as normal text */}
							{selectedDrug && (
								<div className="selected-drug-display">
									<span className="selected-drug-text">{selectedDrug.name}</span>
									<button type="button" className="selected-drug-remove" onClick={removeDrug} aria-label={`Remove ${selectedDrug.name} filter`}>
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 14 14" fill="none">
											<path fillRule="evenodd" clipRule="evenodd" d="M13.4167 1.87575L12.1242 0.583252L7.00001 5.70742L1.87584 0.583252L0.583344 1.87575L5.70751 6.99992L0.583344 12.1241L1.87584 13.4166L7.00001 8.29242L12.1242 13.4166L13.4167 12.1241L8.29251 6.99992L13.4167 1.87575Z" fill="currentColor" />
										</svg>
									</button>
								</div>
							)}
							{/* Input field - hide when drug is selected */}
							{!selectedDrug && <input ref={inputRef} id={inputId} className="usa-input" type="text" value={inputValue} onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown} disabled={disabled} placeholder="Start typing to select drugs and/or drug families" role="combobox" aria-autocomplete="list" aria-controls={listboxId} aria-expanded={isOpen} aria-activedescendant={highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : ''} />}
						</div>

						{isOpen && (
							<div id={`${listboxId}wrapper`} className="nci-autocomplete__listbox">
								<div id={listboxId} ref={listboxRef} tabIndex="-1" role="listbox" className="drug-autocomplete__menu">
									{isLoading ? (
										<div className="drug-autocomplete__menu-item">Loading...</div>
									) : suggestions.length > 0 ? (
										suggestions.map((drug, index) => (
											<div key={drug.codes?.[0] || index} id={`${listboxId}-option-${index}`}>
												{formatSuggestion(drug, index === highlightedIndex)}
											</div>
										))
									) : (
										<div className="drug-autocomplete__menu-item">{inputValue.length < 3 ? 'Please enter 3 or more characters' : 'No results found'}</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			)}
		</FilterGroup>
	);
};

DrugInterventionFilter.propTypes = {
	disabled: PropTypes.bool,
	onFocus: PropTypes.func,
};

export default DrugInterventionFilter;
