import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FilterProvider } from '../src/features/filters/context/FilterContext/FilterContext';

import '../src/styles/app.scss';
import { track } from 'react-tracking';

const TrackedComponent = track()(({ children }) => children);


/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};


export const decorators = [
	(Story) => (

		<BrowserRouter>
		<TrackedComponent>
			<FilterProvider>
				<Story />
			</FilterProvider>
			</TrackedComponent>
		</BrowserRouter>
	)
];

export default preview;
