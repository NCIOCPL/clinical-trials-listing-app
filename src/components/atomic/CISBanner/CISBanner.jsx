import React from 'react';
import PropTypes from 'prop-types';

import { useStateValue } from '../../../store/store';
import './CISBanner.scss';

const CISBanner = ({ onLiveHelpClick }) => {
	const [{ cisBannerImgUrlLarge, cisBannerImgUrlSmall, liveHelpUrl }] =
		useStateValue();

	const liveHelpClickHandler = (url) => {
		if (url !== null) {
			onLiveHelpClick(url);
		}
	};

	return (
		<div className="banner-cis">
			<button
				type="button"
				className="banner-cis__button"
				onClick={() => liveHelpClickHandler(liveHelpUrl)}>
				Chat Now
			</button>

			<picture>
				<source srcSet={cisBannerImgUrlSmall} media="(max-width: 640px)" />
				<source srcSet={cisBannerImgUrlLarge} />
				<img
					src={cisBannerImgUrlLarge}
					alt="Questions? Chat with an information specialist"
				/>
			</picture>
		</div>
	);
};

CISBanner.propTypes = {
	onLiveHelpClick: PropTypes.func,
};

export default CISBanner;
