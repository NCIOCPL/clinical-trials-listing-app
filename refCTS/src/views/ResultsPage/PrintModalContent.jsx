import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { usePrintApi } from '../../hooks';
import { buildQueryString, hasSCOBeenUpdated } from '../../utilities';
import { useAppSettings } from '../../store/store.js';

const queryString = require('query-string');

const PrintModalContent = ({ selectedList, searchCriteriaObject }) => {
	// in dev use
	const [{ printApiBase, searchUrl, advancedSearchUrl }] = useAppSettings();
	const genCacheUrl = `${printApiBase}/GenCache`;
	const printDisplayUrl = `${printApiBase}/Display`;
	const queryParams = buildQueryString(searchCriteriaObject);

	const { rl } = queryParams;

	const new_search_link = rl === 1 ? searchUrl : advancedSearchUrl;

	const trial_ids = selectedList.map(({ id }) => id);

	const link_template = `${searchUrl}/v?${queryString.stringify(
		queryParams
	)}&id=<TRIAL_ID>`;

	const search_criteria = !hasSCOBeenUpdated(searchCriteriaObject)
		? searchCriteriaObject
		: null;

	const [{ data, isLoading, isError, doPrint }] = usePrintApi(
		{ trial_ids, link_template, new_search_link, search_criteria },
		genCacheUrl
	);

	// on component mount, check for selected IDs,
	useEffect(() => {
		if (selectedList.length > 0 && selectedList.length <= 100) {
			doPrint();
		}
	}, [selectedList]);

	useEffect(() => {
		if (!isLoading && data.printID) {
			//success
			window.location.href = `${printDisplayUrl}?printid=${data.printID}`;
		}
	}, [isLoading, isError, data]);

	const renderNoItemsSelected = () => (
		<>
			<div className="icon-warning" aria-hidden="true">
				!
			</div>
			<p>
				You have not selected any trials. Please select at least one trial to
				print.
			</p>
		</>
	);
	const renderPrintError = () => (
		<>
			<div className="icon-warning" aria-hidden="true">
				!
			</div>
			<p>
				An error occurred while generating your document. Please try again
				later.
			</p>
		</>
	);

	const renderTooManyItemsSelected = () => (
		<>
			<div className="icon-warning" aria-hidden="true">
				!
			</div>
			<p>
				You have selected the maximum number of clinical trials (100) that can
				be printed at one time.
			</p>
			<p>
				Print your current selection and then return to your search results to
				select more trials to print.
			</p>
		</>
	);

	const renderPrintInterstitial = () => (
		<>
			<div className="spinkit spinner">
				<div className="dot1"></div>
				<div className="dot2"></div>
			</div>
			<p>
				You will automatically be directed to your print results in just a
				moment...
			</p>
		</>
	);

	return (
		<>
			{selectedList.length === 0 ? (
				renderNoItemsSelected()
			) : selectedList.length >= 100 ? (
				renderTooManyItemsSelected()
			) : (
				<>
					{!isError ? (
						<>{renderPrintInterstitial()}</>
					) : (
						<>{renderPrintError()}</>
					)}
				</>
			)}
		</>
	);
};
PrintModalContent.propTypes = {
	selectedList: PropTypes.array.isRequired,
	searchCriteriaObject: PropTypes.object,
};
export default PrintModalContent;
