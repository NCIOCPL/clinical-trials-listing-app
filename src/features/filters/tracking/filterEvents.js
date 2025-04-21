/**
 * @file This file defines constants used for tracking filter-related user interactions
 * for analytics purposes (e.g., Adobe Analytics via react-tracking).
 */

/**
 * Defines the event names sent to the analytics platform for specific filter actions.
 * The naming convention typically follows 'AppName:Feature:Action'.
 */
export const FILTER_EVENTS = {
	MODIFY: 'TrialListingApp:FilterModify', // User modifies a filter value (e.g., types in age, selects subtype)
	START: 'TrialListingApp:FilterStart', // User interacts with any filter control for the first time
	APPLY: 'TrialListingApp:FilterApply', // User clicks the "Apply Filters" button successfully
	APPLY_ERROR: 'TrialListingApp:FilterApplyError', // User clicks "Apply Filters" but there are validation errors
	LINK_CLICK: 'TrialListingApp:FilterLinkClick', // User clicks a link related to filters (e.g., help link - currently unused)
};

/**
 * Defines descriptive strings for the type of interaction that occurred.
 * These are often used in conjunction with FILTER_EVENTS to provide more context.
 */
export const INTERACTION_TYPES = {
	FILTER_REMOVED: 'filter removed', // A single filter tag was removed
	CLEAR_ALL: 'clear all filters', // The "Clear All" button was clicked
	FILTER_START: 'filter start', // Corresponds to FILTER_EVENTS.START
	FILTER_APPLIED: 'filter applied', // Corresponds to FILTER_EVENTS.APPLY
	APPLIED_WITH_ERRORS: 'applied with errors', // Corresponds to FILTER_EVENTS.APPLY_ERROR
	LINK_CLICKED: 'link clicked', // Corresponds to FILTER_EVENTS.LINK_CLICK
};
