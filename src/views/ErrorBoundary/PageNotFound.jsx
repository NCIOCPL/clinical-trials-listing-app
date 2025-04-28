import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTracking } from 'react-tracking';

import TextInput from '../../components/atomic/TextInput';
import { useStateValue } from '../../store/store';
import { i18n } from '../../utils';

const PageNotFound = () => {
	const [{ canonicalHost, language, trialListingPageType }] = useStateValue();
	const [searchText, updateSearchText] = useState('');
	const tracking = useTracking();

	useEffect(() => {
		const pageTitle = i18n.pageNotFoundTitle[language];
		tracking.trackEvent({
			event: 'TrialListingApp:Load:PageNotFound',
			metaTitle: pageTitle,
			name: `${canonicalHost.replace(/^(http|https):\/\//, '')}${window.location.pathname}`,
			title: pageTitle,
			type: 'PageLoad',
			trialListingPageType: trialListingPageType.toLowerCase(),
		});
	}, []);

	const contentPar =
		language === 'es'
			? [
					<>No podemos encontrar la página que busca.</>,
					<>
						Visite la <a href="https://www.cancer.gov/espanol">página principal</a>, busque por <a href="https://www.cancer.gov/espanol/tipos">tipo de cáncer</a>, o use la casilla de búsqueda en la parte de abajo de esta página.
					</>,
					<>
						¿Tiene una pregunta? <a href="https://www.cancer.gov/espanol/contactenos">Contáctenos</a>.
					</>,
			  ]
			: [
					<>We can&apos;t find the page you&apos;re looking for.</>,
					<>
						Visit the <a href="https://www.cancer.gov">homepage</a>, browse by <a href="https://www.cancer.gov/types">cancer type</a>, or use the search below.
					</>,
					<>
						Have a question? <a href="https://www.cancer.gov/contact">Get in touch</a>.
					</>,
			  ];

	const executeSearch = (event) => {
		event.preventDefault();
		window.location = `https://www.cancer.gov/search/results?swKeyword=${searchText}`;
	};

	const renderHelmet = () => {
		return (
			<Helmet>
				<title>{i18n.pageNotFoundTitle[language]}</title>
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
				<h1 className="nci-heading-h1">{i18n.pageNotFoundTitle[language]}</h1>
				<>
					{contentPar.map((content, index) => (
						<p key={index}>{content}</p>
					))}
				</>
				<div className="error-searchbar">
					<form onSubmit={executeSearch}>
						<TextInput id="keywords" action={updateTextInput} label={i18n.search[language]} labelHidden />
						<input type="submit" className="submit button postfix" id="btnSearch" title={i18n.search[language]} value={i18n.search[language]} onClick={executeSearch} />
					</form>
				</div>
			</div>
		</>
	);
};

export default PageNotFound;
