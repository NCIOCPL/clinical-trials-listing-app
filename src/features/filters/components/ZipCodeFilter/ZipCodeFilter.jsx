import PropTypes from 'prop-types';
import React from 'react';
import { FILTER_CONFIG } from '../../config/filterConfig';
import FilterGroup from '../FilterGroup';
import { useState } from 'react';
// import { useTracking } from 'react-tracking';

const ZipCodeFilter = ({ zipCode, radius, onZipCodeChange, onRadiusChange }) => {
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
			<FilterGroup title="Location by Zip Code">
				<input type="text" className="usa-input form-control" placeholder="Enter U.S. Zip Code" value={zipCode} onChange={onZipCodeChange} maxLength={5} />
				{error && (
					<div id="zip-error" className="zip-code-filter__error">
						{error}
					</div>
				)}
			</FilterGroup>

			<FilterGroup title={FILTER_CONFIG.radius.title}>
				<div className="usa-combo-box">
					<select className="usa-select usa-combo-box__select form-control" value={radius || (zipCode ? '100' : '')} onChange={onRadiusChange} disabled={!zipCode}>
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
};

export default ZipCodeFilter;
