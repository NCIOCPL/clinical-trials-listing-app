import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Fieldset, Autocomplete } from '../../atomic';
import { getDiseasesForTypeAheadAction } from '../../../store/actionsV2';
import { useAppSettings } from '../../../store/store.js';
import { sortItemsByName } from '../../../utilities';
import PropTypes from 'prop-types';

const CancerTypeKeyword = ({ handleUpdate }) => {
	const dispatch = useDispatch();
	const { keywordPhrases, cancerType } = useSelector((store) => store.form);
	const { diseases = {} } = useSelector((store) => store.cache);
	const diseaseList = diseases.data ? diseases.data : [];
	const [CTK, setCTK] = useState({
		value: cancerType.name ? cancerType.name : keywordPhrases,
	});
	const [{ helpUrl }] = useAppSettings();

	useEffect(() => {
		dispatch(getDiseasesForTypeAheadAction({ searchText: CTK.value }));
	}, [CTK, dispatch]);

	const matchItemToTerm = (item, value) => {
		return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
	};

	return (
		<Fieldset
			id="type"
			legend="Cancer Type/Keyword"
			helpUrl={
				helpUrl + '#how-to-find-clinical-trials-using-the-basic-search-form'
			}>
			<Autocomplete
				id="ctk"
				label="Cancer Type/Keyword"
				labelHidden
				value={CTK.value}
				inputProps={{
					placeholder: 'Start typing to select a cancer type or keyword',
				}}
				wrapperStyle={{ position: 'relative', display: 'inline-block' }}
				items={diseaseList}
				inputHelpText="Leave blank to search all cancer types or keywords."
				getItemValue={(item) => item.name}
				shouldItemRender={matchItemToTerm}
				sortItems={sortItemsByName}
				onChange={(event, value) => {
					setCTK({ value });
					handleUpdate('cancerType', { name: '', codes: [] });
					handleUpdate('keywordPhrases', value);
					handleUpdate('typeCode', {});
				}}
				onSelect={(value, item) => {
					setCTK({ value });
					handleUpdate('cancerType', item);
					handleUpdate('keywordPhrases', '');
				}}
				renderMenu={(children) => (
					<div className="cts-autocomplete__menu --q">
						{children.length ? (
							children
						) : (
							<div className="cts-autocomplete__menu-item">
								No available options found. Your search will be based on the
								text above.
							</div>
						)}
					</div>
				)}
				renderItem={(item, isHighlighted) => (
					<div
						className={`cts-autocomplete__menu-item ${
							isHighlighted ? 'highlighted' : ''
						}`}
						key={item.codes[0]}>
						{item.name}
					</div>
				)}
			/>
		</Fieldset>
	);
};
CancerTypeKeyword.propTypes = {
	handleUpdate: PropTypes.func,
};

export default CancerTypeKeyword;
