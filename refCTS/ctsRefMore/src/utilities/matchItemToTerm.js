export function matchItemToTerm(item, value) {
	return item.term.toLowerCase().indexOf(value.toLowerCase()) !== -1;
}
