function hypenateFileName(fileName) {
	return fileName
		.replace(/([~!@#$%^&*()_+=`{}[\]|\\:;'<>,./? ])+/g, '-')
		.toLowerCase();
}

module.exports = hypenateFileName;
