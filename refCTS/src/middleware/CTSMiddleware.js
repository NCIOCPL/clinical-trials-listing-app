import { receiveData } from '../store/actions';
import { ACTIVE_RECRUITMENT_STATUSES } from '../constants';

/**
 * This middleware serves two purposes (and could perhaps be broken into two pieces).
 * 1. To set up API requests with all the appropriate settings
 * 2. To handle the attendant responses and failures. Successful requests will need to be cached and then
 * sent to the store. Failures will need to be taken round back and shot.
 * @param {Object} services
 */
const createCTSMiddleware =
	(services) =>
	({ dispatch }) =>
	(next) =>
	async (action) => {
		next(action);

		if (action.type !== '@@api/CTS') {
			return;
		}

		const { service: serviceName, cacheKey, requests } = action.payload;
		const service = services[serviceName]();

		const getAllRequests = (requests) => {
			return Promise.all(
				requests.map(async (request) => {
					if (request.payload) {
						// get descendant data and map to cache based on maintype code

						const { requests: nestedRequests, cacheKey: nestedKey } =
							request.payload;

						const nestedResponses = await getAllRequests(nestedRequests);

						return {
							[nestedKey]:
								nestedResponses.length > 1
									? [
											Object.assign(
												{},
												...nestedResponses.map((res) => ({ ...res }))
											),
									  ]
									: nestedResponses[0],
						};
					} else {
						const { method, requestParams, fetchHandlers } = request;
						let headers = {
							Accept: '*/*',
							'Content-Type': 'application/json',
							'Cache-Control': 'no-cache',
							Pragma: 'no-cache',
						};
						const response =
							method === 'searchTrials'
								? await service[method](...Object.values(requestParams), {
										headers,
								  })
								: await service[method](...Object.values(requestParams));
						let body = {};

						// if search results, add total and starting index
						if (response.terms) {
							body = response.terms;
						} else if (response.trials) {
							// This is going to be very dirty, we need to filter out
							// inactive trial sites, but the service returns a class
							// for each trial so we can't make this immutable. We
							// instead need to modify the sites property of each
							// trial.
							for (const trial of response.trials) {
								// change the trial sites list to only those that are
								// actively recruiting.
								trial.sites = trial.sites
									? trial.sites.filter((site) =>
											ACTIVE_RECRUITMENT_STATUSES.includes(
												// Site comes all upper case from the API
												site.recruitmentStatus.toLowerCase()
											)
									  )
									: [];
							}

							body = response;
						} else {
							body = response;
						}

						let formattedBody = body;

						if (fetchHandlers) {
							const { formatResponse } = fetchHandlers;
							formattedBody = formatResponse ? formatResponse(body) : body;
						}
						return formattedBody;
					}
				})
			);
		};

		if (service !== null && requests) {
			try {
				const results = await getAllRequests(requests);
				const valueToCache =
					requests.length > 1
						? [Object.assign({}, ...results.map((result) => ({ ...result })))]
						: results;
				dispatch(receiveData(cacheKey, ...valueToCache));
			} catch (err) {
				console.log(err);
			}
		}
	};

export default createCTSMiddleware;
