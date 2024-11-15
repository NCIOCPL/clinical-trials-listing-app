import * as trackingActions from '../modules/analytics/tracking/tracking.actions';

export { reducer as globals } from './globals';
export { reducer as form } from './form';
export { reducer as cache } from './cache';
export { reducer as tracking } from '../modules/analytics/tracking/tracking.reducer';

export const actions = {
	...trackingActions,
};
