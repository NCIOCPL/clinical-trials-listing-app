import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { FilterProvider } from '../../context/FilterContext/FilterContext';
import '../../../../styles/app.scss'; // Import global styles

export default {
	title: 'Molecules/Sidebar',
	component: Sidebar,
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		(Story) => (
			<FilterProvider>
				<div
					style={{
						height: '100vh',
						display: 'flex',
						background: '#fff',
					}}>
					<Story />
					<div style={{ flex: 1, padding: '20px' }}>
						<h1>Main Content Area</h1>
						<p>This is where the clinical trials listing would appear.</p>
					</div>
				</div>
			</FilterProvider>
		),
	],
};

// Basic template
const Template = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const WithActiveFilters = Template.bind({});
WithActiveFilters.parameters = {
	initialState: {
		filters: {
			subtype: ['some-subtype'],
			age: ['adult'],
		},
	},
};

export const Mobile = Template.bind({});
Mobile.parameters = {
	viewport: {
		defaultViewport: 'mobile1',
	},
};
