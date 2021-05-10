import { EDDLAnalyticsHandler } from '../index';

let consoleError;
let consoleLogger;
describe('EDDLAnalyticsHandler', () => {
	beforeEach(() => {
		consoleError = jest.spyOn(console, 'error');
		consoleLogger = jest.spyOn(console, 'log');
	});
	afterEach(() => {
		console.error.mockRestore();
		console.log.mockRestore();
	});
	it('pushes a load event on the NCIDataLayer', () => {
		const mockWindow = {
			NCIDataLayer: [],
		};
		const spy = jest.spyOn(mockWindow.NCIDataLayer, 'push');
		EDDLAnalyticsHandler(mockWindow)({
			type: 'PageLoad',
			event: 'TestLoad',
			name: 'pageName',
			channel: 'channel',
			audience: 'Patient',
			additional1: '',
			additional2: '',
		});
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('pushes an other event on the NCIDataLayer', () => {
		const mockWindow = {
			NCIDataLayer: [],
		};
		const spy = jest.spyOn(mockWindow.NCIDataLayer, 'push');
		EDDLAnalyticsHandler(mockWindow)({
			type: 'Other',
			event: 'TestOther',
			linkName: 'TestLinkName',
			data1: '',
			data2: '',
		});
		expect(spy).toHaveBeenCalledTimes(1);
	});

	it('logs to the console when event is not supplied to NCIDataLayer', () => {
		const mockWindow = {
			NCIDataLayer: [],
		};
		const spy = jest.spyOn(mockWindow.NCIDataLayer, 'push');
		EDDLAnalyticsHandler(mockWindow)({
			type: 'PageLoad',
			name: 'pageName',
			channel: 'channel',
			audience: 'Patient',
			additional1: '',
			additional2: '',
		});
		expect(spy).toHaveBeenCalledTimes(1);
		expect(consoleError).toHaveBeenCalledTimes(2);
	});

	it('logs to the console when an unsupported payload type is supplied', () => {
		const mockWindow = {
			NCIDataLayer: [],
		};
		EDDLAnalyticsHandler(
			mockWindow,
			true
		)({
			type: 'Chicken',
			event: 'TestOther',
			name: 'pageName',
			channel: 'channel',
			audience: 'Patient',
			additional1: '',
			additional2: '',
		});
		expect(consoleError).toHaveBeenCalledTimes(2);
	});

	it('logs to the console when a debugging flag is true', () => {
		const mockWindow = {
			NCIDataLayer: [],
		};
		EDDLAnalyticsHandler(
			mockWindow,
			true
		)({
			type: 'Other',
			event: 'TestOther',
			name: 'pageName',
			channel: 'channel',
			audience: 'Patient',
			additional1: '',
			additional2: '',
		});
		expect(consoleLogger).toHaveBeenCalledTimes(1);
	});
});
