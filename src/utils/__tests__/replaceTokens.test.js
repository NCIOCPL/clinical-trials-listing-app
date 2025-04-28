import { TokenParser } from '../index';

describe('Test various token related functions', () => {
	const testData = 'This sentence {{first_token}} is full {{second_token}} with tokens.';

	it('Extract all tokens', () => {
		const expected = ['first_token', 'second_token'];
		expect(TokenParser.extractTokens(testData)).toEqual(expected);
	});

	it('Replace all tokens with provided values', () => {
		const context = {
			first_token: 'first_value',
			second_token: 'second_value',
		};
		const result = TokenParser.replaceTokens(testData, context);
		const expected = 'This sentence first_value is full second_value with tokens.';
		expect(result).toEqual(expected);
	});

	it('Check if it finds tokens in a bad string and replaces them', () => {
		const badString = 'This sentence {{first_token is full {{second_token} with tokens.';
		const context = {
			first_token: 'first_value',
			second_token: 'second_value',
		};
		const result = TokenParser.replaceTokens(badString, context);
		const expected = 'This sentence first_value is full second_value with tokens.';
		expect(result).toEqual(expected);
	});

	it('Check if the token is not provided through context, it is removed from String', () => {
		const badString = 'This sentence {first_token}} is full {{second_token with tokens.';
		const context = { second_token: 'second_value' };
		const result = TokenParser.replaceTokens(badString, context);
		const expected = 'This sentence  is full second_value with tokens.';
		expect(result).toEqual(expected);
	});
});
