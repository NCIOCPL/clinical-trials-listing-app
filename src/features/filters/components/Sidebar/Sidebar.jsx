/* eslint-disable */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFilters } from '../../context/FilterContext/FilterContext';
import ZipCodeFilter from '../ZipCodeFilter';
import AgeFilter from '../AgeFilter/AgeFilter';
import { FILTER_CONFIG } from '../../config/filterConfig';
import { FilterActionTypes } from '../../context/FilterContext/FilterContext';
import { PAGE_FILTER_CONFIGS } from '../../config/pageFilterConfigs';
import './Sidebar.scss';

/**
 * Sidebar component that handles filters for clinical trials search
 * @param {Object} props
 * @param {string} [props.pageType="Disease"] - Type of page determining available filters
 */
const Sidebar = ({ pageType = "Disease" }) => {
  // Hooks
  const navigate = useNavigate();
  const { state, dispatch, applyFilters, enabledFilters = [] } = useFilters();
  const { filters, isDirty } = state;

  /**
   * Handles age filter value changes
   * @param {Event} e - Change event from age input
   */
  const handleAgeFilterChange = (e) => {
    const value = e.target.value;
    if (value >= FILTER_CONFIG.age.min && value <= FILTER_CONFIG.age.max) {
      dispatch({
        type: FilterActionTypes.SET_FILTER,
        payload: {
          filterType: 'age',
          value: value
        }
      });
    }
  };

  /**
   * Handles zip code filter value changes
   * @param {Event} e - Change event from zip code input
   */
  const handleZipCodeChange = (e) => {
    dispatch({
      type: FilterActionTypes.SET_FILTER,
      payload: {
        filterType: 'location',
        value: {
          ...filters.location,
          zipCode: e.target.value,
          radius: e.target.value ? (filters.location.radius || '100') : null
        }
      }
    });
  };

  /**
   * Handles radius filter value changes
   * @param {Event} e - Change event from radius select
   */
  const handleRadiusChange = (e) => {
    dispatch({
      type: FilterActionTypes.SET_FILTER,
      payload: {
        filterType: 'location',
        value: {
          ...filters.location,
          radius: e.target.value
        }
      }
    });
  };

  /**
   * Clears all active filters
   */
  const handleClearFilters = () => {
    dispatch({ type: FilterActionTypes.CLEAR_FILTERS });
    dispatch({ type: FilterActionTypes.APPLY_FILTERS });
  };

  /**
   * Applies current filter state and updates URL
   */
  const handleApplyFilters = async () => {
    if (isDirty) {
      await applyFilters();
      const params = new URLSearchParams(window.location.search);

      if (filters.age) {
        params.set('age', filters.age);
      } else {
        params.delete('age');
      }

      params.set('pn', '1');
      navigate(`${window.location.pathname}?${params.toString()}`);
    }
  };

  /**
   * Renders appropriate filter component based on filter type
   * @param {string} filterType - Type of filter to render
   * @returns {React.ReactElement|null}
   */
  const renderFilter = (filterType) => {
    switch(filterType) {
      case 'age':
        return (
          <AgeFilter
            value={filters.age}
            onChange={handleAgeFilterChange}
          />
        );
      case 'location':
        return (
          <ZipCodeFilter
            zipCode={filters.location.zipCode}
            radius={filters.location.radius}
            onZipCodeChange={handleZipCodeChange}
            onRadiusChange={handleRadiusChange}
          />
        );
      default:
        return null;
    }
  };

  /**
   * Handles mobile accordion toggle
   */
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

  /**
   * Sets up mobile responsive behavior
   */
  const setMobileOnClick = () => {
    const mobileSize = '(max-width: 1028px)';
    const mediaQueryMobile = window.matchMedia(mobileSize);
    const filterBtn = document.getElementById('filterButton');
    var content = document.getElementById("accordionContent");

    function handleMediaQueryChange(event) {
      if (event.matches) {
        filterBtn.addEventListener('click', accordionOnClick);
      } else {
        filterBtn.removeEventListener('click', accordionOnClick);
        content.removeAttribute("hidden");
      }
    }

    handleMediaQueryChange(mediaQueryMobile);
    mediaQueryMobile.addEventListener('change', handleMediaQueryChange);
  };

	const hasActiveFilters = () => {
		// This can be an array or not depending on if were using grouped ages.
		const hasAgeFilter = Array.isArray(filters.age)
			? filters.age.some(age => age !== '')
			: filters.age && filters.age !== '';

		const hasLocationFilter = Boolean(filters.location?.zipCode);

		return hasAgeFilter || hasLocationFilter;

	};

  // Load filters from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const age = params.get('age');

    if (age) {
      dispatch({
        type: FilterActionTypes.SET_FILTER,
        payload: {
          filterType: 'age',
          value: age
        }
      });
      dispatch({ type: FilterActionTypes.APPLY_FILTERS });
    }
  }, []);

  // Validation checks
  if (!pageType || !PAGE_FILTER_CONFIGS[pageType]) {
    console.error('Invalid pageType:', pageType);
    return null;
  }

  return (
    <aside className="ctla-sidebar">
      <div className="usa-accordion ctla-sidebar__header">
        <h2 className="usa-accordion__heading ctla-sidebar__title">
          <button id="filterButton" type="button" className="usa-accordion__button" aria-expanded="true" aria-controls="accordionContent" onClick={setMobileOnClick}>
            Filter Your Search
          </button>
        </h2>
      </div>
      <div id="accordionContent" className="usa-accordion__content ctla-sidebar__content">
        {console.log('pageType', pageType)}
        {console.log('enabledFilters', enabledFilters)}
        {PAGE_FILTER_CONFIGS[pageType].order.map(filterType => {
          if (enabledFilters.includes(filterType)) {
            return (
              <div key={filterType}>
                {renderFilter(filterType)}
              </div>
            );
          }
          return null;
        })}
        <div className="ctla-sidebar__actions">
          <button className="usa-button ctla-sidebar__button--clear" onClick={handleClearFilters} disabled={!hasActiveFilters()}>
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
