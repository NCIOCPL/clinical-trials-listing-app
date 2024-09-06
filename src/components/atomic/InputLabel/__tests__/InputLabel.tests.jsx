import { render, screen } from '@testing-library/react';
import React from 'react';

import InputLabel from '../InputLabel';

const htmlFor = 'mock';
const labelHint = 'Mock hint';

describe('<InputLabel />', function () {
	render(<InputLabel label="Mock Input Label" hasError htmlFor={htmlFor} id="mock-test" labelHint={labelHint} required />);

	it('InputLabel renders with correct class names and label hint', function () {
		const label = screen.getByTestId(`tid-${htmlFor}-label`);
		expect(label).toBeInTheDocument();
		expect(screen.getByText(labelHint)).toBeInTheDocument();
		expect(label).toHaveClass('ncids-label ncids-label--required ncids-label--error', {
			exact: true,
		});
	});
});
