import React from 'react';
import PropTypes from 'prop-types';
import { InputLabel, RemovableTag } from '../../atomic';
import { uniqueIdForComponent } from '../../../utilities';
import { connect } from 'react-redux';
import { trackFormInputChange } from '../../../store/modules/analytics/tracking/tracking.actions';
import { SEARCH_FORM_ID } from '../../../constants';
import './Autocomplete.scss';

const IMPERATIVE_API = [
	'blur',
	'checkValidity',
	'click',
	'focus',
	'select',
	'setCustomValidity',
	'setSelectionRange',
	'setRangeText',
];

function getScrollOffset() {
	return {
		x:
			window.pageXOffset !== undefined
				? window.pageXOffset
				: (
						document.documentElement ||
						document.body.parentNode ||
						document.body
				  ).scrollLeft,
		y:
			window.pageYOffset !== undefined
				? window.pageYOffset
				: (
						document.documentElement ||
						document.body.parentNode ||
						document.body
				  ).scrollTop,
	};
}

class Autocomplete extends React.Component {
	static propTypes = {
		/**
		 * Input id
		 */
		id: PropTypes.string,
		/**
		 * The items to display in the dropdown menu
		 */
		labelHint: PropTypes.string,
		/**
		 * The items to display in the dropdown menu
		 */
		inputClasses: PropTypes.string,
		/**
		 * The items to display in the dropdown menu
		 */
		items: PropTypes.array.isRequired,
		/**
		 * The value to display in the input field
		 */
		value: PropTypes.any,
		/**
		 * Arguments: `event: Event, value: String`
		 *
		 * Invoked every time the user changes the input's value.
		 */
		onChange: PropTypes.func,
		/**
		 * Arguments: `value: String, item: Any`
		 *
		 * Invoked when the user selects an item from the dropdown menu.
		 */
		onSelect: PropTypes.func,
		/**
		 * Arguments: `item: Any, value: String`
		 *
		 * Invoked for each entry in `items` and its return value is used to
		 * determine whether or not it should be displayed in the dropdown menu.
		 * By default all items are always rendered.
		 */
		shouldItemRender: PropTypes.func,
		/**
		 * Arguments: `item: Any`
		 *
		 * Invoked when attempting to select an item. The return value is used to
		 * determine whether the item should be selectable or not.
		 * By default all items are selectable.
		 */
		isItemSelectable: PropTypes.func,
		/**
		 * Arguments: `itemA: Any, itemB: Any, value: String`
		 *
		 * The function which is used to sort `items` before display.
		 */
		sortItems: PropTypes.func,
		/**
		 * Arguments: `item: Any`
		 *
		 * Used to read the display value from each entry in `items`.
		 */
		getItemValue: PropTypes.func.isRequired,
		/**
		 * Arguments: `item: Any, isHighlighted: Boolean, styles: Object`
		 *
		 * Invoked for each entry in `items` that also passes `shouldItemRender` to
		 * generate the render tree for each item in the dropdown menu. `styles` is
		 * an optional set of styles that can be applied to improve the look/feel
		 * of the items in the dropdown menu.
		 */
		renderItem: PropTypes.func.isRequired,
		/**
		 * Arguments: `items: Array<Any>, value: String, styles: Object`
		 *
		 * Invoked to generate the render tree for the dropdown menu. Ensure the
		 * returned tree includes every entry in `items` or else the highlight order
		 * and keyboard navigation logic will break. `styles` will contain
		 * { top, left, minWidth } which are the coordinates of the top-left corner
		 * and the width of the dropdown menu.
		 */
		renderMenu: PropTypes.func,
		/**
		 * Styles that are applied to the dropdown menu
		 * `menuClass` applies css landmark to add custom styles
		 * to the rendered menu
		 */
		menuClass: PropTypes.object,
		/**
		 * Arguments: `props: Object`
		 *
		 * Invoked to generate the input element. The `props` argument is the result
		 * of merging `props.inputProps` with a selection of props that are required
		 * both for functionality and accessibility. At the very least you need to
		 * apply `props.ref` and all `props.on<event>` event handlers. Failing to do
		 * this will cause `Autocomplete` to behave unexpectedly.
		 */
		renderInput: PropTypes.func,
		/**
		 * Props passed to `props.renderInput`. By default these props will be
		 * applied to the `<input />` element rendered by `Autocomplete`, unless you
		 * have specified a custom value for `props.renderInput`. Any properties
		 * supported by `HTMLInputElement` can be specified, apart from the
		 * following which are set by `Autocomplete`: value, autoComplete, role,
		 * aria-autocomplete. `inputProps` is commonly used for (but not limited to)
		 * placeholder, event handlers (onFocus, onBlur, etc.), autoFocus, etc..
		 */
		inputProps: PropTypes.object,
		/**
		 * Props that are applied to the element which wraps the `<input />` and
		 * dropdown menu elements rendered by `Autocomplete`.
		 */
		wrapperProps: PropTypes.object,
		/**
		 * This is a shorthand for `wrapperProps={{ style: <your styles> }}`.
		 * Note that `wrapperStyle` is applied before `wrapperProps`, so the latter
		 * will win if it contains a `style` entry.
		 */
		wrapperClasses: PropTypes.string,
		/**
		 * Whether or not to automatically highlight the top match in the dropdown
		 * menu.
		 */
		autoHighlight: PropTypes.bool,
		/**
		 * Whether or not to automatically select the highlighted item when the
		 * `<input>` loses focus.
		 */
		selectOnBlur: PropTypes.bool,
		/**
		 * Arguments: `isOpen: Boolean`
		 *
		 * Invoked every time the dropdown menu's visibility changes (i.e. every
		 * time it is displayed/hidden).
		 */
		onMenuVisibilityChange: PropTypes.func,
		/**
		 * Used to override the internal logic which displays/hides the dropdown
		 * menu. This is useful if you want to force a certain state based on your
		 * UX/business logic. Use it together with `onMenuVisibilityChange` for
		 * fine-grained control over the dropdown menu dynamics.
		 */
		open: PropTypes.bool,
		debug: PropTypes.bool,
		multiselect: PropTypes.bool,
		chipList: PropTypes.array,
		onChipRemove: PropTypes.func,
		labelHidden: PropTypes.bool,
		label: PropTypes.string,
		modified: PropTypes.bool,
		inputHelpText: PropTypes.string,
		trackFormInputChange: PropTypes.func,
	};

