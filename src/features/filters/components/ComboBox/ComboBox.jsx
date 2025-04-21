/**
 * @file This file defines the ComboBox component, a versatile input control that combines
 * a text input with a dropdown list of options. It supports single and multi-select,
 * type-ahead filtering, keyboard navigation, and optional asynchronous loading/searching of options.
 * It's used for filters like 'Drug/Intervention' where users can search and select from a list.
 */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
// Note: Tracking functionality is currently commented out.
// import { useTracking } from 'react-tracking';
import './ComboBox.scss';

/**
 * Renders a ComboBox input component.
 * Allows users to type to filter options or select from a dropdown list.
 * Supports single or multiple selections.
 *
 * @param {object} props - The component props.
 * @param {string} [props.label] - Optional label displayed above the input.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {Array<object>} props.options - Array of available options ({ value, label, count? }).
 * @param {boolean} [props.multiSelect=false] - If true, allows selecting multiple options.
 * @param {Array<string>} props.value - Array of currently selected option values.
 * @param {Function} props.onChange - Callback function invoked when the selection changes, passing the new array of selected values.
 * @param {string} [props.helpText] - Optional help text displayed below the input.
 * @param {boolean} [props.disabled=false] - If true, disables the component.
 * @param {boolean} [props.loading=false] - If true, indicates options are loading (currently unused visually).
 * @param {string} [props.error] - If present, displays an error message below the input.
 * @param {boolean} [props.required=false] - If true, marks the label with a required indicator.
 * @param {number} [props.minChars=2] - Minimum characters to type before triggering `onSearch`.
 * @param {Function} [props.onSearch] - Optional callback function triggered when the user types `minChars` or more. Receives the search text.
 * @param {string} props.name - A unique name for the component, used for generating IDs and potentially in tracking.
 * @returns {JSX.Element} The rendered ComboBox component.
 */
