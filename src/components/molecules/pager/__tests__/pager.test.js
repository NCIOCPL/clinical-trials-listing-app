import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Pager from '../pager';
import { useStateValue } from '../../../../store/store.js';

jest.mock('../../../../store/store.js');

let wrapper;
let current = 0;
describe('SPager(English)', () => {
	beforeEach(async () => {
		const basePath = '/';
		const canonicalHost = 'https://www.example.gov';
		const language = 'en';
		const searchSiteFilter = 'all';
		const title = 'NCI Search Results';
		useStateValue.mockReturnValue([
			{
				appId: 'mockAppId',
				basePath,
				canonicalHost,
				language,
				searchSiteFilter,
				title,
			},
		]);
		// moves counter up one each test
		current += 1;
		wrapper = render(
			<MemoryRouter initialEntries={['/?swKeyword=tumor']}>
				<Pager
					current={current}
					totalResults={200}
					resultsPerPage={20}
					language={'en'}
					keyword={'tumor'}
				/>
			</MemoryRouter>
		);
	});
	// counter 1
	test('Should load the pager component', () => {
		const { queryAllByText } = wrapper;
		expect(wrapper.getAllByRole('navigation')[0]).toBeInTheDocument();
		expect(queryAllByText(/1/)[0]).toBeInTheDocument();
		expect(queryAllByText(/2/)[0]).toBeInTheDocument();
		expect(queryAllByText(/.../)[0]).toBeInTheDocument();
		expect(queryAllByText(/Next/)[0]).toBeInTheDocument();
	});
	// counter 2
	test('test Nav element is there and link options', () => {
		expect(wrapper.queryAllByText(/.../)[1]).toHaveClass('show-for-sr');
		expect(wrapper.queryAllByText(/.../)[2]).toHaveClass('show-for-sr');
		expect(wrapper.getAllByRole('link')[0]).toHaveTextContent('< Previous');
		expect(wrapper.getAllByRole('link')[3]).toHaveClass('total_pages');
		expect(wrapper.getAllByRole('listitem')[4]).toHaveClass(
			'pager__ellipses--right'
		);
	});
	// counter 3
	test('Test href and urls', () => {
		expect(wrapper.queryAllByText(/3/)[0]).toHaveClass('pager__button active');
		expect(wrapper.getAllByRole('link')[2]).toHaveAttribute(
			'href',
			'?swKeyword=tumor&page=2&pageunit=20'
		);
		expect(wrapper.getAllByRole('link')[1]).toHaveAttribute(
			'href',
			'?swKeyword=tumor&page=1&pageunit=20'
		);
	});
});
