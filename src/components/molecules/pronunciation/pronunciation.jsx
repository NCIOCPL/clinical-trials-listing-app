import PropTypes from 'prop-types';
import React from 'react';

import "./pronunciation.scss";

import { AudioPlayer } from '../../';

const Pronunciation = ({ pronunciationObj, language = 'en' }) => {
	return (
		<div className="pronunciation">
			{pronunciationObj.audio && (
				<div className="pronunciation__audio">
					<AudioPlayer audioSrc={pronunciationObj.audio} lang={language} />
				</div>
			)}
			{pronunciationObj.key && (
				<div
					className="pronunciation__key"
					data-testid="tid-term-def-pronunciation">
					{pronunciationObj.key}
				</div>
			)}
		</div>
	);
};

Pronunciation.propTypes = {
	language: PropTypes.oneOf(['en', 'es']),
	pronunciationObj: PropTypes.shape({
		key: PropTypes.string,
		audio: PropTypes.string,
	}).isRequired,
};

export default Pronunciation;
