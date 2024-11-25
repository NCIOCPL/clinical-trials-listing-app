import React from 'react';
import { track } from 'react-tracking';

const TrackedComponent = track()(({ children }) => children);

export const withTracking = (Story) => (
  <TrackedComponent>
    <Story />
  </TrackedComponent>
);
