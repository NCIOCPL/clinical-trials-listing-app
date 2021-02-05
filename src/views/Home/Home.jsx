import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';

import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store.js';

const Home = () => {

	// Pull in the paths we are going to need on this view.
	const {
		HomePath,
		ItemDetailsPath,
	} = useAppPaths();

	// Get items passed into index.js and stored in the context.
	const [
		{
			altLanguageBasePath,
			basePath,
			baseHost,
			title,
			canonicalHost,
			siteName,
			language,
			languageToggleSelector,
		},
	] = useStateValue();

	// Get a reference to the tracking function for
	// analytics.
	const tracking = useTracking();

	// Fire off a page load event. Usually this would be in
	// some effect when something loaded.
	tracking.trackEvent({
		// These properties are required.
		type: 'PageLoad',
		event: 'TrialListingApp:Load:Home',
		name:
			canonicalHost.replace('https://', '') +
			HomePath(),
		title: title,
		metaTitle: `${title} - ${siteName}`
		// Any additional properties fall into the "page.additionalDetails" bucket
		// for the event.
	});

	/**
	 * Helper function to get href lang links IF there is an
	 * alternate language.
	 */
	const getHrefLangs = () => {
		if (!altLanguageBasePath) {
			return;
		}

		return [
			<link
				key="1"
				rel="alternate"
				hrefLang={language}
				href={
					canonicalHost +
					HomePath()
				}
			/>,
			<link
				key="2"
				rel="alternate"
			// TODO: Fix this as it is dirty and does not
			// support multiple languages. (Well, the alternate
			// language dictionary base path does not either... )
				hrefLang={language === "es" ? "en" : "es"}
				href={
					canonicalHost +
					altLanguageBasePath +
					HomePath()
				}
			/>,
		];
	}

	/**
	 * Helper function to render metadata.
	 */
	const renderHelmet = () => {

		// Home is indexable, expand and search are not.

		return (
			<Helmet>
				<title>{`${title} - ${siteName}`}</title>
				<meta
					property="og:title"
					content={`${title}`}
				/>
				<meta
					property="og:url"
					content={baseHost + HomePath()}
				/>
				<link rel="canonical" href={
					canonicalHost + HomePath()
				} />
				<meta name="robots" content="index" />
				{getHrefLangs()}
			</Helmet>
		);
	};

	/**
	 * Item Click Handler
	 */
	const handleItemClick = () => {
		// Example of click tracking.
		tracking.trackEvent({
			// These properties are required.
			type: 'Other',
			event: 'PlaygroundApp:Other:ItemClick',
			linkName: 'ItemClick',
			// Any additional properties fall into the "data" bucket
			// for the event.
		});
	};

	return (
		<>
			{renderHelmet()}
			<h1>{title}</h1>
			<div>
				<p>This is the home view.</p>
				<p>It can be whatever you like, you don&apos;t even actually need a home view,
					but most of our apps have something. Please do not overload the home view
					with a bunch of other views.</p>
				<h3>3 examples of links</h3>
				<ul>
					<li>
						<Link
								to={ItemDetailsPath({id: "6789"})}
								onClick={handleItemClick}>Item 6789</Link>
					</li>
					<li>
						<Link
								to={ItemDetailsPath({id: "12345"})}
								onClick={handleItemClick}>Item 12345</Link>
					</li>
					<li>
						<Link
								to={ItemDetailsPath({id: "99999"})}
								onClick={handleItemClick}>Non-existent Item</Link>
					</li>
					<li>
						<Link
							to="/chicken"
							onClick={handleItemClick}>Non-existent Page</Link>
					</li>
				</ul>
			</div>
		</>
	);
};

export default Home;
