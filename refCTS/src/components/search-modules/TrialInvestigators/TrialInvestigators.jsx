import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, Autocomplete } from '../../atomic';
import { createTermDataFromArrayObj } from '../../../utilities';
import { searchTrialInvestigatorsAction } from '../../../store/actionsV2';
import { matchItemToTerm, sortItems } from '../../../utilities';
import { useAppSettings } from '../../../store/store.js';

const TrialInvestigators = ({ handleUpdate }) => {
	const dispatch = useDispatch();

	//store vals
	const { investigator } = useSelector((store) => store.form);
	const { tis = {} } = useSelector((store) => store.cache);

	const [{ helpUrl }] = useAppSettings();

	const [tiName, setTiName] = useState({ value: investigator.term });
	const tisAggregations = tis.aggregations
		? createTermDataFromArrayObj(tis.aggregations.principal_investigator, 'key')
		: [];

	useEffect(() => {
		if (tiName.value.length > 2) {
			dispatch(searchTrialInvestigatorsAction({ searchText: tiName.value }));
		}
	}, [tiName, dispatch]);

	return (
		<Fieldset
			id="trialInvestigators"
			legend="Trial Investigators"
			helpUrl={helpUrl + '#trialinvestigators'}>
			<Autocomplete
				id="inv"
				label="Trial investigators"
				labelHidden
				inputHelpText="Search by trial investigator."
				value={tiName.value}
				inputProps={{ id: 'investigator', placeholder: 'Investigator name' }}
				wrapperStyle={{ position: 'relative', display: 'inline-block' }}
				items={tisAggregations}
				getItemValue={(item) => item.term}
				shouldItemRender={matchItemToTerm}
				sortItems={sortItems}
				onChange={(event, value) => {
					handleUpdate('investigator', { term: value, termKey: value });
					setTiName({ value });
				}}
				onSelect={(value, item) => {
					handleUpdate('investigator', item);
					setTiName({ value });
				}}
				renderMenu={(children) => (
					<div className="cts-autocomplete__menu --trialInvestigators">
						{tiName.value.length > 2 ? (
							tisAggregations.length ? (
								children
							) : (
								<div className="cts-autocomplete__menu-item">
									No results found
								</div>
							)
						) : (
							<div className="cts-autocomplete__menu-item">
								Please enter 3 or more characters
							</div>
						)}
					</div>
				)}
				renderItem={(item, isHighlighted) => (
					<div
						className={`cts-autocomplete__menu-item ${
							isHighlighted ? 'highlighted' : ''
						}`}
						key={item.termKey}>
						{item.term}
					</div>
				)}
			/>
		</Fieldset>
	);
};
TrialInvestigators.propTypes = {
	handleUpdate: PropTypes.func,
};
export default TrialInvestigators;
