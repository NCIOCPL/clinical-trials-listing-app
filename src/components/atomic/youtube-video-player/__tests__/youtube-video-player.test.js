import React from 'react';
import {
	cleanup,
	fireEvent,
	render,
	screen,
	wait,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import YoutubeVideoPlayer from '..';

describe('<YoutubeVideoPlayer /> component', () => {
	const yid = 'fQwar_-QdiQ';

	function Player() {
		this.height = 390;
		this.width = 640;
		this.videoId = yid;
		this.events = {
			onReady: jest.fn(),
		};
	}
	const YTMock = {
		Player,
		PlayerState: {},
	};

	beforeEach(() => {
		Object.defineProperty(window, 'YT', { value: YTMock, writable: true });
	});

	afterEach(cleanup);

	it('creates a video preview container', () => {
		const { container } = render(<YoutubeVideoPlayer youtubeId={yid} />);
		expect(
			container.querySelector('.youtube-video-player')
		).toBeInTheDocument();
	});

	it('loads the youtube iframe placeholder after clicking on the button', async () => {
		const { container } = render(<YoutubeVideoPlayer youtubeId={yid} />);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(container.querySelector('#nci-video-player')).toBeInTheDocument();
	});

	it('calls a supplied tracking event on click', async () => {
		const mockTrackingFn = jest.fn();
		const { container } = render(
			<YoutubeVideoPlayer youtubeId={yid} trackVideoLoad={mockTrackingFn} />
		);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(mockTrackingFn).toHaveBeenCalled();
	});

	it('should show error message after clicking on the button and YT is not defined', async () => {
		Object.defineProperty(window, 'YT', { value: undefined, writable: true });
		render(<YoutubeVideoPlayer youtubeId={yid} />);
		fireEvent.click(screen.getByRole('button'));
		await wait();
		expect(
			screen.getByText('An error occurred. Please try again later.')
		).toBeInTheDocument();
	});
});
