import React from 'react';
import PropTypes from 'prop-types';
import { YoutubeVideoPlayer } from '../..';

const FigureCgovVideo = ({ videoId, videoTitle, children, classes }) => {
	return (
		<figure className={classes}>
			<YoutubeVideoPlayer youtubeId={videoId} videoTitle={videoTitle} />
			{children && (
				<figcaption className="caption-container no-resize">
					{children}
				</figcaption>
			)}
		</figure>
	);
};

FigureCgovVideo.propTypes = {
	videoId: PropTypes.string,
	videoTitle: PropTypes.string,
	children: PropTypes.node,
	classes: PropTypes.string,
};

export default FigureCgovVideo;
