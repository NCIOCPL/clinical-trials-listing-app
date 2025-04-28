/**
 * @file This file defines the DropdownFilter component, a custom, accessible dropdown select
 * component used for single-select filters within the application. It replaces the native
 * select element to allow for more styling control and consistent behavior across browsers,
 * while implementing ARIA patterns for accessibility, including keyboard navigation.
 */
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DropdownFilter.scss';

/**
 * Renders a custom dropdown select component.
 * It uses a button to toggle a listbox and handles selection,
 * keyboard navigation (arrows, enter, space, escape, first-letter),
 * and clicks outside to close.
 *
 * @param {object} props - The component props.
 * @param {string} props.id - Unique ID for the dropdown, used for ARIA attributes and label association.
 * @param {string} [props.label] - Optional label displayed above the dropdown.
 * @param {Array<object>} props.options - Array of available options ({ value, label }).
 * @param {string|number} props.value - The currently selected option value.
 * @param {Function} props.onChange - Callback function invoked when the selection changes, passing the new selected value.
 * @param {string} [props.placeholder='Select...'] - Text displayed when no option is selected.
 * @param {string} [props.error] - If present, displays an error message and styles the component as invalid.
 * @param {boolean} [props.required=false] - If true, marks the label with a required indicator.
 * @param {boolean} [props.disabled=false] - If true, disables the dropdown.
 * @param {string} [props.className=''] - Additional CSS class names to apply to the root element.
 * @returns {JSX.Element} The rendered DropdownFilter component.
 */
