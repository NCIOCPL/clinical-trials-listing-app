import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import Spinner from '../Spinner';

describe('Spinner component', () => {
	test('should have expected button label and fire onRemove handler', () => {
		const { container } = render(<Spinner />);
		expect(container.querySelector('.nci-spinner')).toBeInTheDocument();
		expect(container.querySelector('.spinkit')).toBeInTheDocument();
		expect(container.querySelector('.dot1')).toBeInTheDocument();
		expect(container.querySelector('.dot2')).toBeInTheDocument();
	});
});
