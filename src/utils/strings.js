export const emboldenSubstring = (str, subStr) => {
	const regex = new RegExp(subStr, 'i');
	return str.replace(regex, '<strong>$&</strong>');
};