const DropdownFilter = ({ id, label, options, value, onChange, placeholder = 'Select...', error, required = false, disabled = false, className = '' }) => {
	// State to control the visibility of the dropdown listbox
	const [isOpen, setIsOpen] = useState(false);
	// State to track the index of the currently highlighted option for keyboard navigation
	const [highlightedIndex, setHighlightedIndex] = useState(-1);

	// Refs to access the main dropdown container and the listbox element
	const dropdownRef = useRef(null);
	const listboxRef = useRef(null);

	// Find the full option object corresponding to the selected value
	const selectedOption = options.find((option) => option.value === value);

	/**
	 * Effect to handle clicks outside the dropdown component to close the listbox.
	 */
	useEffect(() => {
		const handleClickOutside = (event) => {
			// If the click is outside the dropdownRef element, close the listbox
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		// Add listener on mount
		document.addEventListener('mousedown', handleClickOutside);
		// Clean up listener on unmount
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []); // Empty dependency array ensures this runs only on mount and unmount

	/**
	 * Handles keyboard interactions on the dropdown button for navigation and selection.
	 * Supports ArrowDown, ArrowUp, Enter, Space, Escape, Tab, and first-letter navigation.
	 *
	 * @param {React.KeyboardEvent<HTMLButtonElement>} event - The keyboard event.
	 */
	const handleKeyDown = (event) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					// Open dropdown and highlight first item if closed
					setIsOpen(true);
					setHighlightedIndex(0);
				} else {
					// Move highlight down, clamping at the last item
					setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
				}
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					// Open dropdown and highlight last item if closed
					setIsOpen(true);
					setHighlightedIndex(options.length - 1);
				} else {
					// Move highlight up, clamping at the first item
					setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
				}
				break;

			case 'Enter':
			case ' ': // Space key also selects
				event.preventDefault();
				if (isOpen && highlightedIndex >= 0) {
					// Select the highlighted option if dropdown is open
					handleSelect(options[highlightedIndex].value);
				} else if (!isOpen) {
					// Open the dropdown if it was closed
					setIsOpen(true);
					// Highlight the currently selected item or the first item
					setHighlightedIndex(value ? options.findIndex((opt) => opt.value === value) : 0);
				}
				break;

			case 'Escape':
				event.preventDefault();
				// Close the dropdown
				setIsOpen(false);
				break;

			case 'Tab':
				// Allow default tab behavior, which will close the dropdown via blur/click outside
				setIsOpen(false);
				break;

			default: {
				// Handle first-letter navigation: find the next option starting with the typed character
				const char = event.key.toLowerCase();
				// Check if it's a single alphanumeric character
				if (char.length === 1 && /[a-z0-9]/.test(char)) {
					// Find the index of the first option starting with the character
					// TODO: Implement wrap-around or search from current index for better UX
					const nextIndex = options.findIndex((option) => option.label.toLowerCase().startsWith(char));
					if (nextIndex !== -1) {
						setHighlightedIndex(nextIndex);
						// Open the dropdown if it wasn't already
						if (!isOpen) setIsOpen(true);
					}
				}
				break;
			}
		}
	};

	/**
	 * Effect to scroll the currently highlighted option into view within the listbox.
	 */
	useEffect(() => {
		if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
			const highlightedElement = listboxRef.current.children[highlightedIndex];
			if (highlightedElement) {
				// Scroll the element into view, ensuring it's visible
				highlightedElement.scrollIntoView({
					block: 'nearest', // Avoids unnecessary scrolling if already visible
				});
			}
		}
	}, [highlightedIndex, isOpen]); // Re-run when highlight or open state changes

	/**
	 * Handles the selection of an option (via click or Enter/Space key).
	 * Calls the onChange prop, closes the dropdown, and resets highlight.
	 *
	 * @param {string|number} optionValue - The value of the selected option.
	 */
	const handleSelect = (optionValue) => {
		onChange(optionValue); // Notify parent component of the change
		setIsOpen(false); // Close the dropdown
		setHighlightedIndex(-1); // Reset highlight
		// Optionally, return focus to the button after selection
		dropdownRef.current?.querySelector('button')?.focus();
	};

	/**
	 * Toggles the open/closed state of the dropdown listbox when the button is clicked.
	 * Sets the initial highlight to the selected item or the first item when opening.
	 */
	const toggleDropdown = () => {
		if (!disabled) {
			const currentlyOpen = isOpen;
			setIsOpen(!currentlyOpen);
			// If opening, set highlight to current value or first item
			if (!currentlyOpen) {
				setHighlightedIndex(value ? options.findIndex((opt) => opt.value === value) : 0);
			}
		}
	};

	const labelId = `${id}-label`;
	const buttonId = id; // Use the provided id for the button itself

	return (
		<div className={`dropdown-filter ${className} ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`} ref={dropdownRef}>
			{/* Optional Label */}
			{label && (
				<label id={labelId} htmlFor={buttonId} className="dropdown-filter__label">
					{label}
					{required && <span className="dropdown-filter__required">*</span>}
				</label>
			)}

			<div className="dropdown-filter__control">
				{/* The button that acts as the dropdown control */}
				<button
					type="button"
					id={buttonId}
					className="dropdown-filter__button"
					aria-haspopup="listbox" // Indicates it controls a listbox
					aria-expanded={isOpen} // Communicates open/closed state
					aria-labelledby={`${labelId} ${buttonId}`} // Associates label and button text
					onClick={toggleDropdown}
					onKeyDown={handleKeyDown} // Handle keyboard navigation
					disabled={disabled}>
					{/* Display selected option label or placeholder */}
					<span className="dropdown-filter__value">{selectedOption ? selectedOption.label : placeholder}</span>
					{/* Arrow indicator */}
					<span className="dropdown-filter__arrow" aria-hidden="true">
						{isOpen ? '▲' : '▼'}
					</span>
				</button>

				{/* The listbox containing the options */}
				{isOpen && (
					<ul
						ref={listboxRef}
						className="dropdown-filter__options"
						role="listbox" // Semantically a listbox
						aria-labelledby={labelId} // Associated with the main label
						tabIndex={-1} // Make it focusable programmatically if needed, but not via Tab
					>
						{options.map((option, index) => (
							<li
								key={option.value}
								id={`${id}-option-${index}`} // Unique ID for each option
								role="option" // Semantically an option
								className={`dropdown-filter__option ${
									option.value === value ? 'is-selected' : '' // Style if selected
								} ${
									index === highlightedIndex ? 'is-highlighted' : '' // Style if highlighted
								}`}
								aria-selected={option.value === value} // Communicate selected state
								onClick={() => handleSelect(option.value)} // Handle click selection
								onMouseEnter={() => setHighlightedIndex(index)} // Highlight on mouse hover
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault();
										handleSelect(option.value);
									}
								}}
								tabIndex={0} // Make the list item focusable
							>
								{option.label}
								{/* Optional checkmark for selected item */}
								{option.value === value && (
									<span className="dropdown-filter__check" aria-hidden="true">
										✓
									</span>
								)}
							</li>
						))}
					</ul>
				)}
			</div>

			{/* Optional Error Message */}
			{error && (
				<div className="dropdown-filter__error" role="alert">
					{error}
				</div>
			)}
		</div>
	);
};

// Define PropTypes for type checking and documentation
DropdownFilter.propTypes = {
	/** Unique ID required for the component and ARIA attributes. */
	id: PropTypes.string.isRequired,
	/** Optional label text displayed above the dropdown. */
	label: PropTypes.string,
	/** Array of options to display. Each object needs 'value' (string or number) and 'label' (string). */
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	/** The value of the currently selected option. */
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	/** Callback function triggered when an option is selected. Receives the selected value. */
	onChange: PropTypes.func.isRequired,
	/** Text displayed in the button when no option is selected. Defaults to 'Select...'. */
	placeholder: PropTypes.string,
	/** If provided, displays an error message and applies error styling. */
	error: PropTypes.string,
	/** If true, adds a required indicator (*) to the label. Defaults to false. */
	required: PropTypes.bool,
	/** If true, disables the dropdown interaction. Defaults to false. */
	disabled: PropTypes.bool,
	/** Optional additional CSS class name(s) for the root element. */
	className: PropTypes.string,
};

export default DropdownFilter;
