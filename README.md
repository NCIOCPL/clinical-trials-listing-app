# clinical-trials-listing-app
React Application for listing clinical trials

## Folder Structure

- <REPO_ROOT>
  - `.github/workflows/workflow.yml` - this is the CI pipeline for the app. Any pushes, PRs will build, test and deploy to react-app-dev. This requires a set of secrets.
  - `config` - this is the webpack configuration files
  - `cypress` - main integration testing folder. Ususes cypress-cucumber-processor library.
    - `integration` - this is where features and step definitions go.
      - `AppAnalytics/SampleAnalyticsTest.feature` - This feature tests a page load and a button click.
      - `common`
        - `analytics.js` - Steps to test Event-driven Datalayer (EDDL) based analytics.
        - `beforeEach.js` - Sets up application defaults on `window.INT_TEST_APP_PARAMS`, which are then overridden using the `{string} is set to {string}` step. This object must be customized to your application.
        - `index.js` - various common steps for navigation and such.
        - `MetaTags.js` - common steps for metadata inspection.
      - `SamplePageTest.feature` - sample feature file for the test page.
    - `plugins` - Cypress scaffolding. Also includes helpers to deal with code coverage.
    - `support` - Cypress scaffolding.
  - `public` - This is the folder containg the web site static content and used for local dev, integration testing, and react-app-dev testing. This is NOT used for production.
    - `fonts` - Cgov fonts
    - `__nci-dev__common.css` - a copy of cancer.gov'
      s common CSS.
    - `index.css` - css to support the application configuration switcher.
    - `index.html` - Html file to contain the www.cancer.gov C-clamp, and application configuration switcher.
    - other OOB CRA items like robots.txt.
  - `scripts` - scripts from CRA that have been heavily modified to meet the needs for our stack.
    - `build.js` -
    - `start.js` -
    - `test.js` -
  - `src` - the source
    - `index.js` - the initialization function that creates the app state. This is the entry point to the app.
    - `App.js` - The main wrapper for the application
    - `constants.js` - please add any constants your app will use to this file
    - `hooks` - the location where all hooks should go
      - `customFetch.js` - this hook acts as a wrapper for `useQuery` hook for the external fetch library [react-fetching-library](https://marcin-piela.github.io/react-fetching-library/#/?id=usequery)
      - `routing.js` - this hook contains the methods for generating urls for the app.
      - `useURLQuery.js` - this hook uses react-router-dom's useLocation hook in conjunction with URLSearchParams to provide the application with a consistent way to access url query strings
    - `services` - contains source code for related external services
      - `api` - contains api fetch call related items. Checkout [Making API Calls](#making-api-calls) to find out how to configure API endpoints and add fetch actions.
        - `actions` - this would contain files with fetch actions that can be invoked to make api calls with whatever parameters are required to fulfill that fetch call
        - `axios-client.js` - Wrapper for [react-fetching-library](https://marcin-piela.github.io/react-fetching-library/#/)
        - `buildAxiosRequest.js` - Custom axios library wrapper to build requests and handle response transformations
        - `endpoints.js` - external api endpoints are set and defined here
  - `support` - this contains the code for mocking APIs, as well as the mock data
    - `mock-data` - This the folder structure under here should match the paths for `setupProxy.js`.
    - `src/setupProxy.js` - This is the place where you will mock all the API calls.
  - `.editorconfig` - editorrc file to help ensure saved files are consistent with linter.
  - `.eslintrc.js` - The linter config. These are based off of AirBnB react rules that @arcepaul modified.
  - `.gitignore` - gitignore file based on CRA, with additions for our stack. (e.g. ignore cypress screenshots)
  - `.prettierrc` - similar to editorconfig. help with linter rules.
  - `jest-test-setup` - for jest configuration you want defined before running each test
  - `package.json` and `package-lock.json` - you should know what these are.
  - `README.md` - this document

## Making API Calls

API endpoint domain has to be set as an initialization parameter for the application in `/src/index.js`.

For example to retrieve geolocation using Google's Geo-coding API (https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA)
based on address.

1. Add API domain base endpoint as an initialization parameter and add to "initialState"
   in `/src/index.js` to support an additional call for this service.

   ```js
   ...snip...

   const initialize = ({
       ...,
       googleAPIEndpoint = "https://maps.googleapis.com/maps/api",
   } = {}) => {

   ...snip...

       const initialState = {
           ...snip...,
           googleAPIEndpoint,
           ...snip...
       };

   ...snip...

   }

   ...snip...
   ```

2. Initialize variables and create convenience method to set this variable in `/src/services/api/endpoints.js`
   Initialize "GOOGLE_API_ENDPOINT" and create method "setGoogleAPIEndpoint".

   ```js
   let GOOGLE_API_ENDPOINT;

   /**
    * Sets Google's base API endpoint
    *
    * @param {string} endpoint - Base API endpoint
    * @return void
    */
   export function setGoogleAPIEndpoint(endpoint) {
   	GOOGLE_API_ENDPOINT = cleanURI(endpoint);
   }
   ```

3. Update `/src/services/api/axios-client.js`
   Set "GOOGLE_API_ENDPOINT" by importing "setGoogleAPIEndpoint" from endpoints.js
   using "googleAPIEndpoint" that was provided as an initialization parameter by destructuring it from "initialize".

   ```js
   ...snip...
   import { ..., setGoogleAPIEndpoint } from './endpoints';

    export const getAxiosClient = (initialize) => {
       const { ..., googleAPIEndpoint } = initialize;
       setGoogleAPIEndpoint(googleAPIEndpoint);
       ...snip...
    }
    ...snip...
   ```

4. Add a service name to "getEndpoints" in `/src/services/api/endpoints.js`

   ```js
   const endpoints = {
    ...,
   	geoCode: `${GOOGLE_API_ENDPOINT}/geocode/json`,
    ...,
   };
   ```

5. A fetch action can then be defined by creating "getGeocodeResults.js" in `/src/services/api/actions`

   ```js
   import { getEndpoint } from '../endpoints';

   export const getGeocodeResults = ({ address }) => {
   	const endpoint = getEndpoint('geoCode');
   	return {
   		method: 'GET',
   		endpoint: `${endpoint}?address=${address}`,
   	};
   };
   ```

   NOTE: Remember to create unit tests as well!

6. Make the fetch calls using "useCustomQuery".

   ```js
   import { useCustomQuery } from 'src/hooks';
   import { getGeocodeResults } from 'src/services/api/actions/getGeocodeResults';

   const sampleView = () => {
   	const address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA';
   	const fetchResults = useCustomQuery(getGeocodeResults({ address }));
   };
   ```

   The "useCustomQuery" hook takes a second boolean parameter "shouldFetch" which allows for conditional fetches.

## Analytics for the NCI Event-Driven Data Layer (EDDL)

Handling analytics requires that the following code be used for a page load event:

```js
window.NCIDataLayer = window.NCIDataLayer || [];
window.NCIDataLayer.push({
  type: 'PageLoad',
  event: '<EVENT_NAME>',
  page: {
    name: "",
    title: "",
    metaTitle: "",
    language: "",
    type: "",
    audience: "",
    channel: "",
    contentGroup: "",
    publishedDate: Date
    additionalDetails: {}
  }
});
```

and the following for click events:

```js
window.NCIDataLayer.push({
	type: 'Other',
	event: '<EVENT_NAME>',
	data: {},
});
```

One of the MOST IMPORTANT things is that page load events ALWAYS preceed click events. The EDDL keeps track of the page information raised during a page load, and that information is pushed out to the Analytics Tool with the click/other data payload. So if a click event is raised by the app BEFORE the page load it is associated with, then bad things happen...

### How the react-tracker Package Works

The [react-tracking library](https://github.com/nytimes/react-tracking) offers a way for embedding analytics agnostic event tracking in a react app. React-tracker OOB allows you to set various contextual data points in each of your components, such that if a nested component raises a tracking event, those data points are included in the data payload.

For example say you are displaying a search results page. You can:

- From the view component for the search results, you `track({ pageName: 'Results Page', searchTerm: 'chicken'})`
- From the results listing component you `track({numResults: 322})`
- Then on a specific result component on a click handler of a link you can
  ```js
  tracking.trackEvent({
  	action: 'result_link_click',
  	position: thePosition,
  	title: result.title,
  });
  ```
  Then when a user clicks on a result link a tracking event is dispatched with:

```js
{
  pageName: 'Results Page',
  searchTerm: 'chicken',
  numResults: 322,
  action: 'result_link_click',
  position: 3,
  title: 'A title'
}
```

We have created an AnalyticsProvider higher-order component that wraps our App "component". This provider wires up a custom dispatch function to the react-tracking library. This custom function is the `analyticsHandler` parameter passed into the initialize function.

A react-tracker dispatch function takes in a data payload that has no predefined structured.

## Routing

`src/routing.js` contains a hook, useAppPaths that return helper functions that are used to not only generate URLs for a route, but also can be used to define the routes in your App.js file.

### Using useAppPaths to generate a URL

`useAppPaths` will return an object with all the route names, as functions, defined in appPaths. The functions each take in an object that maps to the path patterns.

**Example**

```js
// in routing.js
const appPaths = {
	HomePath: '/',
	ItemDetailsPath: '/:id',
};

// snippet from Home.jsx
import { useAppPaths } from './hooks';

...snip...

const {
	HomePath,
	ItemDetailsPath,
} = useAppPaths();

...snip...

<Link
		to={ItemDetailsPath({id: "6789"})}
		onClick={handleItemClick}>Item 6789</Link>
```

### Using useAppPaths to get a route

If you do not pass any parameters into the `useAppPaths` functions, then the original path pattern will be returned. This is used for defining routes.

**Example**

```js
// in routing.js
const appPaths = {
	HomePath: '/',
	ItemDetailsPath: '/:id',
};

// Route definition from App.js
import { useAppPaths } from './hooks';

...snip...

const {
	HomePath,
	ItemDetailsPath,
} = useAppPaths();

...snip...

<Router>
	<Routes>
		<Route path={HomePath()} element={<Home />} />
		<Route path={ItemDetailsPath()} element={<ItemDetails />} />
		<Route path="/*" element={<PageNotFound />} />
	</Routes>
</Router>
```

## JavaScript

### Imports

Imports at the top of each page should always be alphabetized and follow this order.

- Node/xml packages and frameworks.
- Specific style sheets or json (scss/css/etc)
- Application or component imports

```js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTracking } from 'react-tracking';

import './Application.scss';

import { useAppPaths } from '../../hooks';
import { useStateValue } from '../../store/store';
```

### Linting

We recommend combining `Prettier` with the `Eslint` plugins for eslint and formatting while in development and before any code is pushed to a pull request.

## Style Sheets

A site’s architecture should be based on its goals and purposes. This means the guidance here should be adapted to different sites and situations.

Styles should be organized in the directory with the component it is being consumed by and follow the same naming convention. Such as `definition.jsx` and `definition.scss`

```
src
├── components/
│   ├── molecules/
│       ├── definition/
│           ├── definition.jsx
│           ├── definition.scss
```

## Naming

- HTML elements should be in lowercase.

```css
body,
div {
}
```

- Classes should be lowercase.
- Avoid camelcase.
- Name things clearly.
- Write classes semantically. Name its function not its appearance.

```css
// Bad
// Avoid uppercase
.ClassNAME {
}

// Avoid camel case
.commentForm {
}

// What is a c1-xr? Use a more explicit name.
.c1-xr {
}
```

- Avoid presentation- or location-specific words in names, as this will cause problems when you (invariably) need to change the color, width, or feature later.

```css
// Bad
.blue
.text-gray
.100width-box

// Good
.warning
.primary
.lg-box;
```

- Be wary of naming components based on content, as this limits the use of the class.

```css
// Danger zone
.product_list

// Better
.item_list;
```

- Don’t abbreviate unless it’s a well-known abbreviation.

```css
// Bad
.bm-rd

// Good
.block--lg;
```

- Use quotes in type pseudo selectors.

```css
// Good
.top_image[type='text'] {
}
```

- Name CSS components and modules with singular nouns.

```css
.button {
}
```

- Name modifiers and state-based rules with adjectives.

```css
.is_hovered {
}
```

- If your CSS has to interface with other CSS libraries, consider namespacing every class.

```css
.f18-component
```

### Naming Methodologies

The recommended way to do this is using an existing [BEM](https://en.bem.info/methodology/) methodology.

```css
// block
.inset {
	margin-left: 15%;

	// element
	.inset__content {
		padding: 3em;
	}
}

// modifier
.inset--sm {
	margin-left: 10%;

	.inset__content {
		padding: 1em;
	}
}

// modifier
.inset--lg {
	margin-left: 20%;
}
```
