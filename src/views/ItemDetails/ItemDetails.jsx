import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Spinner } from '../../components';
import { useCustomQuery } from '../../hooks';
import { getSampleCallResults } from '../../services/api/actions';

const ItemDetails = () => {
	const { id } = useParams();
	const [doneLoading, setDoneLoading] = useState(false);
	const [stateSampleCallResults, setStateSampleCallResults] = useState();
	// Sample fetch results for the item
	const sampleCallResults = useCustomQuery(getSampleCallResults({ id }));

	// TODO: Metadata
	useEffect(() => {
		// Set results returned from fetch in state once fetch is done
		// and fetch payload is defined
		if (!sampleCallResults.loading && sampleCallResults.payload) {
			setStateSampleCallResults(sampleCallResults.payload);
			setDoneLoading(true);
		}
	}, [sampleCallResults.loading, sampleCallResults.payload]);

	const renderHelmet = () => {
		let retHead = <></>;
		return retHead;
	};

	return (
		<>
			{renderHelmet()}
			{doneLoading && (
				<div>THE ITEM CONTENTS WOULD GO HERE. OR 404.</div>

			)}
			{!doneLoading && <Spinner />}
		</>
	);
};

export default ItemDetails;
