import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Fieldset, Autocomplete } from '../../atomic';
import {
	getOtherInterventionsAction,
	searchDrugAction,
} from '../../../store/actionsV2';
import './DrugTreatment.scss';
import { useAppSettings } from '../../../store/store.js';

const DrugTreatment = ({ handleUpdate }) => {
	const placeholderText = 'Please enter 3 or more characters';
	const dispatch = useDispatch();

	//store vals
	const [{ helpUrl }] = useAppSettings();
	// list of selected drugs and treatments
	const { drugs, treatments } = useSelector((store) => store.form);

	// cached options lists for drugs and treatments
	const { drugOptions, treatmentOptions = {} } = useSelector(
		(store) => store.cache
	);

	const treatmentOptionsList = treatmentOptions.data || [];

	//input state
	const [drugVal, setDrugVal] = useState({ value: '' });
	const [treatmentVal, setTreatmentVal] = useState({ value: '' });
	const drugOptionsData = drugOptions?.data ? drugOptions.data : [];

	//based on drug field input
	useEffect(() => {
		if (drugVal.value.length > 2) {
			dispatch(searchDrugAction({ searchText: drugVal.value }));
		}
	}, [drugVal, dispatch]);

	//based on treatments field input
	useEffect(() => {
		if (treatmentVal.value.length > 2) {
			dispatch(getOtherInterventionsAction({ searchText: treatmentVal.value }));
		}
	}, [treatmentVal, dispatch]);

	const filterSelectedItems = (items = [], selections = []) => {
		if (!items.length || !selections.length) {
			return items;
		}
		const filteredItems = items.filter(
			(item) => !selections.find((selection) => selection.name === item.name)
		);
		return filteredItems;
	};

	const applyOptionsFilterAndFormatting = (searchVal, item, isHighlighted) => {
		const searchStr = new RegExp(
			'(^' + searchVal.value + '|\\s+' + searchVal.value + ')',
			'i'
		);
		const filteredSynonyms = Array.isArray(item.synonyms)
			? item.synonyms.filter((synonym) => synonym.match(searchStr))
			: [];
		const filteredSynonymsCount = filteredSynonyms.length;

		return (
			<div
				className={`cts-autocomplete__menu-item ${
					isHighlighted ? 'highlighted' : ''
				}`}
				key={item.codes[0]}>
				<div className="preferredName">
					{item.name}
					{item.category.indexOf('category') !== -1 ? ' (DRUG FAMILY)' : ''}
				</div>
				{filteredSynonymsCount > 0 && (
					<span className="synonyms">
						Other Names:{' '}
						<ol>
							{filteredSynonyms.map((synonym, i) => {
								return (
									<li
										key={i}
										dangerouslySetInnerHTML={{
											__html: synonym.match(searchStr)
												? synonym.replace(searchStr, `<strong>$&</strong>`)
												: synonym,
										}}></li>
								);
							})}
						</ol>
					</span>
				)}
			</div>
		);
	};

	return (
		<Fieldset
			id="drug-trtmt"
			legend="Drug/Treatment"
			helpUrl={helpUrl + '#drugtreatment'}>
			<p>Search for a specific drug or intervention.</p>

			<Autocomplete
				id="dt"
				label="Drug/Drug Family"
				inputHelpText="You can use the drug's generic or brand name. More than one selection may be made."
				value={drugVal.value}
				inputProps={{
					placeholder: 'Start typing to select drugs and/or drug families',
				}}
				items={filterSelectedItems(drugOptionsData, drugs)}
				getItemValue={(item) => item.name}
				shouldItemRender={() => true}
				onChange={(event, value) => setDrugVal({ value })}
				onSelect={(value) => {
					handleUpdate('drugs', [
						...drugs,
						drugOptionsData.find(({ name }) => name === value),
					]);
					setDrugVal({ value: '' });
				}}
				multiselect={true}
				chipList={drugs}
				onChipRemove={(e) => {
					let newChips = drugs.filter((item) => item.name !== e.label);
					handleUpdate('drugs', [...newChips]);
				}}
				renderMenu={(children) => {
					return (
						<div className="cts-autocomplete__menu --drugs">
							{drugVal.value.length > 2 ? (
								filterSelectedItems(drugOptionsData, drugs).length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No results found
									</div>
								)
							) : (
								<div className="cts-autocomplete__menu-item">
									{placeholderText}
								</div>
							)}
						</div>
					);
				}}
				renderItem={(item, isHighlighted) =>
					applyOptionsFilterAndFormatting(drugVal, item, isHighlighted)
				}
			/>

			<Autocomplete
				id="ti"
				label="Other Treatments"
				value={treatmentVal.value}
				inputProps={{ placeholder: 'Start typing to select other treatments' }}
				inputHelpText="More than one selection may be made."
				items={filterSelectedItems(treatmentOptionsList, treatments)}
				getItemValue={(item) => item.name}
				shouldItemRender={() => true}
				onChange={(event, value) => setTreatmentVal({ value })}
				onSelect={(value) => {
					handleUpdate('treatments', [
						...treatments,
						treatmentOptionsList.find(({ name }) => name === value),
					]);
					setTreatmentVal({ value: '' });
				}}
				multiselect={true}
				chipList={treatments}
				onChipRemove={(e) => {
					let newChips = treatments.filter((item) => item.name !== e.label);
					handleUpdate('treatments', [...newChips]);
				}}
				renderMenu={(children) => {
					return (
						<div className="cts-autocomplete__menu --drugs">
							{treatmentVal.value.length > 2 ? (
								filterSelectedItems(treatmentOptionsList, treatments).length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No results found
									</div>
								)
							) : (
								<div className="cts-autocomplete__menu-item">
									{placeholderText}
								</div>
							)}
						</div>
					);
				}}
				renderItem={(item, isHighlighted) =>
					applyOptionsFilterAndFormatting(treatmentVal, item, isHighlighted)
				}
			/>
		</Fieldset>
	);
};

DrugTreatment.propTypes = {
	handleUpdate: PropTypes.func,
};
export default DrugTreatment;
