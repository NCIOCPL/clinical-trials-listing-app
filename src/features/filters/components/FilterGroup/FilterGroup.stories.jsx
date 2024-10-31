/* eslint-disable */
import React from 'react';
import FilterGroup from './FilterGroup';
import { withTracking } from '../../../../../.storybook/decorators/withTracking';

// Move default export to the top
export default {
	title: 'Components/Filters/FilterGroup',
	component: FilterGroup,
	parameters: {
		docs: {
			description: {
				component: 'A collapsible filter group component that provides consistent styling and behavior for filter sections.',
			},
		},
	},
	argTypes: {
		title: {
			control: 'text',
			description: 'The title of the filter group',
		},
		helpText: {
			control: 'text',
			description: 'Optional help text displayed below the title',
		},
		defaultExpanded: {
			control: 'boolean',
			description: 'Whether the group is expanded by default',
		},
		required: {
			control: 'boolean',
			description: 'Whether the filter group is required',
		},
		showDivider: {
			control: 'boolean',
			description: 'Whether to show a divider below the group',
		},
	},
};

const Template = (args) => (
	<div style={{ maxWidth: '300px', padding: '1rem', backgroundColor: '#fff' }}>
		<FilterGroup {...args}>
			<div style={{ padding: '0.5rem 0' }}>{args.children}</div>
		</FilterGroup>
	</div>
);

export const Default = Template.bind({});
Default.args = {
	title: 'Subtype',
	children: (
		<div>
			<p>Filter content goes here</p>
		</div>
	),
	defaultExpanded: true,
	showDivider: true,
};

export const WithHelpText = Template.bind({});
WithHelpText.args = {
	...Default.args,
	title: 'Drug/Intervention',
	helpText: "You can use the drug's generic or brand name. More than one selection may be made.",
};

export const Required = Template.bind({});
Required.args = {
	...Default.args,
	title: 'Stage',
	required: true,
};

export const CollapsedByDefault = Template.bind({});
CollapsedByDefault.args = {
	...Default.args,
	defaultExpanded: false,
};

export const MultipleGroups = () => (
	<div style={{ maxWidth: '300px', padding: '1rem', backgroundColor: '#fff' }}>
		<FilterGroup title="Subtype" showDivider>
			<p>Subtype filter content</p>
		</FilterGroup>
		<FilterGroup title="Drug/Intervention" helpText="Enter drug names" showDivider>
			<p>Drug filter content</p>
		</FilterGroup>
		<FilterGroup title="Age" required>
			<p>Age filter content</p>
		</FilterGroup>
	</div>
);
