export function matchItemToTerm(item, value) {
	return item.termName.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}
