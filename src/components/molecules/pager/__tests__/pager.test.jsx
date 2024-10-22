import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Pager from '../pager';

let pageNumber;

describe('<Pager />', () => {
	function onPageNavigationChangeHandler(pagination) {
		const { page } = pagination;
		pageNumber = page;
	}

	const defaultProps = {
		current: pageNumber,
		nextLabel: 'Next',
		previousLabel: 'Previous',
		onPageNavigationChange: onPageNavigationChangeHandler,
		resultsPerPage: 25,
		totalResults: 120,
	};

	it('should display expected pager items with non-required defaults and supplied required props', () => {
		const { onPageNavigationChange } = defaultProps;
		render(<Pager totalResults={250} onPageNavigationChange={onPageNavigationChange} />);

		// There should be 4 visible pager navigation items.
		// 3 for page numbers (first, one right neighbour for default first page, and last page,
		// and 1 for next
		expect(screen.getAllByRole('button')).toHaveLength(1);
		expect(screen.getAllByRole('link', { name: /Page/ })).toHaveLength(3);
	});

	it('should display page 1 as currently active page when current page supplied is 0', () => {
		const { onPageNavigationChange } = defaultProps;
		render(<Pager current={0} totalResults={250} onPageNavigationChange={onPageNavigationChange} />);

		// Page 1 should be currently active page
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass('usa-pagination__button usa-current', { exact: true });
	});

	it('should display page 1 as currently active page when current page supplied exceeds page count', () => {
		const { onPageNavigationChange } = defaultProps;
		render(<Pager current={5000} totalResults={250} onPageNavigationChange={onPageNavigationChange} />);

		// Page 1 should be currently active page
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass('usa-pagination__button usa-current', { exact: true });
	});

	it('should display expected pager items and check currently active page on load and on next button click', () => {
		const { rerender } = render(<Pager {...defaultProps} />);

		// There should be 6 visible pager navigation items. 5 for page numbers, and 1 for next
		// There should be 1 visible button for next page
		expect(screen.getAllByRole('button')).toHaveLength(1);

		// There should be 5 page number items reflecting total page count of 5
		expect(screen.getAllByRole('link', { name: /Page\s\d+/ })).toHaveLength(5);

		// Next pager item should be present
		expect(screen.getByRole('button', { name: 'Next page' })).toHaveTextContent('Next');

		// Page 1 should be currently active page
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveTextContent('1');
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Previous pager item button should be hidden and have expected label
		expect(screen.getAllByRole('button', { hidden: true })[0]).toHaveTextContent('Previous');

		// Navigate to next page with next pager item button
		fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} />);

		// Currently active page now should be page 2
		expect(screen.getByRole('link', { name: 'Page 2' })).toHaveClass('usa-pagination__button usa-current', { exact: true });
	});

	it('should check for default active page passed, ellipsis display and currently active page on previous button click', () => {
		const { rerender } = render(<Pager {...defaultProps} current={5} resultsPerPage={10} totalResults={102} />);

		// Check currently active page is 5 as provided to props
		expect(screen.getByRole('link', { name: 'Page 5' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Check for left and right ellipsis
		// Order matters here. Left ellipsis shows up before the right.
		const ellipsisClasses = ['usa-pagination__item usa-pagination__overflow ellipsis--left', 'usa-pagination__item usa-pagination__overflow ellipsis--right'];
		const ellipsisItems = screen.getAllByText('...');

		for (let i = 0; i < ellipsisItems.length; i++) {
			expect(ellipsisItems[i]).toHaveClass(ellipsisClasses[i]);
		}

		// Click on last page number and confirm next button is hidden
		fireEvent.click(screen.getByRole('link', { name: 'Page 11' }));
		rerender(<Pager {...defaultProps} current={pageNumber} resultsPerPage={10} totalResults={102} />);
		expect(screen.getByRole('link', { name: 'Page 11' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Click on previous and confirm currently active page is 10
		fireEvent.click(screen.getByRole('button', { name: 'Previous page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} resultsPerPage={10} totalResults={102} />);
		expect(screen.getByRole('link', { name: 'Page 10' })).toHaveClass('usa-pagination__button usa-current', { exact: true });
	});

	it('should display correct page neighbours to the left and right of the current page', () => {
		const { rerender } = render(<Pager {...defaultProps} currentPageNeighbours={1} resultsPerPage={10} totalResults={102} />);

		// Page 1 should be currently active page
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Page 2 is right neighbour of 1 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 2' })).toHaveTextContent('2');

		// Page 3 should not be displayed
		expect(screen.queryByRole('link', { name: 'Page 3' })).not.toBeInTheDocument();

		// Navigate to page 2 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} currentPageNeighbours={1} resultsPerPage={10} totalResults={102} />);

		/*
				::: Page 2 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveTextContent('1');

		// Page 2 is currently active page
		expect(screen.getByRole('link', { name: 'Page 2' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Page 3 is right neighbour of 2 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 3' })).toHaveTextContent('3');

		// Page 4 is not displayed
		expect(screen.queryByRole('link', { name: 'Page 4' })).not.toBeInTheDocument();

		// Right ellipsis is displayed
		expect(screen.getByText('...')).toHaveClass('usa-pagination__item usa-pagination__overflow');

		// Last page, page 11 is displayed
		expect(screen.getByRole('link', { name: 'Page 11' })).toHaveTextContent('11');

		// Navigate to page 3 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} currentPageNeighbours={1} resultsPerPage={10} totalResults={102} />);

		/*
				::: Page 3 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveTextContent('1');

		// Page 3 is currently active page
		expect(screen.getByRole('link', { name: 'Page 3' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Page 2 is left neighbour of 3 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 2' })).toHaveTextContent('2');

		// Page 4 is right neighbour of 3 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 4' })).toHaveTextContent('4');

		// Page 5 is not displayed
		expect(screen.queryByRole('link', { name: 'Page 5' })).not.toBeInTheDocument();

		// Left ellipsis is not displayed
		expect(screen.getByText('...')).not.toHaveClass('usa-pagination__item usa-pagination__overflow ellipsis--left');

		// Right ellipsis is displayed
		expect(screen.getByText('...')).toHaveClass('usa-pagination__item usa-pagination__overflow ellipsis--right');

		// Navigate to page 4 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} currentPageNeighbours={1} resultsPerPage={10} totalResults={102} />);

		/*
				::: Page 4 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveTextContent('1');

		// Page 4 is currently active page
		expect(screen.getByRole('link', { name: 'Page 4' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Page 3 is left neighbour of 4 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 3' })).toHaveTextContent('3');

		// Page 5 is right neighbour of 4 and should be displayed
		expect(screen.getByRole('link', { name: 'Page 5' })).toHaveTextContent('5');

		// Page 6 is not displayed
		expect(screen.queryByRole('link', { name: 'Page 6' })).not.toBeInTheDocument();

		// Order matters here. Left ellipsis shows up before the right.
		const ellipsisClasses = ['usa-pagination__item usa-pagination__overflow ellipsis--left', 'usa-pagination__item usa-pagination__overflow ellipsis--right'];
		let ellipsisItems = screen.getAllByText('...');

		// Left and right ellipsis are displayed
		for (let i = 0; i < ellipsisItems.length; i++) {
			expect(ellipsisItems[i]).toHaveClass(ellipsisClasses[i]);
		}

		// Last page, page 11 is displayed
		expect(screen.getByRole('link', { name: 'Page 11' })).toHaveTextContent('11');

		/*
				::: Page 5 (With Page Neighbours as 0) :::
		*/

		rerender(<Pager {...defaultProps} current={5} currentPageNeighbours={0} resultsPerPage={10} totalResults={102} />);

		// Confirm page 1 is displayed
		expect(screen.getByRole('link', { name: 'Page 1' })).toHaveTextContent('1');

		// Page 5 is currently active page
		expect(screen.getByRole('link', { name: 'Page 5' })).toHaveClass('usa-pagination__button usa-current', { exact: true });

		// Page 4 is not displayed as left neighbour
		expect(screen.queryByRole('link', { name: 'Page 4' })).not.toBeInTheDocument();

		// Page 6 is not displayed as right neighbour
		expect(screen.queryByRole('link', { name: 'Page 6' })).not.toBeInTheDocument();

		ellipsisItems = screen.getAllByText('...');

		// Left and right ellipsis are displayed
		for (let i = 0; i < ellipsisItems.length; i++) {
			expect(ellipsisItems[i]).toHaveClass(ellipsisClasses[i]);
		}

		// Last page, page 11 is displayed
		expect(screen.getByRole('link', { name: 'Page 11' })).toHaveTextContent('11');
	});
});
