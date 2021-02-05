import React from 'react';
import { render, fireEvent, wait, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FigureCgovImage } from '..';

describe('<FigureCgovImage /> component', () => {
	afterEach(cleanup);

	const mockFig = {
		altText: 'mock alt text',
		thumb_uri: 'http://mock.png',
	};

	it('creates a figure containing an image and does not create a figcaption when both credit and caption are absent', () => {
		const { container } = render(<FigureCgovImage {...mockFig} />);
		expect(container.querySelector('figure')).toBeInTheDocument();
		expect(container.querySelector('figcaption')).not.toBeInTheDocument();
	});

	it('creates a figure with classes when supplied with classes list', () => {
		const { container } = render(
			<FigureCgovImage classes="mockstyle" {...mockFig} />
		);
		expect(container.querySelector('figure.mockstyle')).toBeInTheDocument();
		expect(container.querySelector('figcaption')).not.toBeInTheDocument();
	});

	it('creates a figcaption containing caption text when caption is supplied', () => {
		const { container } = render(
			<FigureCgovImage
				caption="mock caption describing chickens"
				{...mockFig}
			/>
		);
		expect(container.querySelector('figcaption')).toHaveTextContent(
			/chickens/i
		);
	});

	it('creates a figcaption containing a credit when a credit is supplied', () => {
		const { container } = render(
			<FigureCgovImage credit="mock credit" {...mockFig} />
		);
		expect(
			container.querySelector('figcaption .image-photo-credit')
		).toBeInTheDocument();
	});

	it('includes an enlarge button when an enlarge_uri is supplied', () => {
		const { container } = render(
			<FigureCgovImage enlarge_uri="http://mock.jpg" {...mockFig} />
		);
		expect(
			container.querySelector('a.article-image-enlarge')
		).toBeInTheDocument();
	});

	it("displays spanish text when language='es' is supplied", () => {
		const { container } = render(
			<FigureCgovImage
				lang="es"
				enlarge_uri="http://mock.jpg"
				credit="mock credit"
				{...mockFig}
			/>
		);
		expect(
			container.querySelector('a.article-image-enlarge')
		).toHaveTextContent('Ampliar - abre en nueva ventana');
		expect(container.querySelector('.image-photo-credit')).toHaveTextContent(
			/Crédito/i
		);
	});
});
