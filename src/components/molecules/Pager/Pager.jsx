import PropTypes from 'prop-types';
import React from 'react';

import img from '@nciocpl/ncids-css/uswds-img/sprite.svg';

const Pager = ({ current = 1, currentPageNeighbours = 2, nextLabel = 'Next', onPageNavigationChange, previousLabel = 'Previous', resultsPerPage = 25, totalResults }) => {
	// Max number of neighbours is set to 3
	const currentPageNeighboursMax = 1;
	const firstPage = 1;
	// Ensure range for page neighbours is within specified boundaries (0 to 3)
	currentPageNeighbours = Math.max(0, Math.min(currentPageNeighbours, currentPageNeighboursMax));
	const maxNumberedPagerItems = 5;
	const pageCount = Math.ceil(totalResults / resultsPerPage);

	// Set default current page number to 1 if less than 1,
	// or supplied page greater than pageCount
	const currentPage = current < 1 || current > pageCount ? 1 : current;

	/**
	 * @param{number} page - A given page number
	 */
	const getOffset = (page) => {
		return page * resultsPerPage - resultsPerPage;
	};

	/**
	 * @param{number} pageNumber - The new page number to navigate to.
	 */
	const pageNavigationChangeHandler = (pageNumber) => {
		const offset = getOffset(pageNumber);
		const pager = { offset, page: pageNumber, pageUnit: resultsPerPage };
		onPageNavigationChange(pager);
	};

	const buildNavigation = () => {
		const handleClick = (e, pageNumber) => {
			e.preventDefault();
			pageNavigationChangeHandler(pageNumber);
		};

		const pagerBar = [];
		// Iterate over the page number to either render or elide
		for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
			// Show all pages as long as total number of pages is less than or equal to max (e.g:5)
			const showAll = pageCount <= maxNumberedPagerItems;
			// Determine if this page number is a neighbor that should render
			// i.e. Is the page number within allowable distance of the active page
			let isNeighbor = false;
			if (currentPageNeighbours !== 0) {
				const pageDistance = Math.abs(currentPage - pageNumber);
				isNeighbor = pageDistance <= currentPageNeighbours;
			}
			// The active page will always be displayed
			const isCurrentlyActivePage = currentPage === pageNumber;
			// The first and last pages will always be displayed
			const isFirstORLastPage = pageNumber === firstPage || pageNumber === pageCount;

			// Is the given pageNumber in the position to be replaced by the ellipses if renderable
			// (i.e. in the 2nd position or 2nd to last position)
			const isEllipsisPosition = pageNumber === 2 || pageNumber === pageCount - 1;

			// This page number is visible if any of the conditions are met
			const isNumberVisible = showAll || isFirstORLastPage || isCurrentlyActivePage || isNeighbor;

			// Determine whether to display left ellipsis instead of page number
			const isLeftEllipsis = isEllipsisPosition && !isNumberVisible && pageNumber < currentPage;

			// Determine whether to display right ellipsis instead of page number
			const isRightEllipsis = isEllipsisPosition && !isNumberVisible && pageNumber > currentPage;

			let pagerItem;

			if (isNumberVisible) {
				pagerItem = (
					<li className="usa-pagination__item usa-pagination__page-no" key={`page-${pageNumber}`}>
						{/* eslint-disable-next-line */}
						<a href="#" className={`usa-pagination__button${pageNumber === currentPage ? ' usa-current' : ''}`} onClick={(e) => handleClick(e, pageNumber)} aria-label={`Page ${pageNumber}`}>
							{pageNumber}
						</a>
					</li>
				);
			} else if (isLeftEllipsis) {
				pagerItem = (
					<li key="left-ellipsis" className="usa-pagination__item usa-pagination__overflow ellipsis--left" aria-label="Ellipsis indicating non-visible page">
						...
					</li>
				);
			} else if (isRightEllipsis) {
				pagerItem = (
					<li key="right-ellipsis" className="usa-pagination__item usa-pagination__overflow ellipsis--right" aria-label="Ellipsis indicating non-visible page">
						...
					</li>
				);
			}

			pagerBar.push(pagerItem);
		}

		const previousPager = (
			<li className="usa-pagination__item usa-pagination__arrow" key={previousLabel}>
				{/* eslint-disable-next-line */}
				<a href="#" className={`usa-pagination__link usa-pagination__previous-page${currentPage === 1 ? ' hidden' : ''}`} onClick={(e) => {
						e.preventDefault();
						pageNavigationChangeHandler(currentPage - 1);
					}}
					role="button"
					aria-hidden={currentPage === 1}
					aria-label="Previous page">
					<svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
						<use href={img + '#navigate_before'} />
					</svg>
					<span className="usa-pagination__link-text">{previousLabel}</span>
				</a>
			</li>
		);
		const nextPager = (
			<li className="usa-pagination__item usa-pagination__arrow" key={nextLabel}>
				{/* eslint-disable-next-line */}
				<a href="#" className={`usa-pagination__link usa-pagination__next-page${currentPage === pageCount ? ' hidden' : ''}`} onClick={(e) => {
						e.preventDefault();
						pageNavigationChangeHandler(currentPage + 1);
					}}
					role="button"
					aria-hidden={currentPage === pageCount}
					aria-label="Next page">
					<span className="usa-pagination__link-text">{nextLabel}</span>
					<svg className="usa-icon" aria-hidden="true" focusable="false" role="img">
						<use href={img + '#navigate_next'} />
					</svg>
				</a>
			</li>
		);
		pagerBar.unshift(previousPager);
		pagerBar.push(nextPager);
		return pagerBar;
	};

	return (
		<>
			{totalResults > resultsPerPage && (
				<nav className="usa-pagination" aria-label="Pagination">
					<ul className="usa-pagination__list">{buildNavigation().map((nav) => nav)}</ul>
				</nav>
			)}
		</>
	);
};

Pager.propTypes = {
	/**
	 * Currently active page. Defaults to 1 if none is supplied.
	 */
	current: PropTypes.number,

	/**
	 * Number of page items to show on the left and right side of current page.
	 * Range is from 0 - 3. Default is set to 2.
	 */
	currentPageNeighbours: PropTypes.number,

	/**
	 * Label for next button
	 */
	nextLabel: PropTypes.string,

	/**
	 * Handler to be called when the page navigation item is clicked
	 */
	onPageNavigationChange: PropTypes.func.isRequired,

	/**
	 * Label for previous button
	 */
	previousLabel: PropTypes.string,

	/**
	 * Number of results to be displayed per page
	 */
	resultsPerPage: PropTypes.number,

	/**
	 * Total number of results to be paginated
	 */
	totalResults: PropTypes.number.isRequired,
};

export default Pager;