	static defaultProps = {
		inputClasses: '',
		value: '',
		wrapperProps: {},
		wrapperStyle: {},
		inputProps: {},
		renderInput(props) {
			return <input {...props} />;
		},
		onChange() {},
		onSelect() {},
		isItemSelectable() {
			return true;
		},
		renderMenu(items, value, style, classes) {
			return <div className={`cts-autocomplete__menu ${classes}`}>{items}</div>;
		},
		autoHighlight: true,
		selectOnBlur: false,
		onMenuVisibilityChange() {},
		labelHint: '',
		wrapperClasses: '',
		multiselect: false,
		chipList: [],
		onChipRemove() {},
	};

	constructor(props) {
		super(props);
		this.state = {
			isOpen: false,
			highlightedIndex: null,
		};
		this._debugStates = [];
		this.ensureHighlightedIndex = this.ensureHighlightedIndex.bind(this);
		this.exposeAPI = this.exposeAPI.bind(this);
		this.handleInputFocus = this.handleInputFocus.bind(this);
		this.handleInputBlur = this.handleInputBlur.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleInputClick = this.handleInputClick.bind(this);
		this.maybeAutoCompleteText = this.maybeAutoCompleteText.bind(this);

		// Generate an HTML ID if one was not provided
		this.id = this.props.id || uniqueIdForComponent();
	}

	/* eslint-disable react/no-deprecated */
	componentWillMount() {
		this._ignoreBlur = false;
		this._ignoreFocus = false;
		this._scrollOffset = null;
		this._scrollTimer = null;
	}

	componentWillUnmount() {
		clearTimeout(this._scrollTimer);
		this._scrollTimer = null;
	}

	/* eslint-disable react/no-deprecated */
	componentWillReceiveProps(nextProps) {
		if (this.state.highlightedIndex !== null) {
			this.setState(this.ensureHighlightedIndex);
		}
		if (
			nextProps.autoHighlight &&
			(this.props.value !== nextProps.value ||
				this.state.highlightedIndex === null)
		) {
			this.setState(this.maybeAutoCompleteText);
		}
	}

