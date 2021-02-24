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
	// Ensure range for page neighbours is within specified boundaries (0 to 3)
	currentPageNeighbours = Math.max(
		0,
		Math.min(currentPageNeighbours, currentPageNeighboursMax)
	);
	const maxNumberedPagerItems = 5;
	const pageCount = Math.ceil(totalResults / resultsPerPage);

	// Set default current page number to 1 if less than 1,
	// or supplied page greater than pageCount
	const currentPage = current < 1 || current > pageCount ? 1 : current;

	const getOffset = (page) => {
		return page * resultsPerPage - resultsPerPage;
	};

	const pageNavigationChangeHandler = (pageNumber) => {
		const offset = getOffset(pageNumber);
		const pager = { offset, page: pageNumber, pageUnit: resultsPerPage };
		onPageNavigationChange(pager);
	};

	const buildNavigation = () => {
		const pagerBar = [];

		for (let index = 0; index < pageCount; index++) {
			const pageNumber = index + 1;
			let showLeftNeighbour = false;
			let showRightNeighbour = false;

			// Show all pages as long as number of pages is less than or equal to 5
			const showAll = pageCount <= maxNumberedPagerItems;

			if (currentPageNeighbours !== 0) {
				showLeftNeighbour =
					Math.max(
						1,
						Math.min(currentPage - pageNumber, currentPageNeighbours)
					) +
						pageNumber ===
					currentPage;

				showRightNeighbour =
					pageNumber -
						Math.max(
							1,
							Math.min(pageNumber - currentPage, currentPageNeighbours)
						) ===
					currentPage;
			}

			// Only show left ellipsis for page number
			// when current page is greater than or equal to 5 [currentPage >= maxNumberedPagerItems]
			const showLeftEllipsis =
				(currentPage >= maxNumberedPagerItems ||
					currentPage - firstPage - currentPageNeighbours === pageNumber) &&
				pageNumber === firstPage + 1 &&
				!showAll;

			// Show right ellipsis
			// when total number of pages is greater than 5 [pageCount > maxNumberedPagerItems]
			// and when page number is not a right neighbour [!showRightNeighbour]
			const showRightEllipsis =
				pageCount > maxNumberedPagerItems &&
				pageNumber === pageCount - 1 &&
				!showRightNeighbour &&
				currentPage !== pageCount &&
				!showAll;

			// Always show first and last pages
			const showFirstAndLastPage =
				pageNumber === firstPage || pageNumber === pageCount;

			// Always show currently active page
			const isCurrentlyActivePage = currentPage === pageNumber;

			let pagerItem;

			if (
				showAll ||
				showFirstAndLastPage ||
				isCurrentlyActivePage ||
				showLeftNeighbour ||
				showRightNeighbour
			) {
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
			} else if (showLeftEllipsis) {
				pagerItem = (
					<li key="left-ellipsis" className="pager__ellipsis--left">
						...
					</li>
				);
			} else if (showRightEllipsis) {
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
