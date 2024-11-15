import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Fieldset from '../../atomic/Fieldset';
import { Autocomplete } from '../../atomic';
import { getLeadOrgAction } from '../../../store/actionsV2';
import { useAppSettings } from '../../../store/store.js';
import {
	createTermDataFromArrayObj,
	matchItemToTerm,
	sortItems,
} from '../../../utilities';

const LeadOrganization = ({ handleUpdate }) => {
	const dispatch = useDispatch();
	const { leadOrg } = useSelector((store) => store.form);
	const { leadorgs = {} } = useSelector((store) => store.cache);
	// Forcibly limit results returned from api as there is currently
	// no way to limit aggregate results returned.
	const lead_org = leadorgs.aggregations
		? createTermDataFromArrayObj(
				leadorgs.aggregations.lead_org.slice(0, 10),
				'key'
		  )
		: [];

	const [orgName, setOrgName] = useState({ value: leadOrg.term });
	const [{ helpUrl }] = useAppSettings();

	useEffect(() => {
		if (orgName.value.length > 2) {
			dispatch(getLeadOrgAction({ searchText: orgName.value }));
		}
	}, [orgName, dispatch]);

	return (
		<Fieldset
			id="lead_organization"
			legend="Lead Organization"
			helpUrl={helpUrl + '#leadorganization'}>
			<Autocomplete
				label="Lead organization"
				labelHidden
				inputHelpText="Search by lead organization."
				value={orgName.value}
				inputProps={{ id: 'lo', placeholder: 'Organization name' }}
				wrapperStyle={{ position: 'relative', display: 'inline-block' }}
				items={lead_org}
				getItemValue={(item) => item.term}
				shouldItemRender={matchItemToTerm}
				sortItems={sortItems}
				onChange={(event, value) => {
					handleUpdate('leadOrg', { term: value, termKey: value });
					setOrgName({ value });
				}}
				onSelect={(value, item) => {
					handleUpdate('leadOrg', item);
					setOrgName({ value: item.term });
				}}
				renderMenu={(children) => (
					<div className="cts-autocomplete__menu --leadOrg">
						{orgName.value.length > 2 ? (
							lead_org.length ? (
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

LeadOrganization.propTypes = {
	handleUpdate: PropTypes.func,
};

export default LeadOrganization;
