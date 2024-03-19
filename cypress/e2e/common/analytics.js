/// <reference types="Cypress" />
import { Then, When } from 'cypress-cucumber-preprocessor/steps';

/**
 * Converts a string value to a native data type if indicated in the map.
 * @param {string} val the proposed value
 */
const convertValue = (val) => {
	if (typeof val === 'string') {
		if (val.indexOf('(int)') === 0) {
			return parseInt(val.replace('(int)', ''));
		}
	}
	return val;
};

/**
 * Converts an object with a.b.c styled keys into an
 * object with properties.
 * @param {object} obj The DataTable.hashes()
 */
const convertAnalyticsDatatableObject = (obj) => {
	const objPass1 = Object.keys(obj)
		.map((key) => {
			const [first, ...rest] = key.split('.');
			if (rest.length > 0) {
				const newRestKey = rest.join('.');
				const value = convertValue(obj[first + '.' + newRestKey]);
				return {
					first,
					rest: {
						[newRestKey]: value,
					},
				};
			} else {
				return {
					first,
					value: obj[first],
				};
			}
		})
		.reduce((ac, curr) => {
			const newKey = curr.first;

			if (curr.value !== undefined) {
				if (ac[newKey]) {
					throw new Error(`Key, ${newKey}, is already defined.`);
				}
				return {
					[newKey]: curr.value,
					...ac,
				};
			} else if (curr.rest) {
				if (ac[newKey] && typeof ac[newKey] !== 'object') {
					throw new Error(`Key, ${newKey}, is mixing values and objects.`);
				}

				return {
					...ac,
					[newKey]: {
						...ac[newKey],
						...curr.rest,
					},
				};
			} else {
				// This is not good
				return ac;
			}
		}, {});
	return Object.entries(objPass1).reduce((ac, [key, val] = {}) => {
		return {
			...ac,
			[key]:
				typeof val === 'object' ? convertAnalyticsDatatableObject(val) : val,
		};
	}, {});
};

/**
 * Finds an event with the following information.
 * @param {string} type The type of the event -- PageLoad or Other
 * @param {string} event The name of the event
 */
const getEventFromEDDL = (win, type, event) => {
	return win.NCIDataLayer.filter(
		(evt) => evt.type === type && evt.event === event
	);
};

When('the NCIDataLayer is cleared', () => {
	cy.window().then((win) => {
		// For now while win.NCIDataLayer is normal array we can reset the
		// datalayer to an empty array.
		win.NCIDataLayer = [];
		console.log('win.NCIDataLayer has been reset');
	});
});

// So this is going to find the page load event with the name, and then
// basically build up an object from the data table for comparison to the
// matched event. Note we do not just look at the page here since in the
// future we could have additional data points.
Then(
	'there should be an analytics event with the following details',
	(datatable) => {
		cy.window().then((win) => {
			console.log('finding analytics event for analytics step');
			// First convert the datatable into nested object.
			const rawDataObj = convertAnalyticsDatatableObject(datatable.rowsHash());
			// Gotta strip the header row. (key/value)
			const dataObj = Object.entries(rawDataObj).reduce((ac, [key, val]) => {
				if (key === 'key') {
					return ac;
				}
				return {
					...ac,
					[key]: val,
				};
			}, {});

			if (!dataObj.event) {
				throw new Error('Datatable is missing the event name');
			}

			if (!dataObj.type) {
				throw new Error('Datatable is missing the event type');
			}

			// Find the matching events, this should be only one.
			const matchedEvents = getEventFromEDDL(win, dataObj.type, dataObj.event);
			expect(matchedEvents).to.have.length(1);

			const eventData = matchedEvents[0];
			console.log(eventData);

			// This is a cheat. For the most part we know all the values so this
			// is ok. We won't support regex matching this way.
			// TODO: add regex matching, and when that is added make sure you
			// also add a check to make sure there are not unexpected props.
			expect(eventData).to.eql(dataObj);
		});
	}
);
