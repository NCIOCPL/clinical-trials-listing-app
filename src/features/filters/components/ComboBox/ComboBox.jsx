/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import './ComboBox.scss';

const ComboBox = ({ label, placeholder, options, multiSelect, value, onChange, helpText, disabled = false, loading = false, error, required = false, minChars = 2, onSearch, name }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchText, setSearchText] = useState('');
	const [highlightedIndex, setHighlightedIndex] = useState(-1);
	const wrapperRef = useRef(null);
	const inputRef = useRef(null);
	const listboxRef = useRef(null);
	const tracking = useTracking();

	useEffect(() => {
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	useEffect(() => {
		if (searchText.length >= minChars && onSearch) {
			onSearch(searchText);
		}
	}, [searchText, minChars, onSearch]);

	const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(searchText.toLowerCase()));

	const handleSelect = (option) => {
		if (multiSelect) {
			const newValue = value.includes(option.value) ? value.filter((v) => v !== option.value) : [...value, option.value];
			onChange(newValue);

			tracking.trackEvent({
				type: 'Other',
				event: 'TrialListingApp:Filter:Change',
				filterType: name,
				filterValue: option.value,
				action: newValue.includes(option.value) ? 'select' : 'deselect',
			});
		} else {
			onChange([option.value]);
			setIsOpen(false);

			tracking.trackEvent({
				type: 'Other',
				event: 'TrialListingApp:Filter:Change',
				filterType: name,
				filterValue: option.value,
				action: 'select',
			});
		}
		setSearchText('');
	};

	const handleKeyDown = (e) => {
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				e.preventDefault();
				setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
				break;
			case 'Enter':
				e.preventDefault();
				if (highlightedIndex >= 0) {
					handleSelect(filteredOptions[highlightedIndex]);
				}
				break;
			case 'Escape':
				setIsOpen(false);
				break;
			default:
				break;
		}
	};

	const removeValue = (valueToRemove) => {
		const newValue = value.filter((v) => v !== valueToRemove);
		onChange(newValue);
	};

	return (
		<div className="combobox" ref={wrapperRef}>
			{label && (
				<label className="combobox__label" htmlFor={`${name}-input`}>
					{label}
					{required && <span className="combobox__required">*</span>}
				</label>
			)}

			<div className={`combobox__input-wrapper ${error ? 'has-error' : ''}`}>
				<input
					id={`${name}-input`}
					ref={inputRef}
					type="text"
					className="combobox__input"
					placeholder={placeholder}
					value={searchText}
					onChange={(e) => {
						setSearchText(e.target.value);
						setIsOpen(true);
					}}
					onFocus={() => setIsOpen(true)}
					onKeyDown={handleKeyDown}
					disabled={disabled}
					aria-expanded={isOpen}
					aria-autocomplete="list"
					aria-controls={`${name}-listbox`}
					aria-activedescendant={highlightedIndex >= 0 ? `${name}-option-${highlightedIndex}` : undefined}
				/>

				{/*  How do we want to handl loading states for the options*/}
				{/*{loading && <span className="combobox__spinner" aria-hidden="true" />}*/}

				<button type="button" className="combobox__toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close options' : 'Open options'} disabled={disabled}>
					<svg
						width="10"
						height="6"
						viewBox="0 0 10 6"
						fill="none"
						style={{
							transform: isOpen ? 'rotate(180deg)' : 'none',
						}}>
						<path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" />
					</svg>
				</button>
			</div>

			{error && (
				<div className="combobox__error" role="alert">
					{error}
				</div>
			)}

			{helpText && <div className="combobox__help-text">{helpText}</div>}

			{isOpen && filteredOptions.length > 0 && (
				<ul ref={listboxRef} className="combobox__options" role="listbox" id={`${name}-listbox`} aria-multiselectable={multiSelect}>
					{filteredOptions.map((option, index) => (
						<li
							key={option.value}
							id={`${name}-option-${index}`}
							role="option"
							aria-selected={value.includes(option.value)}
							className={`
                combobox__option
                ${value.includes(option.value) ? 'is-selected' : ''}
                ${index === highlightedIndex ? 'is-highlighted' : ''}
              `}
							onClick={() => handleSelect(option)}>
							{multiSelect && <input type="checkbox" checked={value.includes(option.value)} readOnly tabIndex={-1} />}
							<span className="combobox__option-label">{option.label}</span>
							{option.count !== undefined && <span className="combobox__option-count">({option.count})</span>}
						</li>
					))}
				</ul>
			)}

			{multiSelect && value.length > 0 && (
				<div className="combobox__selected">
					{value.map((v) => {
						const option = options.find((o) => o.value === v);
						return (
							<span key={v} className="combobox__tag">
								{option?.label}
								<button type="button" onClick={() => removeValue(v)} aria-label={`Remove ${option?.label}`} className="combobox__tag-remove">
									×
								</button>
							</span>
						);
					})}
				</div>
			)}
		</div>
	);
};

ComboBox.propTypes = {
	label: PropTypes.string,
	placeholder: PropTypes.string,
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
			count: PropTypes.number,
		})
	).isRequired,
	multiSelect: PropTypes.bool,
	value: PropTypes.arrayOf(PropTypes.string).isRequired,
	onChange: PropTypes.func.isRequired,
	helpText: PropTypes.string,
	disabled: PropTypes.bool,
	loading: PropTypes.bool,
	error: PropTypes.string,
	required: PropTypes.bool,
	minChars: PropTypes.number,
	onSearch: PropTypes.func,
	name: PropTypes.string.isRequired,
};

export default ComboBox;
