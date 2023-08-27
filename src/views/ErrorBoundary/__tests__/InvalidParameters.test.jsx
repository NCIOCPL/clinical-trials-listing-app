import { render, screen } from '@testing-library/react';
import React from 'react';

import { InvalidParameters } from '../index';

describe('<InvalidParameters />', () => {
	it('should render expected text', () => {
		const param = 'trialListingPageType';

		render(<InvalidParameters paramName={param} />);
		expect(
			screen.getByText(
				'Missing or invalid "trialListingPageType" provided to app initialization.'
			)
		).toBeInTheDocument();
	});
});
