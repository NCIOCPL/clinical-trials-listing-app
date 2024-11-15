export function matchStateToTerm(state, value) {
	const searchStr = new RegExp('(^' + value + ')', 'i');
	return state.name.match(searchStr);
}

export function matchStateToTermWithHeaders(state, value) {
	return (
		state.header ||
		state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
		state.abbr.toLowerCase().indexOf(value.toLowerCase()) !== -1
	);
}

/**
 * An example of how to implement a relevancy-based sorting method. States are
 * sorted based on the location of the match - For example, a search for "or"
 * will return "Oregon" before "North Carolina" even though "North Carolina"
 * would normally sort above Oregon. Strings where the match is in the same
 * location (or there is no match) will be sorted alphabetically - For example,
 * a search for "or" would return "North Carolina" above "North Dakota".
 */
export function sortStates(a, b, value) {
	const aLower = a.name.toLowerCase();
	const bLower = b.name.toLowerCase();
	const valueLower = value.toLowerCase();
	const queryPosA = aLower.indexOf(valueLower);
	const queryPosB = bLower.indexOf(valueLower);
	if (queryPosA !== queryPosB) {
		return queryPosA - queryPosB;
	}
	return aLower < bLower ? -1 : 1;
}

export function getStates() {
	return [
		{ abbr: 'AL', name: 'Alabama' },
		{ abbr: 'AK', name: 'Alaska' },
		{ abbr: 'AZ', name: 'Arizona' },
		{ abbr: 'AR', name: 'Arkansas' },
		{ abbr: 'CA', name: 'California' },
		{ abbr: 'CO', name: 'Colorado' },
		{ abbr: 'CT', name: 'Connecticut' },
		{ abbr: 'DC', name: 'District of Columbia' },
		{ abbr: 'DE', name: 'Delaware' },
		{ abbr: 'FL', name: 'Florida' },
		{ abbr: 'GA', name: 'Georgia' },
		{ abbr: 'HI', name: 'Hawaii' },
		{ abbr: 'ID', name: 'Idaho' },
		{ abbr: 'IL', name: 'Illinois' },
		{ abbr: 'IN', name: 'Indiana' },
		{ abbr: 'IA', name: 'Iowa' },
		{ abbr: 'KS', name: 'Kansas' },
		{ abbr: 'KY', name: 'Kentucky' },
		{ abbr: 'LA', name: 'Louisiana' },
		{ abbr: 'ME', name: 'Maine' },
		{ abbr: 'MD', name: 'Maryland' },
		{ abbr: 'MA', name: 'Massachusetts' },
		{ abbr: 'MI', name: 'Michigan' },
		{ abbr: 'MN', name: 'Minnesota' },
		{ abbr: 'MS', name: 'Mississippi' },
		{ abbr: 'MO', name: 'Missouri' },
		{ abbr: 'MT', name: 'Montana' },
		{ abbr: 'NE', name: 'Nebraska' },
		{ abbr: 'NV', name: 'Nevada' },
		{ abbr: 'NH', name: 'New Hampshire' },
		{ abbr: 'NJ', name: 'New Jersey' },
		{ abbr: 'NM', name: 'New Mexico' },
		{ abbr: 'NY', name: 'New York' },
		{ abbr: 'NC', name: 'North Carolina' },
		{ abbr: 'ND', name: 'North Dakota' },
		{ abbr: 'OH', name: 'Ohio' },
		{ abbr: 'OK', name: 'Oklahoma' },
		{ abbr: 'OR', name: 'Oregon' },
		{ abbr: 'PA', name: 'Pennsylvania' },
		{ abbr: 'RI', name: 'Rhode Island' },
		{ abbr: 'SC', name: 'South Carolina' },
		{ abbr: 'SD', name: 'South Dakota' },
		{ abbr: 'TN', name: 'Tennessee' },
		{ abbr: 'TX', name: 'Texas' },
		{ abbr: 'UT', name: 'Utah' },
		{ abbr: 'VT', name: 'Vermont' },
		{ abbr: 'VA', name: 'Virginia' },
		{ abbr: 'WA', name: 'Washington' },
		{ abbr: 'WV', name: 'West Virginia' },
		{ abbr: 'WI', name: 'Wisconsin' },
		{ abbr: 'WY', name: 'Wyoming' },
	];
}
