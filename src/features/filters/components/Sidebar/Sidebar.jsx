/**
 * @file This file defines the Sidebar component, which serves as the main container
 * for all filter controls. It dynamically renders filters based on the current page type,
 * manages filter state interactions (setting, applying, clearing), handles URL parameter
 * synchronization, performs basic validation, and includes logic for mobile accordion behavior.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFilters, FilterActionTypes } from '../../context/FilterContext/FilterContext';
import ZipCodeFilter from '../ZipCodeFilter';
import AgeFilter from '../AgeFilter/AgeFilter';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import './Sidebar.scss';
// import { useStateValue } from '../../../../store/store'; // Unused import
import { FILTER_EVENTS, INTERACTION_TYPES } from '../../tracking/filterEvents';
import { useFilterCounters } from '../../hooks/useFilterCounters';
// import { formatLocationString, getAppliedFieldsString } from '../../utils/analytics'; // Unused imports
import { useTracking } from 'react-tracking';
import { URL_PARAM_MAPPING } from '../../constants/urlParams';
import { isValidZipFormat } from '../../utils/locationUtils';
import PropTypes from 'prop-types';

/**
 * Renders the filter sidebar, including relevant filter components based on pageType.
 * Handles applying, clearing, and validating filters, as well as URL updates and tracking.
 *
 * @param {object} props - The component props.
 * @param {string} [props.pageType='Disease'] - The type of page, determining which filters are shown (e.g., 'Disease', 'Intervention').
 * @param {boolean} [props.isDisabled=false] - If true, disables all filter interactions.
 * @param {number|null} [props.initialTotalCount=null] - Initial total count of trials (currently unused).
 * @param {Function} [props.onFilterApplied=()=>{}] - Callback function invoked when filters are successfully applied. Receives current filters and apply count.
 * @param {Function} [props.onFilterCleared=()=>{}] - Callback function invoked when filters are cleared. Receives clear count and apply count.
 * @returns {JSX.Element|null} The rendered Sidebar component or null if pageType is invalid.
 */
