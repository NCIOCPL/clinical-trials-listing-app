/* eslint react/prop-types: 0 */
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import classnames from 'classnames';

import { ActionTypes, useComboBox } from './useComboBox';
import './ComboBox.scss';

/*  As per USWDS spec, ComboBox includes a HTML <select> with options AND a separate <input> and dropdown <ul> with items.
    The select is usa-sr-only and is always hidden via CSS. The input and dropdown list are the elements used for interaction.

    There is the ability to pass in custom props directly to the select and input.
    This should be using sparingly and not with existing Combobox props such as disabled, onChange, defaultValue.
*/

const DEFAULT_FILTER = '.*{{query}}.*';

const Direction = {
	Previous: -1,
	Next: 1,
};

const FocusMode = {
	None: 0,
	Input: 1,
	Item: 2,
};

const Input = forwardRef(({ focused, ...inputProps }, ref) => {
	const internalRef = useRef(null);
	const inputRef = ref ?? internalRef;

	useEffect(() => {
		if (focused && inputRef.current) {
			inputRef.current.focus({ preventScroll: true });
		}
	}, [focused]);

	return <input type="text" {...inputProps} className="usa-combo-box__input" data-testid="combo-box-input" autoCapitalize="off" autoComplete="off" ref={inputRef} />;
});