const ComboBox = ({
	label,
	placeholder,
	options,
	multiSelect = false, // Default to single select
	value = [], // Default to empty array
	onChange,
	helpText,
	disabled = false,
	loading = false, // Currently unused visually
	error,
	required = false,
	minChars = 2,
	onSearch,
	name,
}) => {
	// State for controlling the dropdown visibility
	const [isOpen, setIsOpen] = useState(false);
	// State for the text entered in the input field
	const [searchText, setSearchText] = useState('');
	// State for tracking the currently highlighted option index for keyboard navigation
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	// Refs for accessing DOM elements
	const wrapperRef = useRef(null); // Ref for the main component wrapper div
	const inputRef = useRef(null); // Ref for the input element
	const listboxRef = useRef(null); // Ref for the dropdown list (ul)

	// const tracking = useTracking(); // Tracking hook initialization (commented out)

	/**
	 * Effect to handle clicks outside the component to close the dropdown.
	 */
	useEffect(() => {
		function handleClickOutside(event) {
			// If the click is outside the wrapper element, close the dropdown
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		// Add event listener when the component mounts
		document.addEventListener('mousedown', handleClickOutside);
		// Remove event listener when the component unmounts
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []); // Empty dependency array means this runs only on mount and unmount

	/**
	 * Effect to trigger the onSearch callback when searchText meets the minimum character requirement.
	 */
	useEffect(() => {
		// If onSearch prop is provided and searchText length is sufficient, call onSearch
		if (searchText.length >= minChars && onSearch) {
			onSearch(searchText);
		}
		// Reset highlighted index when search text changes
		setHighlightedIndex(-1);
	}, [searchText, minChars, onSearch]); // Re-run when searchText, minChars, or onSearch changes

	/**
	 * Effect to scroll the highlighted item into view within the listbox.
	 */
	useEffect(() => {
		if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
			const highlightedItem = listboxRef.current.children[highlightedIndex];
			if (highlightedItem) {
				// Use scrollIntoView with options for smooth scrolling if needed,
				// or block: 'nearest' to minimize scrolling.
				highlightedItem.scrollIntoView({ block: 'nearest' });
			}
		}
	}, [isOpen, highlightedIndex]); // Re-run when isOpen or highlightedIndex changes

	// Filter options based on the current search text
	const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()));

	/**
	 * Handles selecting an option from the list.
	 * Updates the value state based on multiSelect mode.
	 * Closes the dropdown in single-select mode.
	 * Clears the search text.
	 *
	 * @param {object} option - The selected option object ({ value, label }).
	 */
	const handleSelect = (option) => {
		let newValue;
		if (multiSelect) {
			// Toggle selection in multi-select mode
			newValue = value.includes(option.value)
				? value.filter((v) => v !== option.value) // Remove if already selected
				: [...value, option.value]; // Add if not selected
			onChange(newValue);

			// Commented-out tracking logic:
			// tracking.trackEvent({
			// 	type: 'Other',
			// 	event: 'TrialListingApp:Filter:Change',
			// 	linkName: 'TrialListingApp:Filter:Change',
			// 	filterType: name,
			// 	filterValue: option.value,
			// 	action: newValue.includes(option.value) ? 'select' : 'deselect',
			// });
		} else {
			// Set selection in single-select mode
			newValue = [option.value];
			onChange(newValue);
			setIsOpen(false); // Close dropdown after selection

			// Commented-out tracking logic:
			// tracking.trackEvent({
			// 	type: 'Other',
			// 	event: 'TrialListingApp:Filter:Change',
			// 	linkName: 'TrialListingApp:Filter:Change',
			// 	filterType: name,
			// 	filterValue: option.value,
			// 	action: 'select',
			// });
		}
		setSearchText(''); // Clear search text after selection
		inputRef.current?.focus(); // Keep focus on the input
	};

	/**
	 * Handles keyboard navigation within the input field (Arrow keys, Enter, Escape).
	 *
	 * @param {React.KeyboardEvent<HTMLInputElement>} e - The keyboard event.
	 */
	const handleKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault(); // Prevent cursor movement in input
				if (!isOpen) setIsOpen(true); // Open dropdown if closed
				// Move highlight down, clamping at the end of the list
				setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault(); // Prevent cursor movement in input
				if (!isOpen) setIsOpen(true); // Open dropdown if closed
				// Move highlight up, clamping at the beginning (-1 means input focused)
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault(); // Prevent form submission
				// If an option is highlighted, select it
				if (isOpen && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
					handleSelect(filteredOptions[highlightedIndex]);
				}
				break;
			case 'Escape':
				// Close the dropdown
				setIsOpen(false);
				break;
			default:
				// For other keys, ensure the dropdown is open if not already
				if (!isOpen) setIsOpen(true);
				break;
		}
	};

	/**
	 * Handles removing a selected value (tag) in multi-select mode.
	 *
	 * @param {string} valueToRemove - The value of the tag to remove.
	 */
	const removeValue = (valueToRemove) => {
		const newValue = value.filter((v) => v !== valueToRemove);
		onChange(newValue);
		inputRef.current?.focus(); // Return focus to input after removing a tag
	};

	const inputId = `${name}-input`;
	const listboxId = `${name}-listbox`;

	return (
		<div className="combobox" ref={wrapperRef}>
			{/* Optional Label */}
			{label && (
				<label className="combobox__label" htmlFor={inputId}>
					{label}
					{required && <span className="combobox__required">*</span>}
				</label>
			)}

			{/* Input field and toggle button container */}
			<div className={`combobox__input-wrapper ${error ? 'has-error' : ''}`}>
				<input
					id={inputId}
					ref={inputRef}
					type="text"
					className="combobox__input"
					placeholder={placeholder}
					value={searchText}
					onChange={(e) => {
						setSearchText(e.target.value); // Update search text state
						if (!isOpen) setIsOpen(true); // Open dropdown on change if closed
					}}
					onFocus={() => setIsOpen(true)} // Open dropdown on focus
					onKeyDown={handleKeyDown} // Handle keyboard navigation
					disabled={disabled}
					// ARIA attributes for accessibility
					role="combobox"
					aria-expanded={isOpen}
					aria-autocomplete="list"
					aria-controls={listboxId}
					aria-activedescendant={highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined}
				/>

				{/* Loading indicator can be added here if needed */}
				{/* {loading && <span className="combobox__spinner" aria-hidden="true" />} */}

				{/* Dropdown toggle button */}
				<button
					type="button"
					className="combobox__toggle"
					onClick={() => setIsOpen(!isOpen)} // Toggle dropdown visibility
					aria-label={isOpen ? 'Close options' : 'Open options'}
					disabled={disabled}
					tabIndex={-1} // Prevent button from being tab-focused directly
				>
					{/* Arrow icon */}
					<svg
						width="10"
						height="6"
						viewBox="0 0 10 6"
						fill="none"
						aria-hidden="true" // Icon is decorative
						style={{
							transform: isOpen ? 'rotate(180deg)' : 'none', // Rotate arrow when open
						}}>
						<path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" />
					</svg>
				</button>
			</div>

			{/* Optional Error Message */}
			{error && (
				<div className="combobox__error" role="alert">
					{error}
				</div>
			)}

			{/* Optional Help Text */}
			{helpText && <div className="combobox__help-text">{helpText}</div>}

			{/* Dropdown Listbox */}
			{isOpen && ( // Only render the listbox if isOpen is true
				<ul
					ref={listboxRef}
					className="combobox__options"
					role="listbox"
					id={listboxId}
					aria-label={label || 'Options'} // Use label for listbox aria-label if available
					aria-multiselectable={multiSelect}>
					{/* Display loading state */}
					{loading && <li className="combobox__option is-loading">Loading...</li>}
					{/* Display 'No results' if not loading, search text exists, and no options match */}
					{!loading && filteredOptions.length === 0 && searchText.length > 0 && <li className="combobox__option is-disabled">No results found</li>}
					{/* Map through filtered options */}
					{!loading &&
						filteredOptions.map((option, index) => (
							<li
								key={option.value}
								id={`${name}-option-${index}`} // Unique ID for each option
								role="option"
								aria-selected={value.includes(option.value)} // Indicate if selected
								className={`
						          combobox__option
						          ${value.includes(option.value) ? 'is-selected' : ''}
						          ${index === highlightedIndex ? 'is-highlighted' : ''}
						        `}
								onClick={() => handleSelect(option)} // Handle click selection
								onMouseEnter={() => setHighlightedIndex(index)} // Highlight on mouse enter
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelect(option);
									}
								}}
								tabIndex={0} // Make the list item focusable
							>
								{/* Checkbox for multi-select mode */}
								{multiSelect && (
									<input
										type="checkbox"
										checked={value.includes(option.value)}
										readOnly // Checkbox state controlled by parent li click
										tabIndex={-1} // Not focusable
										aria-hidden="true" // Hide from screen readers (li handles selection state)
									/>
								)}
								{/* Option label */}
								<span className="combobox__option-label">{option.label}</span>
								{/* Optional count display */}
								{option.count !== undefined && <span className="combobox__option-count">({option.count})</span>}
							</li>
						))}
				</ul>
			)}

			{/* Display selected items as tags in multi-select mode */}
			{multiSelect && value.length > 0 && (
				<div className="combobox__selected">
					{value.map((v) => {
						// Find the corresponding option object to display the label
						const option = options.find((o) => o.value === v);
						// If option not found (e.g., value set externally), display the value itself
						const displayLabel = option?.label || v;
						return (
							<span key={v} className="combobox__tag">
								{displayLabel}
								{/* Button to remove the tag */}
								<button type="button" onClick={() => removeValue(v)} aria-label={`Remove ${displayLabel}`} className="combobox__tag-remove">
									× {/* Multiplication sign used as 'x' icon */}
								</button>
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
};

// Define PropTypes for type checking and documentation
ComboBox.propTypes = {
	/** Optional label displayed above the input. */
	label: PropTypes.string,
	/** Placeholder text for the input field. */
	placeholder: PropTypes.string,
	/** Array of available options. Each object needs 'value' and 'label'. 'count' is optional. */
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			count: PropTypes.number,
		})
	).isRequired,
	/** If true, allows selecting multiple options. Defaults to false. */
	multiSelect: PropTypes.bool,
	/** Array of strings representing the values of the currently selected options. */
	value: PropTypes.arrayOf(PropTypes.string),
	/** Callback function triggered when the selection changes. Receives the new array of selected values. */
	onChange: PropTypes.func.isRequired,
	/** Optional help text displayed below the input. */
	helpText: PropTypes.string,
	/** If true, disables the component. Defaults to false. */
	disabled: PropTypes.bool,
	/** If true, indicates options are loading (visual indicator not implemented yet). Defaults to false. */
	loading: PropTypes.bool,
	/** If present, displays an error message below the input. */
	error: PropTypes.string,
	/** If true, marks the label with a required indicator (*). Defaults to false. */
	required: PropTypes.bool,
	/** Minimum characters to type before triggering `onSearch`. Defaults to 2. */
	minChars: PropTypes.number,
	/** Optional callback triggered when user types `minChars` or more. Receives the search text. */
	onSearch: PropTypes.func,
	/** A unique name for the component, used for generating IDs and potentially in tracking. */
	name: PropTypes.string.isRequired,
};

export default ComboBox;
