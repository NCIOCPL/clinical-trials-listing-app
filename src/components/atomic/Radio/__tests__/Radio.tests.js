import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Radio from '../Radio';

const label1 = 'Radio Mock Label1';
const label2 = 'Radio Mock Label2';

describe('Check Radio Button', function () {
	render(
		<>
			<Radio label={label1} id="mock-test" value="1" />
			<Radio label={label2} id="mock-test" value="2" />
		</>
	);

	test('Radio renders', function () {
		expect(screen.getByLabelText(label1)).toBeInTheDocument();
		const radio = screen.getByLabelText(label1);
		expect(radio).not.toBeChecked();
		fireEvent.click(radio);
		expect(radio.value).toBe('1');
		expect(radio).toBeChecked();
		expect(radio.disabled).toBe(false);
	});
});
