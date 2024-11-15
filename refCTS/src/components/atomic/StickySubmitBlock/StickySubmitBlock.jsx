import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTracking } from 'react-tracking';
import { useAppSettings } from '../../../store/store.js';

import './StickySubmitBlock.scss';

import { clearForm } from '../../../store/actions';

const StickySubmitBlock = ({ sentinelRef, onSubmit, formType }) => {
	const dispatch = useDispatch();
	const stickyEl = useRef(null);
	const tracking = useTracking();
	const [{ analyticsName }] = useAppSettings();

	useEffect(() => {
		intObserver.observe(stickyEl.current);
	}, []);

	const options = {
		root: sentinelRef,
		threshold: 1.0,
	};

	const callback = function (entries) {
		entries.forEach((entry) => {
			if (entry.isIntersecting && entry.intersectionRatio === 1) {
				entry.target.classList.remove('--sticky');
			} else if (window.scrollY < entry.target.offsetTop) {
				entry.target.classList.add('--sticky');
			}
		});
	};

	const handleClick = (e) => {
		onSubmit(e);
	};

	const handleClearForm = () => {
		// Track before clearing please...
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'ClinicalTrialsSearchApp:Other:ClearForm',
			analyticsName,
			linkName: 'clinicaltrials_advanced|clear',
			// Any additional properties fall into the "page.additionalDetails" bucket
			// for the event.
			formType,
		});

		dispatch(clearForm());
		window.history.replaceState({}, document.title);
		window.scrollTo(0, 0);
		window.location.reload(false);
	};

	const intObserver = new IntersectionObserver(callback, options);

	return (
		<div id="stickyAnchor" ref={stickyEl} className="sticky-block__anchor">
			<div className="sticky-block">
				<button
					type="submit"
					className="btn-submit faux-btn-submit"
					onClick={handleClick}>
					Find Trials
				</button>
				<button
					type="button"
					className="btn-submit clear-form"
					onClick={handleClearForm}>
					Clear Form
				</button>
			</div>
		</div>
	);
};

StickySubmitBlock.propTypes = {
	sentinelRef: PropTypes.node,
	onSubmit: PropTypes.func,
	formType: PropTypes.string,
};

StickySubmitBlock.defaultProps = {
	onSubmit: () => {},
};

export default StickySubmitBlock;
