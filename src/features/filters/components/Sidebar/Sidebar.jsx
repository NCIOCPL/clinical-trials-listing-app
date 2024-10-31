import React from 'react';
import { useFilters } from '../../context/FilterContext/FilterContext';
import FilterGroup from '../FilterGroup';
import CheckboxGroup from '../CheckboxGroup';
import './Sidebar.scss';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { FilterActionTypes } from '../../context/FilterContext/FilterContext';

const Sidebar = () => {
	const { state, dispatch } = useFilters();
	const { filters, isDirty } = state;

	const handleAgeFilterChange = (values) => {
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'age',
				value: values,
			},
		});
	};

	const handleZipCodeChange = (e) => {
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					zipCode: e.target.value,
				},
			},
		});
	};

	const handleRadiusChange = (e) => {
		dispatch({
			type: 'SET_FILTER',
			payload: {
				filterType: 'location',
				value: {
					...filters.location,
					radius: e.target.value,
				},
			},
		});
	};

	const handleClearFilters = () => {
		dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
	};

	const handleApplyFilters = () => {
		dispatch({ type: FilterActionTypes.APPLY_FILTERS });
	};

	const accordionOnClick = () => {
		var filterBtn = document.getElementById('filterButton');
		var content = document.getElementById('accordionContent');

		if (content.hidden == true) {
			filterBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="2" viewBox="0 0 14 2" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 2H0V0H14V2Z" fill="%231B1B1B"/></svg>')`;
			content.hidden = false;
		} else {
			filterBtn.style.backgroundImage = `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 8H8V14H6V8H0V6H6V0H8V6H14V8Z" fill="%231B1B1B"/></svg>')`;
			content.hidden = true;
		}
	};

	// function setMobileOnClick() {
	// 	const mobileSize = '(max-width: 768px)';
	// 	const mediaQueryMobile = window.matchMedia(mobileSize);
	// 	const filterBtn = document.getElementById('filterButton');
	// 	var content = document.getElementById("accordionContent");

	// 	function handleMediaQueryChange(event) {
	// 		if (event.matches) {
	// 			filterBtn.addEventListener('click', accordionOnClick);
	// 		} else {
	// 			filterBtn.removeEventListener('click', accordionOnClick);
	// 			content.removeAttribute("hidden");
	// 		}
	// 	}

	// 	handleMediaQueryChange(mediaQueryMobile);
	// 	mediaQueryMobile.addEventListener('change', handleMediaQueryChange);

	// }

	return (
		<aside className="ctla-sidebar">
			<div className="usa-accordion ctla-sidebar__header">
				<h2 className="usa-accordion__heading ctla-sidebar__title">
					<button id="filterButton" type="button" className="usa-accordion__button" aria-expanded="true" aria-controls="accordionContent" onClick={accordionOnClick}>
						Filter Your Search
					</button>
				</h2>
			</div>
			<div id="accordionContent" className="usa-accordion__content ctla-sidebar__content">
				<FilterGroup title="Age">
					<CheckboxGroup name="age" selectedValues={filters.age} onChange={handleAgeFilterChange} />
				</FilterGroup>

				<FilterGroup title="Location by Zip Code">
					<input type="text" className="usa-input form-control" placeholder="Enter U.S. Zip Code" value={filters.location.zipCode} onChange={handleZipCodeChange} maxLength={5} />
				</FilterGroup>

				<FilterGroup title={FILTER_CONFIG.radius.title}>
					<div className="usa-combo-box">
						<select className="usa-select usa-combo-box__select form-control" value={filters.location.radius || ''} onChange={handleRadiusChange} disabled={!filters.location.zipCode}>
							<option value="">Select</option>
							{FILTER_CONFIG.radius.options.map((option) => (
								<option key={option.id} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</FilterGroup>

				<div className="ctla-sidebar__actions">
					<button className="usa-button ctla-sidebar__button--clear" onClick={handleClearFilters} disabled={!isDirty && !filters.age.length}>
						Clear All
					</button>
					<button className="usa-button ctla-sidebar__button--apply" onClick={handleApplyFilters} disabled={!isDirty}>
						Apply Filters
					</button>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
