import React, { useState } from 'react';
import ComboBox from './ComboBox';
// import { withRouter } from 'storybook-addon-react-router-v6';

export default {
	title: 'Components/Filters/ComboBox',
	component: ComboBox,
	argTypes: {
		multiSelect: {
			control: 'boolean',
		},
	},
};

const Template = (args) => {
	const [value, setValue] = useState([]);
	return <ComboBox {...args} value={value} onChange={setValue} />;
};

export const SingleSelect = Template.bind({});
SingleSelect.args = {
	label: 'Stage',
	placeholder: 'Select stage',
	options: [
		{ value: 'stage1', label: 'Stage I' },
		{ value: 'stage2', label: 'Stage II' },
		{ value: 'stage3', label: 'Stage III' },
		{ value: 'stage4', label: 'Stage IV' },
	],
	multiSelect: false,
};

export const MultiSelect = Template.bind({});
MultiSelect.args = {
	label: 'Subtype',
	placeholder: 'Start typing to select a subtype',
	options: [
		{ value: 'her2_pos', label: 'HER2-Positive' },
		{ value: 'her2_neg', label: 'HER2-Negative' },
		{ value: 'triple_neg', label: 'Triple Negative' },
	],
	multiSelect: true,
	helpText: 'More than one selection may be made.',
};
