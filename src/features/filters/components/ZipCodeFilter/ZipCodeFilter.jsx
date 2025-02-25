import PropTypes from 'prop-types';
import React from 'react';
import { FILTER_CONFIG } from '../../config/filterConfig';
import FilterGroup from '../FilterGroup';
import { useState } from 'react';
// import { useTracking } from 'react-tracking';

// eslint-disable-next-line react/prop-types
const ZipCodeFilter = ({ zipCode, radius, onZipCodeChange, onRadiusChange, onFocus, disabled }) => {
	const [error] = useState('');
	// const tracking = useTracking();
	//
	// const validateZipCode = (value) => {
	// 	if (value && !/^\d{5}$/.test(value)) {
	// 		setError('Please enter a valid 5-digit ZIP code');
	// 		return false;
	// 	}
	// 	setError('');
	// 	return true;
	// };
	//
	// const handleZipCodeChange = (e) => {
	// 	const value = e.target.value;
	// 	// if (validateZipCode(value)) {
	// 	// 	onZipCodeChange(value);
	// 	// 	tracking.trackEvent({
	// 	// 		type: 'Other',
	// 	// 		event: 'TrialListingApp:Filter:ZipCode',
	// 	// 		value,
	// 	// 	});
	// 	onZipCodeChange(value);
	// };

	// const handleRadiusChange = (e) => {
	// 	const value = e.target.value;
	// 	onRadiusChange(value);
	// 	tracking.trackEvent({
	// 		type: 'Other',
	// 		event: 'TrialListingApp:Filter:Radius',
	// 		value,
	// 	});
	// };
	//

	return (
		<>
			<FilterGroup title="Location by ZIP Code">
				<input
					id="zip-code-filter"
					name="zip-code"
					aria-label="Enter ZIP code"
					type="text"
					className="usa-input form-control"
					placeholder="Enter U.S. ZIP Code"
					value={zipCode}
					onChange={onZipCodeChange}
					onFocus={onFocus}
					maxLength={5}
					disabled={disabled}
				/>
				{error && (
					<div id="zip-error" className="zip-code-filter__error">
						{error}
					</div>
				)}
			</FilterGroup>

			<FilterGroup title={FILTER_CONFIG.radius.title}>
				<div className="usa-combo-box">
					<select
						id="radius-filter"
						name="radius"
						aria-label="Select search radius"
						className="usa-select usa-combo-box__select form-control"
						value={radius || (zipCode ? '100' : '')}
						onChange={onRadiusChange}
						onFocus={onFocus}
						disabled={disabled || !zipCode}
					>
						<option value="">Select</option>
						{FILTER_CONFIG.radius.options.map((option) => (
							<option key={option.id} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</FilterGroup>
		</>
	);
};

ZipCodeFilter.propTypes = {
	zipCode: PropTypes.string.isRequired,
	radius: PropTypes.string,
	onZipCodeChange: PropTypes.func.isRequired,
	onRadiusChange: PropTypes.func.isRequired,
	onFocus: PropTypes.func,
	disabled: PropTypes.bool,
};

export default ZipCodeFilter;
