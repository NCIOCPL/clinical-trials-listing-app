/* global YT */
/* eslint no-undef: "error" */
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import "./youtube-video-player.scss";

const YoutubeVideoPlayer = ({
	youtubeId,
	videoTitle,
	trackVideoLoad = () => {},
}) => {
	const [swapped, setSwapped] = useState(false);

	useEffect(() => {
		let tag = document.createElement('script');
		tag.src = 'https://www.youtube.com/iframe_api';
		document.body.appendChild(tag);
	}, []);

	useEffect(() => {
		if (swapped) {
			// Use Youtube IFrame API to load video
			if (window.YT) {
				onYouTubeIframeAPIReady();
			}
		}
	}, [swapped, youtubeId]);

	const loadVideo = () => {
		setSwapped(true);
		trackVideoLoad();
	};

	function onYouTubeIframeAPIReady() {
		new YT.Player('nci-video-player', {
			height: '390',
			width: '640',
			videoId: youtubeId,
			events: {
				onReady: onPlayerReady,
			},
		});
	}

	function onPlayerReady(event) {
		// Force video play
		event.target.playVideo();
	}

	const renderPlaceholder = () => {
		return swapped ? (
			<div id="nci-video-player">
				{!window.YT && <span>An error occurred. Please try again later.</span>}
			</div>
		) : (
			<button
				className="video-preview--container"
				onClick={loadVideo}
				tabIndex="0">
				<img
					src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
					alt={videoTitle}
					className="video-preview--preview-img"
				/>
				<div className="video-preview--play-button">
					<svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
						<path
							className="play-button--bg"
							d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
							fill="#212121"
							fillOpacity="0.8"
						/>
						<path d="M 45,24 27,14 27,34" fill="#fff" />
					</svg>
				</div>
				<p>
					<span className="show-for-sr">click to view video titled </span>
					{videoTitle}
				</p>
			</button>
		);
	};

	return (
		<div className="youtube-video-player flex-video widescreen rendered">
			{renderPlaceholder()}
		</div>
	);
};

YoutubeVideoPlayer.propTypes = {
	youtubeId: PropTypes.string,
	videoTitle: PropTypes.string,
	trackVideoLoad: PropTypes.func,
};

export default YoutubeVideoPlayer;
