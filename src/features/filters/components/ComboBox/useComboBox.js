import { useReducer } from 'react';
import { FocusMode } from './ComboBox';
import { generateDynamicRegExp } from './utils';

export const ActionTypes = {
	SELECT_OPTION: 'SELECT_OPTION',
	CLEAR: 'CLEAR',
	OPEN_LIST: 'OPEN_LIST',
	CLOSE_LIST: 'CLOSE_LIST',
	FOCUS_OPTION: 'FOCUS_OPTION',
	UPDATE_FILTER: 'UPDATE_FILTER',
	BLUR: 'BLUR',
	CLEAR_SELECTION: 'CLEAR_SELECTION',
	FOCUS_INPUT: 'FOCUS_INPUT',
	RESET_OPTIONS_LIST: 'RESET_OPTIONS_LIST',
};

export const useComboBox = (initialState, initialOptionsList, disableFiltering, customizableFilter) => {
	let optionsList = initialOptionsList;

	const getPotentialMatches = (needle, currentOptions = optionsList) => {
		const regex = generateDynamicRegExp(customizableFilter.filter, needle, customizableFilter.extras);
		const filteredOptions = currentOptions.filter((option) => regex.test(option.label.toLowerCase()));

		if (disableFiltering) {
			return {
				closestMatch: filteredOptions.length > 0 ? filteredOptions[0] : optionsList[0],
				optionsToDisplay: optionsList,
			};
		}

		return {
			closestMatch: filteredOptions[0],
			optionsToDisplay: filteredOptions,
		};
	};

	const reducer = (state, action) => {
		switch (action.type) {
			case ActionTypes.SELECT_OPTION:
				return {
					...state,
					isOpen: false,
					selectedOption: action.option,
					focusMode: FocusMode.Input,
					inputValue: action.option.label,
					filteredOptions: optionsList,
					focusedOption: action.option,
					statusText: '',
				};
			case ActionTypes.UPDATE_FILTER: {
				const { closestMatch, optionsToDisplay } = getPotentialMatches(action.value);

				const newState = {
					...state,
					isOpen: true,
					filteredOptions: optionsToDisplay,
					inputValue: action.value,
					statusText: `${optionsToDisplay.length} result${optionsToDisplay.length > 1 ? 's' : ''} available.`,
				};

				if (optionsToDisplay.length < 1) {
					newState.statusText = 'No results.';
				}

				if (disableFiltering || !state.selectedOption) {
					newState.focusedOption = closestMatch;
				} else if (state.selectedOption) {
					if (newState.filteredOptions.includes(state.selectedOption)) {
						newState.focusedOption = newState.filteredOptions[0] || state.selectedOption;
					} else {
						newState.focusedOption = closestMatch;
					}
				}

				return newState;
			}
			case ActionTypes.OPEN_LIST: {
				const statusText = state.filteredOptions.length ? `${state.filteredOptions.length} result${state.filteredOptions.length > 1 ? 's' : ''} available.` : 'No results.';

				return {
					...state,
					isOpen: true,
					focusMode: FocusMode.Input,
					focusedOption: state.selectedOption,
					statusText,
				};
			}
			case ActionTypes.CLOSE_LIST: {
				const newState = {
					...state,
					isOpen: false,
					focusMode: FocusMode.Input,
					focusedOption: undefined,
					statusText: '',
				};

				if (state.filteredOptions.length === 0) {
					newState.filteredOptions = optionsList;
					newState.inputValue = '';
				}

				if (state.selectedOption) {
					newState.inputValue = state.selectedOption.label;
				}

				return newState;
			}

			case ActionTypes.FOCUS_OPTION: {
				const statusText = state.filteredOptions.length ? `${state.filteredOptions.length} result${state.filteredOptions.length > 1 ? 's' : ''} available.` : 'No results.';

				return {
					...state,
					isOpen: true,
					focusedOption: action.option,
					focusMode: FocusMode.Item,
					statusText,
				};
			}
			case ActionTypes.CLEAR:
				return {
					...state,
					inputValue: '',
					isOpen: false,
					focusMode: FocusMode.Input,
					selectedOption: undefined,
					filteredOptions: optionsList,
					focusedOption: optionsList.length > 0 ? optionsList[0] : undefined, // Uses initialOptionsList
					statusText: '',
				};
			case ActionTypes.BLUR: {
				const newState = {
					...state,
					isOpen: false,
					focusMode: FocusMode.None,
					filteredOptions: optionsList,
					statusText: '',
				};

				if (!state.selectedOption) {
					newState.inputValue = '';
					newState.focusedOption = optionsList.length > 0 ? optionsList[0] : undefined;
				} else {
					newState.inputValue = state.selectedOption.label;
					newState.focusedOption = state.selectedOption;
				}

				return newState;
			}
			case ActionTypes.CLEAR_SELECTION: {
				return {
					...state,
					inputValue: '',
					isOpen: false,
					focusMode: FocusMode.None,
					selectedOption: undefined,
					filteredOptions: optionsList, // Uses initialOptionsList
					focusedOption: undefined,
					statusText: '',
				};
			}
			case ActionTypes.RESET_OPTIONS_LIST: {
				// Dispatched when the main 'options' prop of ComboBox changes.
				// We need to update our internal reference and re-filter.
				optionsList = action.optionsList;
				// Use current state.inputValue from the reducer's state for re-filtering.
				const { closestMatch, optionsToDisplay } = getPotentialMatches(state.inputValue, optionsList);

				let newSelectedOption = state.selectedOption;
				let newInputValue = state.inputValue;

				if (state.selectedOption && !optionsList.find((opt) => opt.value === state.selectedOption.value)) {
					newSelectedOption = undefined; // Clear selection if old selection not in new options
					// If selectedOption was cleared, and inputValue was its label, clear inputValue.
					if (state.inputValue === state.selectedOption.label) {
						newInputValue = '';
					}
					// else, inputValue was something else (user typing), keep it.
				} else if (newSelectedOption) {
					// If a selection is still valid, its label should be the inputValue.
					newInputValue = newSelectedOption.label;
				}

				return {
					...state,
					filteredOptions: optionsToDisplay,
					selectedOption: newSelectedOption,
					inputValue: newInputValue,
					// Update focusedOption: if selected is still valid, focus it. Else, focus closest match in new list.
					focusedOption: newSelectedOption || closestMatch || (optionsToDisplay.length > 0 ? optionsToDisplay[0] : undefined),
					statusText: state.isOpen ? `${optionsToDisplay.length} result${optionsToDisplay.length > 1 ? 's' : ''} available.` : '',
				};
			}
			case ActionTypes.FOCUS_INPUT: {
				return {
					...state,
					focusMode: FocusMode.Input,
				};
			}
			default:
				throw new Error();
		}
	};

	return useReducer(reducer, initialState);
};
