import React from 'react';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FigureCgovVideo } from '..';

describe('<FigureCgovVideo /> component', () => {
	afterEach(cleanup);

	const mockFig = {
		videoId: 'mockId',
		classes: 'mock-class',
		videoTitle: 'Mock Title',
	};

	it('creates a figure with button for youtube video and no figcaption', () => {
		const { container } = render(<FigureCgovVideo {...mockFig} />);
		expect(container.querySelector('figure')).toBeInTheDocument();
		expect(
			container.querySelector('button.video-preview--container')
		).toBeInTheDocument();
	});

	it('adds a figcaption when caption text is a child of the tag', () => {
		const { container } = render(
			<FigureCgovVideo {...mockFig}>Mock caption</FigureCgovVideo>
		);
		expect(container.querySelector('figcaption')).toBeInTheDocument();
	});
});
