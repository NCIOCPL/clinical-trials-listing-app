import React from 'react';
import { track } from 'react-tracking';

const TrackedComponent = track()(({ children }) => children);



// import { MockAnalyticsProvider } from '../../src/tracking';

// export const withTracking = (Story) => (
//   <MockAnalyticsProvider analyticsHandler={(data) => console.log('Analytics:', data)}>
//     <Story />
//   </MockAnalyticsProvider>
// );


export const withTracking = (Story) => (
  <TrackedComponent>
    <Story />
  </TrackedComponent>
);
