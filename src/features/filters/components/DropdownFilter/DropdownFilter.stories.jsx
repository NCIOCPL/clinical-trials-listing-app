import React, { useState } from 'react';
import DropdownFilter from './DropdownFilter';

export default {
	title: 'Components/Filters/DropdownFilter',
	component: DropdownFilter,
	parameters: {
		docs: {
			description: {
				component: 'A dropdown filter component with keyboard navigation and accessibility features.',
			},
		},
	},
	argTypes: {
		onChange: { action: 'changed' },
	},
};

// Mock data for different scenarios
const stageOptions = [
	{ value: 'stage-1', label: 'Stage I' },
	{ value: 'stage-2', label: 'Stage II' },
	{ value: 'stage-3', label: 'Stage III' },
	{ value: 'stage-4', label: 'Stage IV' },
];

const radiusOptions = [
	{ value: '5', label: '5 miles' },
	{ value: '10', label: '10 miles' },
	{ value: '25', label: '25 miles' },
	{ value: '50', label: '50 miles' },
	{ value: '100', label: '100 miles' },
];

const Template = (args) => {
	const [value, setValue] = useState(args.value);

	return (
		<div style={{ padding: '1rem', maxWidth: '300px' }}>
			<DropdownFilter
				{...args}
				value={value}
				onChange={(newValue) => {
					setValue(newValue);
					args.onChange(newValue);
				}}
			/>
		</div>
	);
};

export const StageFilter = Template.bind({});
StageFilter.args = {
	id: 'stage-filter',
	label: 'Stage',
	options: stageOptions,
	placeholder: 'Select stage',
	required: true,
};

export const RadiusFilter = Template.bind({});
RadiusFilter.args = {
	id: 'radius-filter',
	label: 'Search Radius',
	options: radiusOptions,
	placeholder: 'Select radius',
};

export const WithError = Template.bind({});
WithError.args = {
	...StageFilter.args,
	error: 'Please select a stage',
};

export const Disabled = Template.bind({});
Disabled.args = {
	...StageFilter.args,
	disabled: true,
};

export const WithPreselectedValue = Template.bind({});
WithPreselectedValue.args = {
	...StageFilter.args,
	value: 'stage-2',
};

// Interactive example with many options to test scrolling
export const WithManyOptions = Template.bind({});
WithManyOptions.args = {
	id: 'long-filter',
	label: 'Long List',
	options: Array.from({ length: 20 }, (_, i) => ({
		value: `option-${i + 1}`,
		label: `Option ${i + 1}`,
	})),
	placeholder: 'Select an option',
};
