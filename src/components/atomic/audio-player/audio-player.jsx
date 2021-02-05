/* eslint-disable jsx-a11y/media-has-caption */
import PropTypes from 'prop-types';
import React, { useRef, useState } from 'react';

import './audio-player.scss';

const AudioPlayer = ({ audioSrc, lang = 'en', tracking = () => {} }) => {
	const [playing, setPlaying] = useState(false);
	const [paused, setPaused] = useState(false);
	const [hasError, setHasError] = useState(false);
	const playerRef = useRef(null);

	const handlePlay = async () => {
		const player = playerRef.current;
		if (playing) {
			player.pause();
		} else {
			try {
				await player.play();
				trackPlaying();
			} catch (error) {
				setHasError(true);
			}
		}
	};

	const trackEnded = () => {
		tracking();
		setPlaying(false);
		setPaused(false);
	};

	const trackPlaying = () => {
		setPlaying(true);
		setPaused(false);
	};

	const trackPaused = (e) => {
		setPaused(true);
		setPlaying(false);
	};

	const srText =
		lang === 'es' ? 'escuchar la pronunciación' : 'Listen to pronunciation';

	return (
		<>
			<audio
				src={audioSrc}
				ref={playerRef}
				onEnded={trackEnded}
				onPause={trackPaused}
				preload="none" />

			<button
				type="button"
				className={`btnAudio ${playing ? 'playing' : ''}${
					paused ? 'paused' : ''
				}${hasError ? 'error' : ''}`}
				onClick={handlePlay}>
				<span className="show-for-sr">{srText}</span>
			</button>
		</>
	);
};

AudioPlayer.propTypes = {
	audioSrc: PropTypes.string,
	lang: PropTypes.string,
	tracking: PropTypes.func,
};

export default AudioPlayer;
