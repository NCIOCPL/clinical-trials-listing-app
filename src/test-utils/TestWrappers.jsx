/* eslint-disable */
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../tracking';
import { FilterProvider } from '../features/filters/context/FilterContext/FilterContext';
import { ListingSupportContextProvider } from '../hooks/listingSupport';

export const TestWrapper = ({ children, initialEntries = ['/'] }) => (
	<MemoryRouter initialEntries={initialEntries}>
		<MockAnalyticsProvider>
			<FilterProvider>{children}</FilterProvider>
		</MockAnalyticsProvider>
	</MemoryRouter>
);

export const CTLViewsTestWrapper = ({ children, initialEntries = ['/'] }) => (
	<MemoryRouter initialEntries={initialEntries}>
		<MockAnalyticsProvider>
			<FilterProvider>
				<ListingSupportContextProvider>{children}</ListingSupportContextProvider>
			</FilterProvider>
		</MockAnalyticsProvider>
	</MemoryRouter>
);
