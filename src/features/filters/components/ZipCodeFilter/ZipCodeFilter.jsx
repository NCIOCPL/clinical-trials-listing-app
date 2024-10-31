import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTracking } from 'react-tracking';
import './ZipCodeFilter.scss';

const ZipCodeFilter = ({ zipCode, radius, onZipCodeChange, onRadiusChange, disabled = false }) => {
	const [error, setError] = useState('');
	const tracking = useTracking();

	const validateZipCode = (value) => {
		if (value && !/^\d{5}$/.test(value)) {
			setError('Please enter a valid 5-digit ZIP code');
			return false;
		}
		setError('');
		return true;
	};

	const handleZipCodeChange = (e) => {
		const value = e.target.value;
		if (validateZipCode(value)) {
			onZipCodeChange(value);
			tracking.trackEvent({
				type: 'Other',
				event: 'TrialListingApp:Filter:ZipCode',
				value,
			});
		}
	};

	const handleRadiusChange = (e) => {
		const value = e.target.value;
		onRadiusChange(value);
		tracking.trackEvent({
			type: 'Other',
			event: 'TrialListingApp:Filter:Radius',
			value,
		});
	};

	return (
		<div className="zip-code-filter">
			<div className="zip-code-filter__inputs">
				<div className="zip-code-filter__field">
					<input type="text" className={`zip-code-filter__zip ${error ? 'has-error' : ''}`} value={zipCode} onChange={handleZipCodeChange} placeholder="Enter ZIP code" maxLength={5} disabled={disabled} aria-invalid={!!error} aria-describedby={error ? 'zip-error' : undefined} />
					{error && (
						<div id="zip-error" className="zip-code-filter__error">
							{error}
						</div>
					)}
				</div>

				<select className="zip-code-filter__radius" value={radius || ''} onChange={handleRadiusChange} disabled={disabled || !zipCode}>
					<option value="">Select radius</option>
					<option value="5">5 miles</option>
					<option value="10">10 miles</option>
					<option value="25">25 miles</option>
					<option value="50">50 miles</option>
					<option value="100">100 miles</option>
				</select>
			</div>
		</div>
	);
};

ZipCodeFilter.propTypes = {
	zipCode: PropTypes.string.isRequired,
	radius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onZipCodeChange: PropTypes.func.isRequired,
	onRadiusChange: PropTypes.func.isRequired,
	disabled: PropTypes.bool,
};

export default ZipCodeFilter;
