/* eslint-disable */
import React from 'react';
import { MemoryRouter } from 'react-router';
import { MockAnalyticsProvider } from '../tracking';
import { FilterProvider } from '../features/filters/context/FilterContext/FilterContext';
import { ListingSupportContextProvider } from '../hooks/listingSupport';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
			<QueryWrapper>
			<FilterProvider>
				<ListingSupportContextProvider>{children}</ListingSupportContextProvider>
			</FilterProvider>
				</QueryWrapper>
		</MockAnalyticsProvider>
	</MemoryRouter>
);


const createTestQueryClient = () => new QueryClient({
	defaultOptions: {
		queries: {
			retry: false,
		},
	},
});

export const QueryWrapper = ({ children }) => {
	const client = createTestQueryClient();
	return (
		<QueryClientProvider client={client}>
			{children}
		</QueryClientProvider>
	);
};