const ComboBoxForwardRef = ({ id, name, className, options, defaultValue, disabled, onChange, assistiveHint, noResults, selectProps, inputProps, ulProps, customFilter, disableFiltering = false }, ref) => {
	const isDisabled = !!disabled;

	let defaultOption;
	if (defaultValue) {
		defaultOption = options.find((opt) => {
			return opt.value === defaultValue;
		});
	}

	const filter = customFilter ? customFilter : { filter: DEFAULT_FILTER };

	const initialState = {
		isOpen: false,
		selectedOption: defaultOption ? defaultOption : undefined,
		focusedOption: undefined,
		focusMode: FocusMode.None,
		filteredOptions: options,
		inputValue: defaultOption ? defaultOption.label : '',
		statusText: '',
	};

	const [state, dispatch] = useComboBox(initialState, options, disableFiltering, filter);

	const containerRef = useRef(null);
	const listRef = useRef(null);
	const focusedItemRef = useRef(null);

	// Use refs to track previous values to avoid infinite loops
	const previousDefaultValueRef = useRef(defaultValue);
	const previousOptionsRef = useRef(options); // Ref to track previous options prop
	const isSelectionInProgressRef = useRef(false);

	// Single useEffect to handle both options and defaultValue changes
	useEffect(() => {
		// Handle defaultValue change
		if (defaultValue !== previousDefaultValueRef.current) {
			previousDefaultValueRef.current = defaultValue;

			const currentSelectedValue = state.selectedOption ? state.selectedOption.value : undefined;

			if (defaultValue !== currentSelectedValue) {
				if (defaultValue) {
					const optionToSelect = options.find((opt) => opt.value === defaultValue);
					if (optionToSelect) {
						dispatch({
							type: ActionTypes.SELECT_OPTION,
							option: optionToSelect,
						});
					}
				} else if (defaultValue === '' || defaultValue === null || defaultValue === undefined) {
					if (state.selectedOption) {
						dispatch({ type: ActionTypes.CLEAR });
					}
				}
			}
		}

		// Handle options change
		if (options !== previousOptionsRef.current) {
			previousOptionsRef.current = options; // Update the ref

			// When options list changes (e.g., subtypes after maintype selection),
			// re-filter based on the current input value.
			// The useComboBox hook's UPDATE_FILTER action will handle updating
			// state.filteredOptions and potentially state.focusedOption.
			dispatch({
				type: ActionTypes.RESET_OPTIONS_LIST,
				optionsList: options,
			});

			// If we have a defaultValue but no selected option yet (because options were loading),
			// try to select the matching option now that options are available
			if (defaultValue && !state.selectedOption && options.length > 0) {
				const matchingOption = options.find((opt) => opt.value === defaultValue);
				if (matchingOption) {
					dispatch({
						type: ActionTypes.SELECT_OPTION,
						option: matchingOption,
					});
				}
			}
		}
	}, [defaultValue, options, dispatch, state.selectedOption]);

	useEffect(() => {
		// When clearing (selectedOption becomes undefined), call onChange with empty string
		// When selecting, call onChange with the selected value
		const valueToPass = state.selectedOption?.value ?? '';
		onChange && onChange(valueToPass);
	}, [state.selectedOption]);

	useEffect(() => {
		if (state.focusMode === FocusMode.Item && state.focusedOption && focusedItemRef.current) {
			focusedItemRef.current.focus();
		}
	}, [state.focusMode, state.focusedOption]);

	// When opened, the list should scroll to the closest match
	useEffect(() => {
		if (state.isOpen && state.focusedOption && focusedItemRef.current && listRef.current && state.focusMode === FocusMode.Input) {
			const optionBottom = focusedItemRef.current.offsetTop + focusedItemRef.current.offsetHeight;
			const currentBottom = listRef.current.scrollTop + listRef.current.offsetHeight;

			if (optionBottom > currentBottom) {
				listRef.current.scrollTop = optionBottom - listRef.current.offsetHeight;
			}

			if (focusedItemRef.current.offsetTop < listRef.current.scrollTop) {
				listRef.current.scrollTop = focusedItemRef.current.offsetTop;
			}
		}
	}, [state.isOpen, state.focusedOption]);

	// If the focused element (activeElement) is outside of the combo box,
	// make sure the focusMode is BLUR
	useEffect(() => {
		if (state.focusMode !== FocusMode.None) {
			if (!containerRef.current?.contains(window.document.activeElement)) {
				dispatch({
					type: ActionTypes.BLUR,
				});
			}
		}
	}, [state.focusMode]);

	useImperativeHandle(
		ref,
		() => ({
			focus: () => dispatch({ type: ActionTypes.FOCUS_INPUT }),
			clearSelection: () => dispatch({ type: ActionTypes.CLEAR_SELECTION }),
		}),
		[]
	);

	const handleInputKeyDown = (event) => {
		if (event.key === 'Escape') {
			dispatch({ type: ActionTypes.CLOSE_LIST });
		} else if (event.key === 'ArrowDown' || event.key == 'Down') {
			event.preventDefault();
			dispatch({
				type: ActionTypes.FOCUS_OPTION,
				option: state.focusedOption || state.filteredOptions[0] || state.selectedOption,
			});
		} else if (event.key === 'Tab') {
			// Clear button is not visible in this case so manually handle focus
			if (state.isOpen && !state.selectedOption) {
				// If there are filtered options, prevent default
				// If there are "No Results Found", tab over to prevent a keyboard trap
				const optionToFocus = disableFiltering ? state.focusedOption : state.selectedOption || state.focusedOption;
				if (optionToFocus) {
					event.preventDefault();
					dispatch({
						type: ActionTypes.FOCUS_OPTION,
						option: optionToFocus,
					});
				} else {
					dispatch({
						type: ActionTypes.BLUR,
					});
				}
			}

			if (!state.isOpen && state.selectedOption) {
				dispatch({
					type: ActionTypes.BLUR,
				});
			}
		} else if (event.key === 'Enter') {
			if (state.isOpen) {
				state.selectedOption = state.focusedOption;
				event.preventDefault();
				const exactMatch = state.filteredOptions.find((option) => option.label.toLowerCase() === state.inputValue.toLowerCase());
				if (exactMatch) {
					dispatch({
						type: ActionTypes.SELECT_OPTION,
						option: exactMatch,
					});
				} else {
					if (state.selectedOption) {
						dispatch({
							type: ActionTypes.CLOSE_LIST,
						});
					} else {
						dispatch({ type: ActionTypes.CLEAR });
					}
				}
			}
		}
	};

	const handleInputBlur = (event) => {
		const { relatedTarget: newTarget } = event;
		const newTargetIsOutside = !newTarget || (newTarget instanceof Node && !containerRef.current?.contains(newTarget));

		// Reset scroll position and cursor to beginning
		if (inputRef.current) {
			inputRef.current.scrollLeft = 0;
			inputRef.current.setSelectionRange(0, 0);
		}

		// Only blur if we're not in the middle of a selection
		if (newTargetIsOutside && state.focusMode !== FocusMode.None && !isSelectionInProgressRef.current) {
			dispatch({ type: ActionTypes.BLUR });
		}
	};

	const handleClearKeyDown = (event) => {
		if (event.key === 'Tab' && state.isOpen && state.selectedOption) {
			event.preventDefault();
			dispatch({
				type: ActionTypes.FOCUS_OPTION,
				option: state.selectedOption,
			});
		}
	};

	const focusSibling = (dispatch, state, change) => {
		const currentIndex = state.focusedOption ? state.filteredOptions.indexOf(state.focusedOption) : -1;
		const firstOption = state.filteredOptions[0];
		const lastOption = state.filteredOptions[state.filteredOptions.length - 1];

		if (currentIndex === -1) {
			dispatch({ type: ActionTypes.FOCUS_OPTION, option: firstOption });
			//dispatch({ type: ActionTypes.SELECT_OPTION, option: firstOption });
		} else {
			const newIndex = currentIndex + change;
			if (newIndex < 0) {
				dispatch({ type: ActionTypes.CLOSE_LIST });
			} else if (newIndex >= state.filteredOptions.length) {
				dispatch({ type: ActionTypes.FOCUS_OPTION, option: lastOption });
			} else {
				const newOption = state.filteredOptions[newIndex];
				dispatch({ type: ActionTypes.FOCUS_OPTION, option: newOption });
			}
		}
	};

	const handleListItemBlur = (event) => {
		const { relatedTarget: newTarget } = event;

		if (!newTarget || (newTarget instanceof Node && !containerRef.current?.contains(newTarget))) {
			dispatch({ type: ActionTypes.BLUR });
		}
	};

	const handleListItemKeyDown = (event) => {
		if (event.key === 'Escape') {
			dispatch({ type: ActionTypes.CLOSE_LIST });
		} else if (event.key === 'Tab' || event.key === 'Enter') {
			event.preventDefault();
			if (state.focusedOption) {
				dispatch({
					type: ActionTypes.SELECT_OPTION,
					option: state.focusedOption,
				});
			}
		} else if (event.key === 'ArrowDown' || event.key === 'Down') {
			event.preventDefault();
			focusSibling(dispatch, state, Direction.Next);
		} else if (event.key === 'ArrowUp' || event.key === 'Up') {
			event.preventDefault();
			focusSibling(dispatch, state, Direction.Previous);
		}
	};

	const isPristine = state.selectedOption;

	const containerClasses = classnames('usa-combo-box', className, {
		'usa-combo-box--pristine': isPristine,
	});

	const listID = `${id}--list`;
	const assistiveHintID = `${id}--assistiveHint`;

	const focusedItemIndex = state.focusedOption ? state.filteredOptions.findIndex((i) => i === state.focusedOption) : -1;
	const focusedItemId = focusedItemIndex > -1 && `${listID}--option-${focusedItemIndex}`;
	const inputRef = useRef(null);

	return (
		<div data-testid="combo-box" data-enhanced="true" className={containerClasses} ref={containerRef}>
			<select {...selectProps} className="usa-select usa-sr-only usa-combo-box__select" name={name} aria-hidden tabIndex={-1} defaultValue={state.selectedOption?.value} data-testid="combo-box-select">
				{options.map((option) => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
			<Input
				{...inputProps}
				ref={inputRef}
				role="combobox"
				onChange={(e) => {
					if (inputProps?.onChange) {
						// Allow a custom input onChange handler
						inputProps?.onChange(e);
					}

					dispatch({ type: ActionTypes.UPDATE_FILTER, value: e.target.value });
				}}
				onClick={(e) => {
					if (e.target.value) {
						dispatch({ type: ActionTypes.UPDATE_FILTER, value: e.target.value });
					}

					dispatch({ type: ActionTypes.OPEN_LIST });
				}}
				onBlur={handleInputBlur}
				onKeyDown={handleInputKeyDown}
				value={state.inputValue}
				focused={state.focusMode === FocusMode.Input}
				aria-owns={listID}
				aria-controls={listID}
				aria-autocomplete="list"
				aria-describedby={assistiveHintID}
				aria-expanded={state.isOpen}
				aria-activedescendant={(state.isOpen && focusedItemId) || ''}
				id={id}
				disabled={isDisabled}
			/>
			<span className="usa-combo-box__clear-input__wrapper" tabIndex={-1}>
				<button type="button" className="usa-combo-box__clear-input" aria-label="Clear the select contents" onClick={() => dispatch({ type: ActionTypes.CLEAR })} data-testid="combo-box-clear-button" onKeyDown={handleClearKeyDown} hidden={!isPristine || isDisabled} disabled={isDisabled}>
					&nbsp;
				</button>
			</span>
			<span className="usa-combo-box__input-button-separator">&nbsp;</span>
			<span className="usa-combo-box__toggle-list__wrapper" tabIndex={-1}>
				<button
					data-testid="combo-box-toggle"
					type="button"
					className="usa-combo-box__toggle-list"
					tabIndex={-1}
					aria-label="Toggle the dropdown list"
					onClick={() =>
						dispatch({
							type: state.isOpen ? ActionTypes.CLOSE_LIST : ActionTypes.OPEN_LIST,
						})
					}
					disabled={isDisabled}>
					&nbsp;
				</button>
			</span>
			<ul {...ulProps} data-testid="combo-box-option-list" tabIndex={-1} id={listID} className="usa-combo-box__list" role="listbox" ref={listRef} hidden={!state.isOpen}>
				{state.filteredOptions.map((option, index) => {
					const focused = option === state.focusedOption;
					const selected = option === state.selectedOption;
					const itemClasses = classnames('usa-combo-box__list-option', {
						'usa-combo-box__list-option--focused': focused,
						'usa-combo-box__list-option--selected': selected,
					});

					return (
						<li
							ref={focused ? focusedItemRef : null}
							value={option.value}
							key={option.value}
							className={itemClasses}
							tabIndex={focused ? 0 : -1}
							role="option"
							aria-selected={selected}
							aria-setsize={state.filteredOptions.length}
							aria-posinset={index + 1}
							id={listID + `--option-${index}`}
							onKeyDown={handleListItemKeyDown}
							onBlur={handleListItemBlur}
							data-testid={`combo-box-option-${option.value}`}
							data-value={option.value}
							onMouseEnter={() => dispatch({ type: ActionTypes.FOCUS_OPTION, option: option })}
							onClick={() => {
								// Set selection in progress flag to prevent blur handler from overriding
								isSelectionInProgressRef.current = true;

								// Dispatch action to update internal state
								dispatch({ type: ActionTypes.SELECT_OPTION, option: option });

								// Trigger onChange immediately to update parent components
								onChange && onChange(option.value);

								// Reset flag after a short delay to allow state updates to complete
								setTimeout(() => {
									isSelectionInProgressRef.current = false;
								}, 50);
							}}>
							{option.label}
						</li>
					);
				})}
				{state.filteredOptions.length === 0 ? <li className="usa-combo-box__list-option--no-results">{noResults || 'No results found'}</li> : null}
			</ul>

			<div className="usa-combo-box__status usa-sr-only" role="status">
				{state.statusText}
			</div>
			<span id={assistiveHintID} className="usa-sr-only" data-testid="combo-box-assistive-hint">
				{assistiveHint ||
					`When autocomplete results are available use up and down arrows to review
           and enter to select. Touch device users, explore by touch or with swipe
           gestures.`}
			</span>
		</div>
	);
};

export { FocusMode };
export const ComboBox = forwardRef(ComboBoxForwardRef);

export default ComboBox;
