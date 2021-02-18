import { render, screen } from '@testing-library/react';
import React from 'react';

import { NoListingType } from '../index';

describe('<NoListingType />', () => {
	test('should render expected text', () => {
		render(<NoListingType />);
		expect(
			screen.getByText(
				'Missing or invalid "trialListingPageType" provided to app initialization.'
			)
		).toBeInTheDocument();
	});
});
