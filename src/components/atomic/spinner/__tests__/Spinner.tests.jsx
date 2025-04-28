import { render, screen } from '@testing-library/react';
import React from 'react';

import Spinner from '../Spinner';

describe('Spinner component', () => {
	it('should have expected spinner components', () => {
		render(<Spinner />);
		expect(screen.getByTestId('ncids-spinner')).toBeInTheDocument();
	});
});
