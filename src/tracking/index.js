import * as events from './events';

export const trackedEvents = {
	...events,
};

export { default as AnalyticsProvider } from './analytics-provider';
export { default as EddlAnalyticsProvider } from './eddl-analytics-provider';
// export { default as EddlAnalyticsHandler } from './eddl-analytics-handler';
export { default as MockAnalyticsProvider } from './mock-analytics-provider';
export { default as WrapperComponent } from './wrapper-component';
