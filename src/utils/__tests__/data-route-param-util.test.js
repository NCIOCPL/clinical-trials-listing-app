import { getTextReplacementContext, getNoTrialsRedirectParams, getParamsForRoute, getAnalyticsParamsForRoute } from '../data-route-param-util';

describe('data-route-param-util', () => {
	const COMMON_DATA = [
		{
			conceptId: ['C4872'],
			name: {
				label: 'Breast Cancer',
				normalized: 'breast cancer',
			},
			prettyUrlName: 'breast-cancer',
		},
		{
			prettyUrlName: 'treatment',
			idString: 'treatment',
			label: 'Treatment',
		},
		{
			conceptId: ['C1111', 'C2222'],
			name: {
				label: 'My Test Label',
				normalized: 'my test label',
			},
		},
	];

	const COMMON_RPM = [
		{
			paramName: 'codeOrPurl',
			textReplacementKey: 'disease',
			type: 'listing-information',
		},
		{
			paramName: 'type',
			textReplacementKey: 'trial_type',
			type: 'trial-type',
		},
		{
			paramName: 'interCodeOrPurl',
			textReplacementKey: 'intervention',
			type: 'listing-information',
		},
	];

	describe('getTextReplacementContext', () => {
		it('works with all types', () => {
			const expected = {
				disease_label: 'Breast Cancer',
				disease_normalized: 'breast cancer',
				intervention_label: 'My Test Label',
				intervention_normalized: 'my test label',
				trial_type_label: 'Treatment',
				trial_type_normalized: 'treatment',
			};
			const actual = getTextReplacementContext(COMMON_DATA, COMMON_RPM);

			expect(actual).toEqual(expected);
		});

		it('throws on unexpected type', () => {
			expect(() => {
				getTextReplacementContext(
					[COMMON_DATA[0]],
					[
						{
							paramName: 'codeOrPurl',
							textReplacementKey: 'disease',
							type: 'foo-bar',
						},
					]
				);
			}).toThrow('Unknown parameter type foo-bar');
		});
	});

	describe('getNoTrialsRedirectParams', () => {
		it('works with all types', () => {
			const expected = 'p1=breast-cancer&p2=treatment&p3=C1111,C2222';
			const actual = getNoTrialsRedirectParams(COMMON_DATA, COMMON_RPM);

			expect(actual).toEqual(expected);
		});

		it('throws on unexpected type', () => {
			expect(() => {
				getNoTrialsRedirectParams(
					[COMMON_DATA[0]],
					[
						{
							paramName: 'codeOrPurl',
							textReplacementKey: 'disease',
							type: 'foo-bar',
						},
					]
				);
			}).toThrow('Unknown parameter type foo-bar');
		});
	});

	describe('getParamsForRoute', () => {
		it('works with all types', () => {
			const expected = {
				codeOrPurl: 'breast-cancer',
				interCodeOrPurl: 'C1111,C2222',
				type: 'treatment',
			};
			const actual = getParamsForRoute(COMMON_DATA, COMMON_RPM);

			expect(actual).toEqual(expected);
		});

		it('throws on unexpected type', () => {
			expect(() => {
				getParamsForRoute(
					[COMMON_DATA[0]],
					[
						{
							paramName: 'codeOrPurl',
							textReplacementKey: 'disease',
							type: 'foo-bar',
						},
					]
				);
			}).toThrow('Unknown parameter type foo-bar');
		});
	});

	describe('getAnalyticsParamsForRoute', () => {
		it('works with all types', () => {
			const expected = {
				diseaseName: 'breast cancer',
				interventionName: 'my test label',
				trialType: 'treatment',
			};
			const actual = getAnalyticsParamsForRoute(COMMON_DATA, COMMON_RPM);

			expect(actual).toEqual(expected);
		});

		it('throws on unexpected type', () => {
			expect(() => {
				getParamsForRoute(
					[COMMON_DATA[0]],
					[
						{
							paramName: 'codeOrPurl',
							textReplacementKey: 'disease',
							type: 'foo-bar',
						},
					]
				);
			}).toThrow('Unknown parameter type foo-bar');
		});
	});
});
