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
		render(
			<Pager
				totalResults={250}
				onPageNavigationChange={onPageNavigationChange}
			/>
		);

		// There should be 5 visible pager navigation items.
		// 4 for page numbers (first, two right neighbours for default first page, and last page,
		// and 1 for next
		expect(screen.getAllByRole('button').length).toBe(5);
	});

	it('should display page 1 as currently active page when current page supplied is 0', () => {
		const { onPageNavigationChange } = defaultProps;
		render(
			<Pager
				current={0}
				totalResults={250}
				onPageNavigationChange={onPageNavigationChange}
			/>
		);

		// Page 1 should be currently active page
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
			'class',
			'pager__button active'
		);
	});

	it('should display page 1 as currently active page when current page supplied exceeds page count', () => {
		const { onPageNavigationChange } = defaultProps;
		render(
			<Pager
				current={5000}
				totalResults={250}
				onPageNavigationChange={onPageNavigationChange}
			/>
		);

		// Page 1 should be currently active page
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
			'class',
			'pager__button active'
		);
	});

	it('should display expected pager items and check currently active page on load and on next button click', () => {
		const { container, rerender } = render(<Pager {...defaultProps} />);

		// There should be 6 visible pager navigation items. 5 for page numbers, and 1 for next
		expect(screen.getAllByRole('button').length).toBe(6);

		// There should be 5 page number items reflecting total page count of 5
		expect(container.querySelectorAll('li.pager__list-item').length).toBe(5);

		// Next pager item should be present
		expect(screen.getByRole('button', { name: 'next page' })).toHaveTextContent(
			'Next'
		);

		// Page 1 should be currently active page
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveTextContent(
			'1'
		);
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Previous pager item button should be hidden and have expected label
		expect(
			screen.getAllByRole('button', { hidden: true })[0]
		).toHaveTextContent('Previous');

		// Navigate to next page with next pager item button
		fireEvent.click(screen.getByRole('button', { name: 'next page' }));
		rerender(<Pager {...defaultProps} current={pageNumber} />);

		// Currently active page now should be page 2
		expect(screen.getByRole('button', { name: 'page 2' })).toHaveAttribute(
			'class',
			'pager__button active'
		);
	});

	it('should check for default active page passed, ellipsis display and currently active page on previous button click', () => {
		const { container, rerender } = render(
			<Pager
				{...defaultProps}
				current={5}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		// Check currently active page is 5 as provided to props
		expect(screen.getByRole('button', { name: 'page 5' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Check for left and right ellipsis
		expect(
			container.querySelector('li.pager__ellipsis--left')
		).toHaveTextContent('...');
		expect(
			container.querySelector('li.pager__ellipsis--right')
		).toHaveTextContent('...');

		// Click on last page number and confirm next button is hidden
		fireEvent.click(screen.getByRole('button', { name: 'page 11' }));
		rerender(
			<Pager
				{...defaultProps}
				current={pageNumber}
				resultsPerPage={10}
				totalResults={102}
			/>
		);
		expect(screen.getByRole('button', { name: 'page 11' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Click on previous and confirm currently active page is 10
		fireEvent.click(screen.getByRole('button', { name: 'previous page' }));
		rerender(
			<Pager
				{...defaultProps}
				current={pageNumber}
				resultsPerPage={10}
				totalResults={102}
			/>
		);
		expect(screen.getByRole('button', { name: 'page 10' })).toHaveAttribute(
			'class',
			'pager__button active'
		);
	});

	it('should display correct page neighbours to the left and right of the current page', () => {
		const { container, rerender } = render(
			<Pager
				{...defaultProps}
				currentPageNeighbours={1}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		// Page 1 should be currently active page
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Page 2 is right neighbour of 1 and should be displayed
		expect(screen.getByRole('button', { name: 'page 2' })).toHaveTextContent(
			'2'
		);

		// Page 3 should not be displayed
		expect(
			screen.queryByRole('button', { name: 'page 3' })
		).not.toBeInTheDocument();

		// Navigate to page 2 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'next page' }));
		rerender(
			<Pager
				{...defaultProps}
				current={pageNumber}
				currentPageNeighbours={1}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		/*
				::: Page 2 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveTextContent(
			'1'
		);

		// Page 2 is currently active page
		expect(screen.getByRole('button', { name: 'page 2' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Page 3 is right neighbour of 2 and should be displayed
		expect(screen.getByRole('button', { name: 'page 3' })).toHaveTextContent(
			'3'
		);

		// Page 4 is not displayed
		expect(
			screen.queryByRole('button', { name: 'page 4' })
		).not.toBeInTheDocument();

		// Right ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--right')
		).toHaveTextContent('...');

		// Last page, page 11 is displayed
		expect(screen.getByRole('button', { name: 'page 11' })).toHaveTextContent(
			'11'
		);

		// Navigate to page 3 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'next page' }));
		rerender(
			<Pager
				{...defaultProps}
				current={pageNumber}
				currentPageNeighbours={1}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		/*
				::: Page 3 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveTextContent(
			'1'
		);

		// Page 3 is currently active page
		expect(screen.getByRole('button', { name: 'page 3' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Page 2 is left neighbour of 3 and should be displayed
		expect(screen.getByRole('button', { name: 'page 2' })).toHaveTextContent(
			'2'
		);

		// Page 4 is right neighbour of 3 and should be displayed
		expect(screen.getByRole('button', { name: 'page 4' })).toHaveTextContent(
			'4'
		);

		// Page 5 is not displayed
		expect(
			screen.queryByRole('button', { name: 'page 5' })
		).not.toBeInTheDocument();

		// Left ellipsis is not displayed
		expect(
			container.querySelector('li.pager__ellipsis--left')
		).not.toBeInTheDocument();

		// Right ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--right')
		).toHaveTextContent('...');

		// Navigate to page 4 with the next page button
		fireEvent.click(screen.getByRole('button', { name: 'next page' }));
		rerender(
			<Pager
				{...defaultProps}
				current={pageNumber}
				currentPageNeighbours={1}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		/*
				::: Page 4 :::
		*/

		// Confirm page 1 is displayed
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveTextContent(
			'1'
		);

		// Page 4 is currently active page
		expect(screen.getByRole('button', { name: 'page 4' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Page 3 is left neighbour of 4 and should be displayed
		expect(screen.getByRole('button', { name: 'page 3' })).toHaveTextContent(
			'3'
		);

		// Page 5 is right neighbour of 4 and should be displayed
		expect(screen.getByRole('button', { name: 'page 5' })).toHaveTextContent(
			'5'
		);

		// Page 6 is not displayed
		expect(
			screen.queryByRole('button', { name: 'page 6' })
		).not.toBeInTheDocument();

		// Left ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--left')
		).toHaveTextContent('...');

		// Right ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--right')
		).toHaveTextContent('...');

		// Last page, page 11 is displayed
		expect(screen.getByRole('button', { name: 'page 11' })).toHaveTextContent(
			'11'
		);

		/*
				::: Page 5 (With Page Neighbours as 0) :::
		*/

		rerender(
			<Pager
				{...defaultProps}
				current={5}
				currentPageNeighbours={0}
				resultsPerPage={10}
				totalResults={102}
			/>
		);

		// Confirm page 1 is displayed
		expect(screen.getByRole('button', { name: 'page 1' })).toHaveTextContent(
			'1'
		);

		// Page 5 is currently active page
		expect(screen.getByRole('button', { name: 'page 5' })).toHaveAttribute(
			'class',
			'pager__button active'
		);

		// Page 4 is not displayed as left neighbour
		expect(
			screen.queryByRole('button', { name: 'page 4' })
		).not.toBeInTheDocument();

		// Page 6 is not displayed as right neighbour
		expect(
			screen.queryByRole('button', { name: 'page 6' })
		).not.toBeInTheDocument();

		// Left ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--left')
		).toHaveTextContent('...');

		// Right ellipsis is displayed
		expect(
			container.querySelector('li.pager__ellipsis--right')
		).toHaveTextContent('...');

		// Last page, page 11 is displayed
		expect(screen.getByRole('button', { name: 'page 11' })).toHaveTextContent(
			'11'
		);
	});
});
