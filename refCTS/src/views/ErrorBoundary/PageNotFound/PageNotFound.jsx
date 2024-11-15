import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import TextInput from '../../../components/atomic/TextInput';
import { useAppSettings } from '../../../store/store';

const PageNotFound = () => {
	const [{ canonicalHost }] = useAppSettings();
	const [searchText, updateSearchText] = useState('');
	const tracking = useTracking();

	useEffect(() => {
		const pageTitle = 'Page Not Found';
		tracking.trackEvent({
			event: 'TrialListingApp:Load:PageNotFound',
			metaTitle: pageTitle,
			name: `${canonicalHost.replace(/^(http|https):\/\//, '')}${
				window.location.pathname
			}`,
			title: pageTitle,
			type: 'PageLoad',
		});
	}, []);

	const contentPar = [
		<>We can&apos;t find the page you&apos;re looking for.</>,
		<>
			Visit the <a href="https://www.cancer.gov">homepage</a>, browse by{' '}
			<a href="https://www.cancer.gov/types">cancer type</a>, or use the search
			below.
		</>,
		<>
			Have a question? <a href="https://www.cancer.gov/contact">Get in touch</a>
			.
		</>,
	];

	const executeSearch = (event) => {
		event.preventDefault();
		window.location = `https://www.cancer.gov/search/results?swKeyword=${searchText}`;
	};

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{'Page Not Found'}</title>
				<meta property="dcterms.subject" content="Error Pages" />
				<meta property="dcterms.type" content="errorpage" />
				<meta name="prerender-status-code" content="404" />
			</Helmet>
		);
	};

	const updateTextInput = (event) => {
		const { value } = event.target;
		updateSearchText(value);
	};

	return (
		<>
			{renderHelmet()}
			<div className="error-container">
				<h1>{'Page Not Found'}</h1>
				<>
					{contentPar.map((content, index) => (
						<p key={index}>{content}</p>
					))}
				</>
				<div className="error-searchbar">
					<form onSubmit={executeSearch}>
						<TextInput
							id="keywords"
							action={updateTextInput}
							label={'Search'}
							labelHidden
						/>
						<input
							type="submit"
							className="submit button postfix"
							id="btnSearch"
							title={'Search'}
							value={'Search'}
							onClick={executeSearch}
						/>
					</form>
				</div>
			</div>
		</>
	);
};

export default PageNotFound;
