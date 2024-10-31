import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './DropdownFilter.scss';

const DropdownFilter = ({ id, label, options, value, onChange, placeholder = 'Select...', error, required = false, disabled = false, className = '' }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const dropdownRef = useRef(null);
	const listboxRef = useRef(null);

	const selectedOption = options.find((option) => option.value === value);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleKeyDown = (event) => {
		switch (event.key) {
			case 'ArrowDown':
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					setHighlightedIndex(0);
				} else {
					setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
				}
				break;

			case 'ArrowUp':
				event.preventDefault();
				if (!isOpen) {
					setIsOpen(true);
					setHighlightedIndex(options.length - 1);
				} else {
					setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
				}
				break;

			case 'Enter':
			case ' ':
				event.preventDefault();
				if (isOpen && highlightedIndex >= 0) {
					handleSelect(options[highlightedIndex].value);
				} else {
					setIsOpen(true);
				}
				break;

			case 'Escape':
				event.preventDefault();
				setIsOpen(false);
				break;

			case 'Tab':
				setIsOpen(false);
				break;

			default:
				// Handle first-letter navigation
				const char = event.key.toLowerCase();
				if (char.length === 1 && /[a-z0-9]/.test(char)) {
					const nextIndex = options.findIndex((option) => option.label.toLowerCase().startsWith(char));
					if (nextIndex !== -1) {
						setHighlightedIndex(nextIndex);
						if (!isOpen) setIsOpen(true);
					}
				}
				break;
		}
	};

	useEffect(() => {
		if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
			const highlightedElement = listboxRef.current.children[highlightedIndex];
			if (highlightedElement) {
				highlightedElement.scrollIntoView({
					block: 'nearest',
				});
			}
		}
	}, [highlightedIndex, isOpen]);

	const handleSelect = (optionValue) => {
		onChange(optionValue);
		setIsOpen(false);
		setHighlightedIndex(-1);
	};

	const toggleDropdown = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
			if (!isOpen) {
				setHighlightedIndex(value ? options.findIndex((opt) => opt.value === value) : 0);
			}
		}
	};

	return (
		<div className={`dropdown-filter ${className} ${error ? 'has-error' : ''} ${disabled ? 'is-disabled' : ''}`} ref={dropdownRef}>
			{label && (
				<label id={`${id}-label`} htmlFor={id} className="dropdown-filter__label">
					{label}
					{required && <span className="dropdown-filter__required">*</span>}
				</label>
			)}

			<div className="dropdown-filter__control">
				<button type="button" id={id} className="dropdown-filter__button" aria-haspopup="listbox" aria-expanded={isOpen} aria-labelledby={`${id}-label ${id}`} aria-invalid={error ? 'true' : 'false'} onClick={toggleDropdown} onKeyDown={handleKeyDown} disabled={disabled}>
					<span className="dropdown-filter__value">{selectedOption ? selectedOption.label : placeholder}</span>
					<span className="dropdown-filter__arrow" aria-hidden="true">
						{isOpen ? '▲' : '▼'}
					</span>
				</button>

				{isOpen && (
					<ul ref={listboxRef} className="dropdown-filter__options" role="listbox" aria-labelledby={`${id}-label`} tabIndex={-1}>
						{options.map((option, index) => (
							<li key={option.value} id={`${id}-option-${index}`} role="option" className={`dropdown-filter__option ${option.value === value ? 'is-selected' : ''} ${index === highlightedIndex ? 'is-highlighted' : ''}`} aria-selected={option.value === value} onClick={() => handleSelect(option.value)}>
								{option.label}
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

			{error && (
				<div className="dropdown-filter__error" role="alert">
					{error}
				</div>
			)}
		</div>
	);
};

DropdownFilter.propTypes = {
	id: PropTypes.string.isRequired,
	label: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			label: PropTypes.string.isRequired,
		})
	).isRequired,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	error: PropTypes.string,
	required: PropTypes.bool,
	disabled: PropTypes.bool,
	className: PropTypes.string,
};

export default DropdownFilter;
