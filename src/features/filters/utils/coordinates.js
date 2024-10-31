const zipCoordinates = {
	20850: {
		lat: '38.928',
		lon: '-77.2649',
	},
};

export const getCoordinatesForZip = (zipCode) => {
	return zipCoordinates[zipCode] || null;
};

export const formatRadius = (radius) => {
	return `${radius}mi`;
};