	componentDidMount() {
		if (this.isOpen()) {
			this.setMenuPositions();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			(this.state.isOpen && !prevState.isOpen) ||
			('open' in this.props && this.props.open && !prevProps.open)
		) {
			this.setMenuPositions();
		}

		if (prevState.isOpen !== this.state.isOpen) {
			this.props.onMenuVisibilityChange(this.state.isOpen);
			if (this.state.isOpen && this.getFilteredItems(this.props).length > 0) {
				this._internalTrackInputChange();
			}
		}
	}

	exposeAPI(el) {
		this.input = el;
		IMPERATIVE_API.forEach(
			(ev) => (this[ev] = el && el[ev] && el[ev].bind(el))
		);
	}

	handleKeyDown(event) {
		if (Autocomplete.keyDownHandlers[event.key])
			Autocomplete.keyDownHandlers[event.key].call(this, event);
		else if (!this.isOpen()) {
			this.setState({
				isOpen: true,
			});
		}
	}

	/**
	 * Shared change handler for field tracking
	 */
	_internalTrackInputChange() {
		const inputActionProps = {
			formName: SEARCH_FORM_ID,
			id: this.props.id,
		};

		this.props.trackFormInputChange(inputActionProps);
	}

	handleChange(event) {
		this.props.onChange(event, event.target.value);
		this._internalTrackInputChange(event);
	}

	static keyDownHandlers = {
		ArrowDown(event) {
			event.preventDefault();
			const items = this.getFilteredItems(this.props);
			if (!items.length) return;
			const { highlightedIndex } = this.state;
			let index = highlightedIndex === null ? -1 : highlightedIndex;
			for (let i = 0; i < items.length; i++) {
				const p = (index + i + 1) % items.length;
				if (this.props.isItemSelectable(items[p])) {
					index = p;
					break;
				}
			}
			if (index > -1 && index !== highlightedIndex) {
				this.setState({
					highlightedIndex: index,
					isOpen: true,
				});
			}
		},

		ArrowUp(event) {
			event.preventDefault();
			const items = this.getFilteredItems(this.props);
			if (!items.length) return;
			const { highlightedIndex } = this.state;
			let index = highlightedIndex === null ? items.length : highlightedIndex;
			for (let i = 0; i < items.length; i++) {
				const p = (index - (1 + i) + items.length) % items.length;
				if (this.props.isItemSelectable(items[p])) {
					index = p;
					break;
				}
			}
			if (index !== items.length) {
				this.setState({
					highlightedIndex: index,
					isOpen: true,
				});
			}
		},

		Enter(event) {
			// Key code 229 is used for selecting items from character selectors (Pinyin, Kana, etc)
			if (event.keyCode !== 13) return;
			// In case the user is currently hovering over the menu
			this.setIgnoreBlur(false);
			if (!this.isOpen()) {
				// menu is closed so there is no selection to accept -> do nothing
				return null;
			} else if (this.state.highlightedIndex == null) {
				// input has focus but no menu item is selected + enter is hit -> close the menu, highlight whatever is in input
				this.setState(
					{
						isOpen: false,
					},
					() => {
						this.input.select();
					}
				);
			} else {
				// text entered + menu item has been highlighted + enter is hit -> update value to that of selected menu item, close the menu
				event.preventDefault();
				const item = this.getFilteredItems(this.props)[
					this.state.highlightedIndex
				];
				const value = this.props.getItemValue(item);
				this.setState(
					{
						isOpen: false,
						highlightedIndex: null,
					},
					() => {
						this.input.setSelectionRange(value.length, value.length);
						this.props.onSelect(value, item);
					}
				);
			}
		},

		Escape() {
			// In case the user is currently hovering over the menu
			this.setIgnoreBlur(false);
			this.setState({
				highlightedIndex: null,
				isOpen: false,
			});
		},

		Tab() {
			// In case the user is currently hovering over the menu
			this.setIgnoreBlur(false);
		},
	};

	getFilteredItems(props) {
		let items = props.items;

		if (props.shouldItemRender) {
			items = items.filter((item) => props.shouldItemRender(item, props.value));
		}

		if (props.sortItems) {
			items.sort((a, b) => props.sortItems(a, b, props.value));
		}

		return items;
	}

