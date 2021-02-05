import React from 'react';
import { render, fireEvent, wait, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactTestUtils from 'react-dom/test-utils';
import AudioPlayer from '../';

describe('<AudioPlayer /> component', () => {
	afterEach(cleanup);

	it('creates an HTML5 audio element', () => {
		const { container } = render(<AudioPlayer audioSrc="mock.mp3" />);
		expect(container.querySelector('audio')).toBeInTheDocument();
		expect(container.querySelector('audio')).toHaveAttribute('preload', 'none');
	});

	it('renders a button with screenreader text', () => {
		const { container } = render(<AudioPlayer audioSrc="mock.mp3" />);
		expect(container.querySelector('span.show-for-sr')).toBeInTheDocument();
	});

	it('has spanish screenreader text if language is specified as spanish', () => {
		const { container } = render(<AudioPlayer audioSrc="mock.mp3" lang="es" />);
		expect(container.querySelector('span.show-for-sr')).toHaveTextContent(
			'escuchar la pronunciación'
		);
	});

	it('shows error state when audio throws an error', async () => {
		const rejectStub = jest
			.spyOn(window.HTMLMediaElement.prototype, 'play')
			.mockRejectedValue(
				new Error({
					name: 'NotSupportedError',
					message: 'The element has no supported sources.',
				})
			);
		const { container } = render(<AudioPlayer audioSrc="mock.mp3" />);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(rejectStub).toBeCalled();
	});

	it('plays the specified file', async () => {
		const playStub = jest
			.spyOn(window.HTMLMediaElement.prototype, 'play')
			.mockResolvedValue(true);

		const { container } = render(<AudioPlayer audioSrc="mock.mp3" />);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(playStub).toHaveBeenCalled();
	});

	it('pauses playback if file is playing', async () => {
		const playStub = jest
			.spyOn(window.HTMLMediaElement.prototype, 'play')
			.mockResolvedValue(true);

		const pauseStub = jest
			.spyOn(window.HTMLMediaElement.prototype, 'pause')
			.mockResolvedValue(true);

		const { container } = render(<AudioPlayer audioSrc="mock.mp3" />);
		fireEvent.click(container.querySelector('button'));
		await wait();
		expect(playStub).toHaveBeenCalled();
		fireEvent.click(container.querySelector('button'));
		fireEvent.pause(container.querySelector('audio'));
		await wait();
		expect(pauseStub).toHaveBeenCalled();
	});

	it("fires tracking event when 'ended' event occurs", () => {
		const mockTrackingFn = jest.fn();
		const { container } = render(
			<AudioPlayer audioSrc="mock.mp3" tracking={mockTrackingFn} />
		);
		ReactTestUtils.Simulate.ended(container.querySelector('audio'));
		expect(mockTrackingFn).toBeCalled();
	});
});
