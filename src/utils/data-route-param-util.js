/**
 * This gets the text replacement context for the given listing info response, and route params
 * @param {Array<Object>} data a collection of objects from the listing API
 * @param {Array<Object>} routeParamMap the route parameter mapping providing listing API type, and key names
 */
export const getTextReplacementContext = (data, routeParamMap) => {
	if (!data || !routeParamMap) {
		return {};
	}

	return data.reduce((ac, paramData, idx) => {
		const paramInfo = routeParamMap[idx];

		switch (paramInfo.type) {
			case 'listing-information':
				return {
					...ac,
					[`${paramInfo.textReplacementKey}_label`]: paramData?.name?.label || '',
					[`${paramInfo.textReplacementKey}_normalized`]: paramData?.name?.normalized || '',
				};
			case 'trial-type':
				return {
					...ac,
					[`${paramInfo.textReplacementKey}_label`]: paramData?.label || '',
					[`${paramInfo.textReplacementKey}_normalized`]: paramData?.label?.toLowerCase() || '',
				};
			default:
				throw new Error(`Unknown parameter type ${paramInfo.type}`);
		}
	}, {});
};

/**
 * Gets a string of the redirect parameters for no trials based on the route and data
 * @param {Array<Object>} data a collection of objects from the listing API
 * @param {Array<Object>} routeParamMap the route parameter mapping providing listing API type, and key names
 */
export const getNoTrialsRedirectParams = (data, routeParamMap) => {
	const redirectParams = data.reduce((tmpParams, paramData, idx) => {
		const paramInfo = routeParamMap[idx];

		switch (paramInfo.type) {
			case 'listing-information': {
				const paramVal = paramData.prettyUrlName ? paramData.prettyUrlName : paramData.conceptId.join(',');

				return tmpParams + (tmpParams !== '' ? '&' : '') + `p${idx + 1}=${paramVal}`;
			}
			case 'trial-type': {
				return tmpParams + (tmpParams !== '' ? '&' : '') + `p${idx + 1}=${paramData.prettyUrlName}`;
			}
			default:
				throw new Error(`Unknown parameter type ${paramInfo.type}`);
		}
	}, '');

	return redirectParams;
};

/**
 * This gets the params object that can be used by an useAppPath path function.
 * @param {Array<Object>} data a collection of objects from the listing API
 * @param {Array<Object>} routeParamMap the route parameter mapping providing listing API type, and key names
 */
export const getParamsForRoute = (data, routeParamMap) => {
	const paramsObject = data.reduce((acQuery, paramData, idx) => {
		const paramInfo = routeParamMap[idx];

		switch (paramInfo.type) {
			case 'listing-information': {
				return {
					...acQuery,
					[paramInfo.paramName]: paramData.prettyUrlName ? paramData.prettyUrlName : paramData.conceptId.join(','),
				};
			}
			case 'trial-type': {
				return {
					...acQuery,
					[paramInfo.paramName]: paramData.prettyUrlName ? paramData.prettyUrlName : paramData.idString,
				};
			}
			default:
				throw new Error(`Unknown parameter type ${paramInfo.type}`);
		}
	}, {});
	return paramsObject;
};

/**
 * Gets the route specific analytics params for the data/route.
 * @param {Array<Object>} data a collection of objects from the listing API
 * @param {Array<Object>} routeParamMap the route parameter mapping providing listing API type, and key names
 */
export const getAnalyticsParamsForRoute = (data, routeParamMap) => {
	const trackingData = data.reduce((acQuery, paramData, idx) => {
		const paramInfo = routeParamMap[idx];
		switch (paramInfo.type) {
			case 'listing-information':
				return {
					...acQuery,
					[`${paramInfo.textReplacementKey}Name`]: paramData.name.normalized,
				};
			case 'trial-type':
				return {
					...acQuery,
					trialType: paramData.label.toLowerCase(),
				};
			default:
				throw new Error(`Unknown parameter type ${paramInfo.type}`);
		}
	}, {});
	return trackingData;
};
