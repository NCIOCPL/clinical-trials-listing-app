import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import RemovableTag from '../RemovableTag';

describe('RemovableTag component', () => {
	test('should have expected button label and fire onRemove handler', () => {
		const key = 'test-id';
		const label = 'Mock Label';
		const onRemove = jest.fn();

		const { container } = render(
			<RemovableTag key={key} label={label} onRemove={onRemove} />
		);
		const tagLabel = container.querySelector('.cts-removable-tag__label');
		expect(container.querySelector('.cts-removable-tag')).toBeInTheDocument();
		expect(
			container.querySelector('.cts-removable-tag__button')
		).toBeInTheDocument();
		expect(tagLabel).toHaveTextContent(label);
		expect(tagLabel).toBeInTheDocument();
		const tagButton = screen.getByRole('button');
		expect(tagButton.value).toEqual(label);
		fireEvent.click(tagButton);
		expect(onRemove).toBeCalled();
	});
});
