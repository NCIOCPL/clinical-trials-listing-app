import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import './pagination.scss';

const Pagination = ({
	current = 1,
	nextLabel = 'Next >',
	onPageNavigationChange,
	previousLabel = '< Previous',
	resultsPerPage = 25,
	totalResults,
}) => {
	const [currentPage, setCurrentPage] = useState(current);

	useEffect(() => {
		const offset = currentPage * resultsPerPage - resultsPerPage;
		const pagination = { offset, page: currentPage, pageUnit: resultsPerPage };
		onPageNavigationChange(pagination);
	}, [currentPage]);

	const pageNavigationChangeHandler = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	const buildNavigation = () => {
		const pageCount = Math.ceil(totalResults / resultsPerPage);
		const paginationBar = [];

		for (let index = 0; index < pageCount; index++) {
			const pageNumber = index + 1;
			paginationBar.push(
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
		}

		const previousPager = (
			<li key={previousLabel}>
				<button
					className={`pager__button pager__previous${
						currentPage === 1 ? ' hidden' : ''
					}`}
					onClick={() => pageNavigationChangeHandler(currentPage - 1)}
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
					aria-label="next page">
					{nextLabel}
				</button>
			</li>
		);
		paginationBar.unshift(previousPager);
		paginationBar.push(nextPager);
		return paginationBar;
	};

	return (
		<>
			{totalResults > resultsPerPage && (
				<nav className="pager__container" aria-label="pagination navigation">
					<ol className="pager__navigation">
						{buildNavigation().map((nav) => nav)}
					</ol>
				</nav>
			)}
		</>
	);
};

Pagination.propTypes = {
	/**
	 * Currently active page
	 */
	current: PropTypes.number,

	/**
	 * Function that handles building of the href
	 */
	hrefLinkBuilder: PropTypes.func,

	/**
	 * Label for next button
	 */
	nextLabel: PropTypes.string,

	/**
	 * Handler to be called when the page navigation item is clicked
	 */
	onPageNavigationChange: PropTypes.func.isRequired,

	/**
	 * Currently active page number
	 */
	page: PropTypes.number,

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

export default Pagination;
