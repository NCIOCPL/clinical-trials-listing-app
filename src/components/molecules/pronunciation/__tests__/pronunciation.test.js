import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { testIds } from '../../../../constants';
import Pronunciation from '../pronunciation';

describe('<Pronunciation /> component', () => {
	afterEach(cleanup);

	test('renders the audio component when audio link is supplied', () => {
		const payload = {
			key: null,
			audio: 'http://fakelink.com/mock.mp3',
		};
		const { container } = render(
			<Pronunciation pronunciationObj={payload} language="en" />
		);
		expect(
			container.querySelector('.pronunciation__audio')
		).toBeInTheDocument();
	});

	test('renders the phonetic spelling when pronunciation.key is supplied', () => {
		const payload = {
			key: '(mock phonetic spelling)',
			audio: null,
		};

		const { getByTestId } = render(
			<Pronunciation pronunciationObj={payload} language="en" />
		);
		expect(getByTestId("tid-term-def-pronunciation")).toBeInTheDocument();
		expect(getByTestId("tid-term-def-pronunciation")).toHaveTextContent(
			'(mock phonetic spelling)'
		);
	});
});
