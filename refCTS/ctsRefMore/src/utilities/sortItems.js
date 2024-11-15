export function sortItems(a, b, value) {
	const aLower = a.term.toLowerCase();
	const bLower = b.term.toLowerCase();
	const valueLower = value.toLowerCase();
	const queryPosA = aLower.indexOf(valueLower);
	const queryPosB = bLower.indexOf(valueLower);
	if (queryPosA !== queryPosB) {
		return queryPosA - queryPosB;
	}
	return aLower < bLower ? -1 : 1;
}

export function sortItemsByName(a, b, value) {
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