	maybeAutoCompleteText(state, props) {
		const { highlightedIndex } = state;
		const { value, getItemValue } = props;
		let index = highlightedIndex === null ? 0 : highlightedIndex;
		let items = this.getFilteredItems(props);
		for (let i = 0; i < items.length; i++) {
			if (props.isItemSelectable(items[index])) break;
			index = (index + 1) % items.length;
		}
		const matchedItem =
			items[index] && props.isItemSelectable(items[index])
				? items[index]
				: null;
		if (value !== '' && matchedItem) {
			const itemValue = getItemValue(matchedItem);
			const itemValueDoesMatch =
				itemValue.toLowerCase().indexOf(value.toLowerCase()) === 0;
			if (itemValueDoesMatch) {
				return { highlightedIndex: index };
			}
		}
		return { highlightedIndex: null };
	}

	ensureHighlightedIndex(state, props) {
		if (state.highlightedIndex >= this.getFilteredItems(props).length) {
			return { highlightedIndex: null };
		}
	}

	setMenuPositions() {
		const node = this.input;
		const rect = node.getBoundingClientRect();
		const computedStyle = global.window.getComputedStyle(node);
		const marginBottom = parseInt(computedStyle.marginBottom, 10) || 0;
		const marginLeft = parseInt(computedStyle.marginLeft, 10) || 0;
		const marginRight = parseInt(computedStyle.marginRight, 10) || 0;
		this.setState({
			menuTop: rect.bottom + marginBottom,
			menuLeft: rect.left + marginLeft,
			menuWidth: rect.width + marginLeft + marginRight,
		});
	}

	highlightItemFromMouse(index) {
		this.setState({ highlightedIndex: index });
	}

	selectItemFromMouse(item) {
		const value = this.props.getItemValue(item);
		// The menu will de-render before a mouseLeave event
		// happens. Clear the flag to release control over focus
		this.setIgnoreBlur(false);
		this.setState(
			{
				isOpen: false,
				highlightedIndex: null,
			},
			() => {
				this.props.onSelect(value, item);
			}
		);
	}

	setIgnoreBlur(ignore) {
		this._ignoreBlur = ignore;
	}

	renderChips() {
		return (
			<>
				{this.props.chipList.map((chip, idx) => (
					<RemovableTag
						key={idx}
						label={chip.name}
						onRemove={this.props.onChipRemove}
					/>
				))}
			</>
		);
	}

	renderMenu() {
		const items = this.getFilteredItems(this.props).map((item, index) => {
			const element = this.props.renderItem(
				item,
				this.state.highlightedIndex === index,
				{ cursor: 'default' }
			);
			return React.cloneElement(element, {
				onMouseEnter: this.props.isItemSelectable(item)
					? () => this.highlightItemFromMouse(index)
					: null,
				onClick: this.props.isItemSelectable(item)
					? () => this.selectItemFromMouse(item)
					: null,
				ref: (e) => (this[`item-${index}`] = e),
			});
		});
		const style = {
			left: this.state.menuLeft,
			top: this.state.menuTop,
			minWidth: this.state.menuWidth,
		};
		const menu = this.props.renderMenu(
			items,
			this.props.value,
			style,
			this.props.menuClass
		);
		return React.cloneElement(menu, {
			ref: (e) => (this.menu = e),
			// Ignore blur to prevent menu from de-rendering before we can process click
			onTouchStart: () => this.setIgnoreBlur(true),
			onMouseEnter: () => this.setIgnoreBlur(true),
			onMouseLeave: () => this.setIgnoreBlur(false),
		});
	}

	handleInputBlur(event) {
		if (this._ignoreBlur) {
			this._ignoreFocus = true;
			this._scrollOffset = getScrollOffset();
			this.input.focus();
			return;
		}
		let setStateCallback;
		const { highlightedIndex } = this.state;
		if (this.props.selectOnBlur && highlightedIndex !== null) {
			const items = this.getFilteredItems(this.props);
			const item = items[highlightedIndex];
			const value = this.props.getItemValue(item);
			setStateCallback = () => this.props.onSelect(value, item);
		}
		this.setState(
			{
				isOpen: false,
				highlightedIndex: null,
			},
			setStateCallback
		);

		if (this.props.inputProps.onBlur) {
			this.props.inputProps.onBlur(event);
		}
	}

