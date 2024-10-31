import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { FilterProvider } from '../../src/features/filters/context/FilterContext/FilterContext';
import { track } from 'react-tracking';

const TrackedComponent = track()(({ children }) => children);

export const withProviders = (Story) => (
  <BrowserRouter>
    <FilterProvider>
      <TrackedComponent>
        <Story />
      </TrackedComponent>
    </FilterProvider>
  </BrowserRouter>
);
