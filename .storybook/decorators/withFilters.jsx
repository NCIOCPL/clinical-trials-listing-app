import React from 'react';
import { FilterProvider } from '../../src/features/filters/context/FilterContext/FilterContext';

export const withFilters = (Story) => (
  <FilterProvider>
    <Story />
  </FilterProvider>
);