	handleInputFocus(event) {
		if (this._ignoreFocus) {
			this._ignoreFocus = false;
			const { x, y } = this._scrollOffset;
			this._scrollOffset = null;
			// Focus will cause the browser to scroll the <input> into view.
			// This can cause the mouse coords to change, which in turn
			// could cause a new highlight to happen, cancelling the click
			// event (when selecting with the mouse)
			window.scrollTo(x, y);
			// Some browsers wait until all focus event handlers have been
			// processed before scrolling the <input> into view, so let's
			// scroll again on the next tick to ensure we're back to where
			// the user was before focus was lost. We could do the deferred
			// scroll only, but that causes a jarring split second jump in
			// some browsers that scroll before the focus event handlers
			// are triggered.
			clearTimeout(this._scrollTimer);
			this._scrollTimer = setTimeout(() => {
				this._scrollTimer = null;
				window.scrollTo(x, y);
			}, 0);
			return;
		}
		this.setState({ isOpen: true });

		if (this.props.inputProps.onFocus) {
			this.props.inputProps.onFocus(event);
		}
	}

	isInputFocused() {
		const el = this.input;
		return el.ownerDocument && el === el.ownerDocument.activeElement;
	}

	handleInputClick() {
		// Input will not be focused if it's disabled
		if (this.isInputFocused()) {
			this.setState({ isOpen: true });
		}
	}

	composeEventHandlers(internal, external) {
		return external
			? (e) => {
					internal(e);
					external(e);
			  }
			: internal;
	}

	isOpen() {
		return 'open' in this.props ? this.props.open : this.state.isOpen;
	}

	render() {
		if (this.props.debug) {
			// you don't like it, you love it
			this._debugStates.push({
				id: this._debugStates.length,
				state: this.state,
			});
		}

		const { inputProps } = this.props;
		const open = this.isOpen();

		const ariaLabel = this.props.labelHidden
			? { 'aria-label': this.props.label }
			: {};

		return (
			<>
				<div
					ref={(node) => (this.node = node)}
					id={this.id + '-autocomplete-wrapper'}
					className={`cts-autocomplete ${this.props.wrapperClasses}`}
					{...this.props.wrapperProps}>
					{this.props.labelHidden ? null : (
						<InputLabel
							label={this.props.label}
							labelHint={this.props.labelHint}
							htmlFor={this.id}
						/>
					)}
					<div
						className={`${this.props.multiselect ? 'cts-chip-list' : ''} ${
							this.props.modified ? 'cts-chip-list--modified' : ''
						}`}>
						{this.props.multiselect && this.renderChips()}
						{this.props.renderInput({
							...inputProps,
							...ariaLabel,
							id: this.id,
							role: 'combobox',
							'aria-autocomplete': 'list',
							'aria-expanded': open,
							autoComplete: 'off',
							ref: this.exposeAPI,
							className:
								'cts-input cts-autocomplete__input ' + this.props.inputClasses,
							onFocus: this.handleInputFocus,
							onBlur: this.handleInputBlur,
							onChange: this.handleChange.bind(this),
							onInput: this._internalTrackInputChange.bind(this),
							onKeyDown: this.composeEventHandlers(
								this.handleKeyDown,
								inputProps.onKeyDown
							),
							onClick: this.composeEventHandlers(
								this.handleInputClick,
								inputProps.onClick
							),
							type: 'text',
							value: this.props.value,
						})}
					</div>
					<div className="menu-anchor">{open && this.renderMenu()}</div>

					{this.props.debug && (
						<pre style={{ marginLeft: 300 }}>
							{JSON.stringify(
								this._debugStates.slice(
									Math.max(0, this._debugStates.length - 5),
									this._debugStates.length
								),
								null,
								2
							)}
						</pre>
					)}
					{this.props.inputHelpText && (
						<span className="cts-input__help-text">
							{this.props.inputHelpText}
						</span>
					)}
				</div>
			</>
		);
	}
}

const mapDispatchToProps = {
	trackFormInputChange,
};

export default connect(null, mapDispatchToProps)(Autocomplete);
