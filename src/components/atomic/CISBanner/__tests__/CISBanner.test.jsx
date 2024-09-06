import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import CISBanner from '../CISBanner';
import { useStateValue } from '../../../../store/store';

jest.mock('../../../../store/store');
let url;

describe('CISBanner test', () => {
	function onLiveHelpClickHandler(liveHelpUrl) {
		url = liveHelpUrl;
	}

	const defaultProps = {
		onLiveHelpClick: onLiveHelpClickHandler,
	};

	const cisBannerImgUrlLarge = '%PUBLIC_URL%/images/cts-cis-banner-xl.jpeg';
	const cisBannerImgUrlSmall = '%PUBLIC_URL%/images/cts-cis-banner-smartphone.jpeg';
	const liveHelpUrl = 'https://livehelp.cancer.gov/app/chat/chat_landing?_icf_22=92';
	const altText = 'Questions? Chat with an information specialist';

	useStateValue.mockReturnValue([
		{
			appId: 'mockAppId',
			cisBannerImgUrlLarge,
			cisBannerImgUrlSmall,
			liveHelpUrl,
		},
	]);

	it('CISBanner renders with correct button functionality and picture elements', function () {
		const { onLiveHelpClick } = defaultProps;

		render(<CISBanner onLiveHelpClick={onLiveHelpClick} />);

		const imgAlt = screen.getByAltText(altText);
		expect(imgAlt).toBeInTheDocument();

		const button = screen.getByRole('button');
		expect(button).toBeInTheDocument();
		fireEvent.click(button);
		expect(url).toEqual(liveHelpUrl);
	});
});
