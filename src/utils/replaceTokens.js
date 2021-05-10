/**
 * Prototype code is at:
 * https://codereview.stackexchange.com/questions/159469/helper-functions-to-perform-simple-token-replacements-in-a-string
 */

//  Token replacer function"
const TokenParser = function () {};

/**
    A helper function to process and replace
    all tokens within a string.
*/
TokenParser.replaceTokens = function (Str, Context) {
	return TokenParser.parseTokens(TokenParser.extractTokens(Str), Context, Str);
};

/**
    Will match all tokens "{some_token}, {some_token}
    within a body of text, extracting all 
    matches ( Tokens )
    Will return an empty array, if no tokens are found.
*/
TokenParser.extractTokens = function (incomingString) {
	var tokens = [];
	incomingString.replace(/{(\w+)(}|\s{1})/g, (_, token) => {
		tokens.push(token);
	});
	return tokens;
};

/**
    Will loop through a set of tokens, replacing all matches within a 
    string body, with the values supplied by the context. 
*/
TokenParser.parseTokens = function (Tokens, Context, incomingString) {
	Tokens.forEach(function (token) {
		if (token !== null && Context[token] !== undefined) {
			incomingString = TokenParser.parseToken(
				token,
				Context[token],
				incomingString
			);
		} else if (token !== null && Context[token] === undefined) {
			incomingString = TokenParser.parseToken(token, '', incomingString);
		}
	});
	return incomingString;
};

TokenParser.parseToken = function (Token, Value, Str) {
	let regex = new RegExp('({{|{)(' + Token + ')(}}|}|/s)?', 'g');
	return Str.replace(regex, Value);
};

export { TokenParser };
