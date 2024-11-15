import PropTypes from 'prop-types';
import React from 'react';

const Pager = ({
	current = 1,
	currentPageNeighbours = 2,
	nextLabel = 'Next >',
	onPageNavigationChange,
	previousLabel = '< Previous',
	resultsPerPage = 25,
	totalResults,
}) => {
	// Max number of neighbours is set to 3
	const currentPageNeighboursMax = 3;
	const firstPage = 1;
	// Ensure range for page neighbours is within specified boundaries (0 to 4)
	currentPageNeighbours = Math.max(
		0,
		Math.min(currentPageNeighbours, currentPageNeighboursMax)
	);
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
			const isFirstORLastPage =
				pageNumber === firstPage || pageNumber === pageCount;

			// Is the given pageNumber in the position to be replaced by the ellipses if renderable
			// (i.e. in the 2nd position or 2nd to last position)
			const isEllipsisPosition =
				pageNumber === 2 || pageNumber === pageCount - 1;

			// This page number is visible if any of the conditions are met
			const isNumberVisible =
				showAll || isFirstORLastPage || isCurrentlyActivePage || isNeighbor;

			// Determine whether to display left ellipsis instead of page number
			const isLeftEllipsis =
				isEllipsisPosition && !isNumberVisible && pageNumber < currentPage;

			//Determine whether to display right ellipsis instead of page number
			const isRightEllipsis =
				isEllipsisPosition && !isNumberVisible && pageNumber > currentPage;

			let pagerItem;

			if (isNumberVisible) {
				pagerItem = (
					<li className="pager__list-item" key={`page-${pageNumber}`}>
						<button
							className={`pager__button${
								pageNumber === currentPage ? ' active' : ''
							}`}
							onClick={() => pageNavigationChangeHandler(pageNumber)}
							aria-label={`page ${pageNumber}`}>
							{pageNumber}
						</button>
					</li>
				);
			} else if (isLeftEllipsis) {
				pagerItem = (
					<li key="left-ellipsis" className="pager__ellipsis--left">
						...
					</li>
				);
			} else if (isRightEllipsis) {
				pagerItem = (
					<li key="right-ellipsis" className="pager__ellipsis--right">
						...
					</li>
				);
			}

			pagerBar.push(pagerItem);
		}

		const previousPager = (
			<li key={previousLabel}>
				<button
					className={`pager__button pager__previous${
						currentPage === 1 ? ' hidden' : ''
					}`}
					onClick={() => pageNavigationChangeHandler(currentPage - 1)}
					aria-hidden={currentPage === 1}
					aria-label="previous page">
					{previousLabel}
				</button>
			</li>
		);
		const nextPager = (
			<li key={nextLabel}>
				<button
					className={`pager__button pager__next${
						currentPage === pageCount ? ' hidden' : ''
					}`}
					onClick={() => pageNavigationChangeHandler(currentPage + 1)}
					aria-hidden={currentPage === pageCount}
					aria-label="next page">
					{nextLabel}
				</button>
			</li>
		);
		pagerBar.unshift(previousPager);
		pagerBar.push(nextPager);
		return pagerBar;
	};

	return (
		<>
			{totalResults > resultsPerPage && (
				<nav className="pager__container" aria-label="pager navigation">
					<ol className="pager__navigation">
						{buildNavigation().map((nav) => nav)}
					</ol>
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