const Sidebar = ({ pageType = 'Disease', isDisabled = false, onFilterApplied = () => {}, onFilterCleared = () => {} }) => {
	// Hooks for navigation, location, filter context, tracking, and counters
	const navigate = useNavigate();
	const location = useLocation();
	const { state, dispatch, applyFilters, enabledFilters = [] } = useFilters();
	const { filters, isDirty } = state; // Get current filters and dirty state from context
	const [hasInteracted, setHasInteracted] = useState(false); // Tracks if user has interacted with any filter yet
	// const [isFirstLoad, setIsFirstLoad] = useState(true); // Unused state variable
	// State to hold the function that retrieves the latest ZIP validation status from ZipCodeFilter
	const [getZipValidationStatus, setGetZipValidationStatus] = useState(null);
	// Custom hook for tracking filter application/removal counts
	const { filterAppliedCounter, filterRemovedCounter, incrementAppliedCounter, incrementRemovedCounter } = useFilterCounters();
	const tracking = useTracking(); // React-tracking hook

	/**
	 * Validates the current filter values (age range, zip format, radius presence).
	 * @returns {object} An object containing error messages keyed by field name, or an empty object if valid.
	 */
	const validateFilters = () => {
		const errors = {};

		// Validate age filter value is within the allowed range, but only if it's not empty
		if (filters.age !== undefined && filters.age !== null && filters.age !== '') {
			if (filters.age < FILTER_CONFIG.age.min || filters.age > FILTER_CONFIG.age.max) {
				errors.age = `Invalid age value. Must be between ${FILTER_CONFIG.age.min} and ${FILTER_CONFIG.age.max}.`;
			}
		}

		// Validate location filter (ZIP code format and radius presence)
		if (filters.location?.zipCode) {
			if (!isValidZipFormat(filters.location.zipCode)) {
				errors.location = 'Invalid ZIP code format. Please enter a 5-digit US ZIP code.';
			}
			// Radius is required only if a ZIP code is entered
			if (!filters.location.radius) {
				errors.radius = 'Radius is required when ZIP code is provided.';
			}
		}

		return errors;
	};

	/**
	 * Maps internal error field names to corresponding URL parameter short codes for tracking.
	 * @param {object} errors - The error object returned by validateFilters.
	 * @returns {string} A comma-separated string of URL parameter short codes corresponding to the errors.
	 */
	const getErrorFields = (errors) => {
		return Object.keys(errors)
			.map((field) => {
				switch (field) {
					case 'age':
						return URL_PARAM_MAPPING.age.shortCode;
					case 'location': // Map both location and radius errors to the zip code parameter
					case 'radius':
						return URL_PARAM_MAPPING.zipCode.shortCode;
					default:
						return field; // Fallback for unexpected fields
				}
			})
			.join(',');
	};

	/**
	 * Tracks the first interaction with any filter control.
	 * Sets the `hasInteracted` state to prevent repeated tracking.
	 * @param {string} fieldName - The name of the filter field being interacted with.
	 */
	const trackFilterStart = (fieldName) => {
		if (!hasInteracted) {
			tracking.trackEvent({
				type: 'Other',
				event: FILTER_EVENTS.START,
				linkName: FILTER_EVENTS.START, // Consider renaming linkName for clarity
				interactionType: INTERACTION_TYPES.FILTER_START,
				fieldInteractedWith: fieldName,
			});
			setHasInteracted(true); // Mark interaction to prevent re-tracking
		}
	};

	/**
	 * Handles changes to the Zip Code input.
	 * Dispatches a SET_FILTER action, automatically setting a default radius if zip is entered.
	 * @param {string} value - The new zip code value.
	 */
	const handleZipCodeChange = (value) => {
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					zipCode: value,
					// Set default radius if zip is entered and no radius exists, clear radius if zip is cleared
					radius: value ? filters.location?.radius || '100' : null,
				},
			},
		});
	};

	/**
	 * Handles changes to the Radius select input.
	 * Dispatches a SET_FILTER action to update the radius.
	 * @param {React.ChangeEvent<HTMLSelectElement>} e - The select change event.
	 */
	const handleRadiusChange = (e) => {
		dispatch({
			type: FilterActionTypes.SET_FILTER,
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					radius: e.target.value,
				},
			},
		});
	};

	/**
	 * Handles the "Clear Filters" button click.
	 * Increments the removed counter, calls the parent callback,
	 * dispatches actions to clear and re-apply (empty) filters.
	 */
	const handleClearFilters = () => {
		incrementRemovedCounter(); // Track clear action

		// Notify parent component
		onFilterCleared(filterRemovedCounter + 1, filterAppliedCounter);

		// Dispatch actions to update context state
		dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
		dispatch({ type: FilterActionTypes.APPLY_FILTERS }); // Apply the cleared state

		// TODO: Clear URL parameters as well? Currently only ApplyFilters updates URL.
		// navigate(window.location.pathname); // Option 1: Navigate to path without params
	};

	/**
	 * Handles the "Apply Filters" button click.
	 * Performs validation, handles ZIP code validation result, tracks events,
	 * calls the applyFilters action from context, and updates URL parameters.
	 */
	const handleApplyFilters = async () => {
		// Do nothing if filters haven't changed
		if (!isDirty) return;

		// Validate form field values (e.g., age range)
		const errors = validateFilters();
		const hasErrors = Object.keys(errors).length > 0;

		// If validation errors exist, track and stop
		if (hasErrors) {
			tracking.trackEvent({
				type: 'Other',
				event: FILTER_EVENTS.APPLY_ERROR,
				linkName: FILTER_EVENTS.APPLY_ERROR,
				interactionType: INTERACTION_TYPES.APPLIED_WITH_ERRORS,
				errorField: getErrorFields(errors),
			});
			// TODO: Display validation errors to the user
			return;
		}

		// Handle asynchronous ZIP code validation
		if (filters.location?.zipCode) {
			// Ensure the validation status function is available
			if (!getZipValidationStatus) {
				// This case should ideally not happen if ZipCodeFilter is working correctly
				// Consider adding user feedback or logging here
				return;
			}

			// Retrieve the latest validation status from the ZipCodeFilter component
			const validationResult = getZipValidationStatus();

			// If the stored validation status indicates the ZIP is invalid, track and stop
			if (!validationResult.isValid) {
				tracking.trackEvent({
					type: 'Other',
					event: FILTER_EVENTS.APPLY_ERROR,
					linkName: FILTER_EVENTS.APPLY_ERROR,
					interactionType: INTERACTION_TYPES.APPLIED_WITH_ERRORS,
					errorField: URL_PARAM_MAPPING.zipCode.shortCode, // Track 'zip' error
				});
				// TODO: Ensure ZipCodeFilter displays its error state
				return;
			}

			// If valid and coordinates are available, ensure they are set in the context state
			// This might be redundant if ZipCodeFilter already dispatched on validation success
			if (validationResult.isValid && validationResult.coordinates) {
				dispatch({
					type: FilterActionTypes.SET_ZIP_COORDINATES,
					payload: validationResult.coordinates,
				});
			}
		}

		// --- If all validations pass ---

		// Capture current filter values before applying for tracking purposes
		const currentFilters = { ...filters };

		// Track successful filter application
		incrementAppliedCounter();
		onFilterApplied(currentFilters, filterAppliedCounter + 1); // Notify parent

		// Call the applyFilters function from context (likely triggers API call)
		await applyFilters();

		// --- Update URL parameters after successful application ---
		const params = new URLSearchParams(window.location.search);

		// Update 'a' parameter for age
		if (filters.age && filters.age.toString().trim() !== '') {
			params.set(URL_PARAM_MAPPING.age.shortCode, filters.age);
		} else {
			params.delete(URL_PARAM_MAPPING.age.shortCode);
		}

		// Update 'z' parameter for zip code
		if (filters.location?.zipCode && isValidZipFormat(filters.location.zipCode)) {
			params.set(URL_PARAM_MAPPING.zipCode.shortCode, filters.location.zipCode);
		} else {
			params.delete(URL_PARAM_MAPPING.zipCode.shortCode);
		}

		// Update 'rl' parameter for radius (only if zip exists)
		if (filters.location?.zipCode && filters.location.radius) {
			params.set(URL_PARAM_MAPPING.radius.shortCode, filters.location.radius);
		} else {
			params.delete(URL_PARAM_MAPPING.radius.shortCode);
		}

		// Always reset to page 1 ('pn') when filters are applied
		params.set(URL_PARAM_MAPPING.page.shortCode, '1');

		// Update the URL using navigate (replace avoids adding to history stack)
		navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
	};

	/**
	 * Callback passed to ZipCodeFilter to receive either the validation function
	 * or the direct validation result (e.g., on initial load from URL).
	 * Stores the validation function or result in state.
	 */
	const handleZipValidationChange = useCallback(
		(validationOrResult) => {
			// Case 1: Received the validation function from ZipCodeFilter
			if (typeof validationOrResult === 'function') {
				setGetZipValidationStatus(() => validationOrResult);
				return;
			}

			// Case 2: Received a direct validation result object (e.g., from initial URL check)
			if (validationOrResult && typeof validationOrResult === 'object') {
				// Store a function that returns this static result
				setGetZipValidationStatus(() => () => validationOrResult);

				// If the initial result is valid, immediately set coordinates in context
				if (validationOrResult.isValid && validationOrResult.coordinates) {
					dispatch({
						type: FilterActionTypes.SET_ZIP_COORDINATES,
						payload: validationOrResult.coordinates,
					});
				}
			}
		},
		[dispatch]
	);

	/**
	 * Renders the appropriate filter component based on the filter type string.
	 * @param {string} filterType - The type of filter to render (e.g., 'age', 'location').
	 * @param {boolean} isDisabled - Whether the filter should be disabled.
	 * @returns {JSX.Element|null} The rendered filter component or null.
	 */
	const renderFilter = (filterType, isDisabled) => {
		switch (filterType) {
			case 'age':
				return (
					<AgeFilter
						value={filters.age} // AgeFilter reads value from context
						onFocus={() => trackFilterStart(filterType)}
						disabled={isDisabled}
					/>
				);
			case 'location':
				return (
					<ZipCodeFilter
						zipCode={filters.location?.zipCode || ''} // Pass values from context
						radius={filters.location?.radius || ''}
						onZipCodeChange={handleZipCodeChange} // Handle state updates via callbacks
						onRadiusChange={handleRadiusChange}
						onValidationChange={handleZipValidationChange} // Pass callback to get validation status
						onFocus={() => trackFilterStart(filterType)}
						disabled={isDisabled}
					/>
				);
			// Add cases for other filter types (e.g., trial type, phase) if needed
			default:
				// Log error for unhandled filter types during development
				// console.warn(`Sidebar: Unhandled filter type "${filterType}"`);
				return null;
		}
	};

	// SVG data URLs for accordion button background images
	const minusSign = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 2H0V0H14V2Z" fill="%231B1B1B"/></svg>')`;
	const plusSign = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="%231B1B1B"/></svg>')`;

	/**
	 * Handles the click event for the mobile accordion toggle button.
	 * Toggles visibility and updates button style.
	 * Note: This directly manipulates DOM and might conflict with context-based sidebar state.
	 */
	const accordionOnClick = () => {
		const filterBtn = document.getElementById('filterButton');
		const content = document.getElementById('accordionContent');
		if (!filterBtn || !content) return; // Guard against elements not found

		filterBtn.classList.toggle('is-closed');
		const isClosed = filterBtn.classList.contains('is-closed');

		filterBtn.style.backgroundImage = isClosed ? plusSign : minusSign;
		content.hidden = isClosed;
		filterBtn.setAttribute('aria-expanded', !isClosed); // Update ARIA state
	};

	/**
	 * Sets up the event listener for the mobile accordion based on media query.
	 * Attaches/detaches the click listener and manages initial state.
	 * Note: This uses direct DOM manipulation and might be better handled via context/state.
	 */
	const setMobileOnClick = useCallback(() => {
		const filterBtn = document.getElementById('filterButton');
		const content = document.getElementById('accordionContent');
		if (!filterBtn || !content) return; // Guard if elements don't exist yet

		const mobileSize = '(max-width: 1023px)'; // Define mobile breakpoint
		const mediaQueryMobile = window.matchMedia(mobileSize);

		// Function to handle media query changes
		function handleMediaQueryChange(event) {
			if (event.matches) {
				// If mobile view
				filterBtn.addEventListener('click', accordionOnClick);
				// Ensure initial state matches button class/style if needed
				const isClosed = filterBtn.classList.contains('is-closed');
				content.hidden = isClosed;
				filterBtn.setAttribute('aria-expanded', !isClosed);
			} else {
				// If desktop view
				// Ensure accordion is open and listener is removed
				filterBtn.removeEventListener('click', accordionOnClick);
				filterBtn.classList.remove('is-closed');
				filterBtn.style.backgroundImage = minusSign; // Default to open style
				content.removeAttribute('hidden');
				filterBtn.setAttribute('aria-expanded', 'true');
			}
		}

		// Initial check and setup listener
		handleMediaQueryChange(mediaQueryMobile);
		// Use addEventListener for modern browsers, consider compatibility if needed
		mediaQueryMobile.addEventListener('change', handleMediaQueryChange);

		// Cleanup function for useEffect
		return () => {
			mediaQueryMobile.removeEventListener('change', handleMediaQueryChange);
			filterBtn.removeEventListener('click', accordionOnClick); // Ensure listener is removed on unmount
		};
	}, []); // Revert dependency array

	/**
	 * Effect to set up the mobile accordion listener on component mount.
	 */
	useEffect(() => {
		const cleanup = setMobileOnClick();
		return cleanup; // Return cleanup function
	}, [setMobileOnClick]); // Dependency on the memoized setup function

	/**
	 * Checks if any filters (age or location) are currently active.
	 * Used to enable/disable the "Clear Filters" button.
	 * @returns {boolean} True if at least one filter is active, false otherwise.
	 */
	const hasActiveFilters = () => {
		// Check age filter (handles single value or potentially array in future)
		const hasAgeFilter = filters.age != null && filters.age !== '';

		// Check location filter (zip code must exist)
		const hasLocationFilter = Boolean(filters.location?.zipCode);

		// Add checks for other filter types here if they are added
		// const hasTrialTypeFilter = filters.trialType?.length > 0;

		return hasAgeFilter || hasLocationFilter; // || hasTrialTypeFilter etc.
	};

	/**
	 * Effect to initialize filters from URL parameters on initial load.
	 * Only runs once on component mount.
	 */
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const age = params.get(URL_PARAM_MAPPING.age.shortCode);
		const zip = params.get(URL_PARAM_MAPPING.zipCode.shortCode);
		const radius = params.get(URL_PARAM_MAPPING.radius.shortCode);

		let needsApply = false; // Flag to check if APPLY_FILTERS needs dispatch

		// Initialize Age filter
		if (age) {
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: { filterType: 'age', value: age }, // Store as number
			});
			needsApply = true;
		}

		// Initialize Location filter
		if (zip && isValidZipFormat(zip)) {
			dispatch({
				type: FilterActionTypes.SET_FILTER,
				payload: {
					filterType: 'location',
					value: { zipCode: zip, radius: radius || '100' }, // Use radius from URL or default
				},
			});
			needsApply = true;
			// Note: Zip validation and coordinate setting will be handled by ZipCodeFilter's
			// onValidationChange callback triggered by its own useEffect.
		}

		// If any filters were set from URL, dispatch APPLY_FILTERS to mark state as non-dirty
		if (needsApply) {
			dispatch({ type: FilterActionTypes.APPLY_FILTERS });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array ensures this runs only once on mount

	// Validate pageType and configuration existence
	if (!pageType || !PAGE_FILTER_CONFIGS[pageType]) {
		// Log error during development, return null to prevent rendering
		// console.error('Sidebar: Invalid or missing pageType configuration:', pageType);
		return null;
	}

	return (
		<aside className="ctla-sidebar">
			{/* Accordion Header for Mobile */}
			<div className="usa-accordion ctla-sidebar__header">
				<h2 className="usa-accordion__heading ctla-sidebar__title">
					<button id="filterButton" type="button" className="usa-accordion__button" aria-expanded="true" aria-controls="accordionContent" onClick={setMobileOnClick}>
						Filter Trials
					</button>
				</h2>
			</div>
			<div id="accordionContent" className="usa-accordion__content ctla-sidebar__content">
				{PAGE_FILTER_CONFIGS[pageType].order.map((filterType) => {
					if (enabledFilters.includes(filterType)) {
						return <div key={filterType}>{renderFilter(filterType, isDisabled)}</div>;
					}
					return null;
				})}
				<div className="ctla-sidebar__actions">
					<button className="usa-button ctla-sidebar__button--clear" onClick={handleClearFilters} disabled={isDisabled || !hasActiveFilters()}>
						Clear Filters
					</button>
					<button className="usa-button ctla-sidebar__button--apply" onClick={handleApplyFilters} disabled={isDisabled || !isDirty}>
						Apply Filters
					</button>
				</div>
			</div>
		</aside>
	);
};

// Define PropTypes for type checking and documentation
Sidebar.propTypes = {
	/** The type of page, determining which filters are shown (e.g., 'Disease', 'Intervention'). Defaults to 'Disease'. */
	pageType: PropTypes.string,
	/** If true, disables all filter interactions. Defaults to false. */
	isDisabled: PropTypes.bool,
	/** Callback function invoked when filters are successfully applied. Receives current filters and apply count. */
	onFilterApplied: PropTypes.func,
	/** Callback function invoked when filters are cleared. Receives clear count and apply count. */
	onFilterCleared: PropTypes.func,
};

export default Sidebar;
