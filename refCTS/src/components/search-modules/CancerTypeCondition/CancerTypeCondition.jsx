import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Fieldset, Autocomplete, InputLabel } from '../../atomic';
import {
	getFindingsAction,
	getMainTypeAction,
	getSubtypesAction,
	getStagesAction,
} from '../../../store/actionsV2';
import { useCachedValues } from '../../../hooks';
import { sortItemsByName } from '../../../utilities';
import { useAppSettings } from '../../../store/store.js';
import './CancerTypeCondition.scss';

require('../../../polyfills/closest');

const CancerTypeCondition = ({ handleUpdate }) => {
	const dispatch = useDispatch();
	const [searchText, setSearchText] = useState({ value: '' });
	const [{ helpUrl }] = useAppSettings();

	//store values
	const {
		cancerType = { codes: [] },
		cancerTypeModified,
		subtypes = [],
		subtypeModified,
		stages = [],
		stagesModified,
		findings = [],
	} = useSelector((store) => store.form);
	//typeahead states
	const [subtype, setSubtype] = useState({ value: '' });
	const [stage, setStage] = useState({ value: '' });
	const [sideEffects, setSideEffects] = useState({ value: '' });
	const [ctMenuOpen, setCtMenuOpen] = useState(false);
	const [subtypeOptions, setSubtypeOptions] = useState([]);
	const [stageOptions, setStageOptions] = useState([]);
	const [findingsOptions, setFindingsOptions] = useState([]);

	const { maintypeOptions = [] } = useCachedValues(['maintypeOptions']);

	const cache = useSelector((store) => store.cache);
	const ctButton = useRef();
	// we refactored how refining search is handled on results page
	// therefore the correct way is to pull refineSearch from location object
	const { state: locationState } = useLocation();
	const { refineSearch } = locationState || {};

	const focusCTButton = () => ctButton.current.blur();

	useEffect(() => {
		if (
			cache['subtypeOptions'] ||
			cache['stageOptions'] ||
			cache['findingsOptions']
		) {
			populateSubmenus();
		}
	}, [cache]);

	const populateSubmenus = () => {
		setSubtypeOptions(cache['subtypeOptions']?.data);
		setStageOptions(cache['stageOptions']?.data);
		setFindingsOptions(cache['findingsOptions']?.data);
	};

	const menuDropdown = document.getElementById('NCI-CTS-root');

	const outsideClickListener = (event) => {
		if (
			document.getElementById('ctMenu') &&
			!document.getElementById('ctMenu').contains(event.target) &&
			ctMenuOpen
		) {
			setCtMenuOpen(false);
			removeClickListener();
		}
	};

	const removeClickListener = () => {
		menuDropdown.removeEventListener('click', outsideClickListener);
	};

	// Retrieval of main types is triggered by expanding the cancer type dropdown
	useEffect(() => {
		// if maintypes is essentially empty, fetch mainTypes
		if (maintypeOptions.length < 1 && ctMenuOpen) {
			dispatch(getMainTypeAction());
		}

		if (ctMenuOpen) {
			document.getElementById('ct-searchTerm').focus();
			menuDropdown.addEventListener('click', outsideClickListener);
		} else {
			removeClickListener();
		}
		if (cancerType.codes.length > 0 && !refineSearch) {
			dispatch(getSubtypesAction(cancerType.codes));
			dispatch(getStagesAction(cancerType.codes));
			dispatch(getFindingsAction(cancerType.codes));
		}
	}, [ctMenuOpen, dispatch]);

	// onMount check to see if in refine SearchMode.
	useEffect(() => {
		if (maintypeOptions.length > 0 && refineSearch) {
			initRefineSearch();
		}
	}, []);

	// in case it hasn't come back by this time
	useEffect(() => {
		if (
			cache['maintypeOptions'] &&
			cache['maintypeOptions'].data.length > 0 &&
			refineSearch
		) {
			initRefineSearch();
		}
	}, [cache['maintypeOptions']]);

	const retrieveDescendents = (cacheKey, diseaseCodes) => {
		dispatch(getSubtypesAction(diseaseCodes));
		dispatch(getFindingsAction(diseaseCodes));
		dispatch(getStagesAction(diseaseCodes));
	};

	const initRefineSearch = () => {
		if (cancerTypeModified) {
			if (cancerType.type.length > 0 && cancerType.type.includes('maintype')) {
				//if it has a maintype, primary is already set!
				// just retrieve descendents
				//switch off refineSearch
				handleUpdate('refineSearch', false);
				retrieveDescendents(cancerType.codes[0], cancerType.codes);
			} else {
				// use the parentDisease ID to select the primary cancer type
				let parentCancer = cache['maintypeOptions'].data.find(
					({ codes }) => codes[0] === cancerType.parentDiseaseID[0]
				);

				if (parentCancer) {
					retrieveDescendents(parentCancer.codes[0], parentCancer.codes);
				} else {
					//codes don't match up!  Handle error
					// TODO: handle error (unrecognizable maintype)
				}

				// send basic selection to its proper place
				if (cancerType.type.includes('subtype')) {
					// always set as subtype even if also a stage
					handleUpdate('subtypes', [...subtypes, cancerType]);
					handleUpdate('subtypeModified', true);
				} else if (cancerType.type.includes('stage')) {
					handleUpdate('stages', [...stages, cancerType]);
					handleUpdate('stagesModified', true);
				}
				// now set cancerType to be the parent cancer
				handleUpdate('cancerType', parentCancer);
			}
		}
	};

	const matchItemToTerm = (item, value) => {
		return item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1;
	};

	const filterSelectedItems = (items = [], selections = []) => {
		if (!items.length || !selections.length) {
			return items;
		}
		return items.filter(
			(item) => !selections.find((selection) => selection.name === item.name)
		);
	};

	const ctSelectButtonDisplay =
		cancerType.codes.length === 0 ? 'All' : cancerType.name;

	const handleCTSelectToggle = () => {
		handleUpdate('cancerTypeModified', false);
		setCtMenuOpen(!ctMenuOpen);
	};

	const handleCTSelect = (value, item) => {
		handleUpdate('cancerType', item);
		retrieveDescendents(item.codes[0], item.codes);
		handleUpdate('subtypes', []);
		handleUpdate('stages', []);
		handleUpdate('findings', []);
		handleUpdate('subtypeModified', false);
		handleUpdate('stagesModified', false);
		setCtMenuOpen(false);
		removeClickListener();
		setSearchText({ value: '', codes: null });
		focusCTButton();
	};

	return (
		<Fieldset
			id="type"
			legend="Cancer Type/Condition"
			helpUrl={helpUrl + '#cancertype'}
			classes="cancer-type-condition">
			<p>
				Select a cancer type/condition, then include subtypes, stages or other
				attributes, if applicable.
			</p>

			<div className="ct-select">
				<InputLabel label="Primary Cancer Type/Condition" htmlFor="ct" />
				<button
					ref={ctButton}
					id="ct-btn"
					className={`ct-select__button faux-select ${
						cancerTypeModified ? '--modified' : ''
					}`}
					type="button"
					onClick={handleCTSelectToggle}
					aria-label="Click to select specific cancer type"
					aria-haspopup={true}
					aria-controls=""
					aria-expanded={ctMenuOpen}>
					{ctSelectButtonDisplay}
				</button>
				<div
					id="ctMenu"
					className={`ct-select__menu ${ctMenuOpen ? 'open' : ''}`}>
					<Autocomplete
						id="ct-searchTerm"
						label="Primary Cancer Type/Condition"
						value={searchText.value}
						modified={cancerTypeModified}
						inputClasses="faux-select"
						inputProps={{ placeholder: 'Start typing to narrow options below' }}
						labelHidden={true}
						wrapperStyle={{ position: 'relative', display: 'inline-block' }}
						open={true}
						items={maintypeOptions.data ? maintypeOptions.data : []}
						getItemValue={(item) => item.name}
						shouldItemRender={matchItemToTerm}
						onChange={(event, value) => {
							setSearchText({ value });
						}}
						onSelect={(value, item) => {
							handleCTSelect(value, item);
						}}
						renderMenu={(children) => (
							<div className="cts-autocomplete__menu --ct">
								{children.length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No results found
									</div>
								)}
							</div>
						)}
						renderItem={(item, isHighlighted) => (
							<div
								className={`cts-autocomplete__menu-item ${
									isHighlighted ? 'highlighted' : ''
								}`}
								key={item.codes[0] || 'all'}>
								{item.name}
							</div>
						)}
					/>
				</div>
				<input type="hidden" id="ct" name="ct" value={cancerType.name} />
			</div>

			{cancerType.codes.length > 0 && (
				<div className="subsearch">
					<Autocomplete
						id="st"
						label="Subtype"
						value={subtype.value}
						modified={subtypeModified}
						inputProps={{ placeholder: 'Start typing to select a subtype' }}
						inputHelpText="More than one selection may be made."
						items={filterSelectedItems(subtypeOptions, subtypes)}
						getItemValue={(item) => item.name}
						shouldItemRender={matchItemToTerm}
						sortItems={sortItemsByName}
						onChange={(event, value) => {
							setSubtype({ value });
							handleUpdate('subtypeModified', false);
						}}
						onSelect={(value) => {
							handleUpdate('subtypes', [
								...subtypes,
								subtypeOptions.find(({ name }) => name === value),
							]);
							setSubtype({ value: '' });
						}}
						multiselect={true}
						chipList={subtypes}
						onChipRemove={(e) => {
							let newChips = subtypes.filter((item) => item.name !== e.label);
							handleUpdate('subtypes', [...newChips]);
						}}
						renderMenu={(children) => (
							<div className="cts-autocomplete__menu --subtype">
								{children.length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No available options based on your previous selections
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

					<Autocomplete
						id="stg"
						label="Stage"
						value={stage.value}
						modified={stagesModified}
						inputProps={{ placeholder: 'Start typing to select a stage' }}
						inputHelpText="More than one selection may be made."
						items={filterSelectedItems(stageOptions, stages)}
						getItemValue={(item) => item.name}
						shouldItemRender={matchItemToTerm}
						sortItems={sortItemsByName}
						onChange={(event, value) => {
							setStage({ value });
							handleUpdate('stagesModified', false);
						}}
						onSelect={(value) => {
							handleUpdate('stages', [
								...stages,
								stageOptions.find(({ name }) => name === value),
							]);
							setStage({ value: '' });
						}}
						multiselect={true}
						chipList={stages}
						onChipRemove={(e) => {
							let newChips = stages.filter((item) => item.name !== e.label);
							handleUpdate('stages', [...newChips]);
						}}
						renderMenu={(children) => (
							<div className="cts-autocomplete__menu --stage">
								{children.length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No available options based on your previous selections
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

					<Autocomplete
						id="fin"
						label="Side Effects/Biomarkers/Participant Attributes"
						value={sideEffects.value}
						inputProps={{ placeholder: 'Examples: Nausea, BRCA1' }}
						inputHelpText="More than one selection may be made."
						items={filterSelectedItems(findingsOptions, findings)}
						getItemValue={(item) => item.name}
						shouldItemRender={matchItemToTerm}
						sortItems={sortItemsByName}
						onChange={(event, value) => setSideEffects({ value })}
						onSelect={(value) => {
							handleUpdate('findings', [
								...findings,
								findingsOptions.find(({ name }) => name === value),
							]);
							setSideEffects({ value: '' });
						}}
						multiselect={true}
						chipList={findings}
						onChipRemove={(e) => {
							let newChips = findings.filter((item) => item.name !== e.label);
							handleUpdate('findings', [...newChips]);
						}}
						renderMenu={(children) => (
							<div className="cts-autocomplete__menu --fin">
								{children.length ? (
									children
								) : (
									<div className="cts-autocomplete__menu-item">
										No available options based on your previous selections
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
				</div>
			)}
		</Fieldset>
	);
};
CancerTypeCondition.propTypes = {
	handleUpdate: PropTypes.func,
};

export default CancerTypeCondition;
