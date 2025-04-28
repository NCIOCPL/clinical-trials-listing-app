import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

// Selectors (Adjust based on actual HTML)
const filterSectionSelector = '.ctla-sidebar'; // Or the accordion container itself
const filterContentSelector = '.ctla-sidebar .usa-accordion__content'; // Or the content area
const filterToggleButtonSelector = '.ctla-sidebar .usa-accordion__button'; // Or the toggle button
const pageTitleSelector = 'h1'; // Adjust if needed
const introTextSelector = '.ctla-intro-text'; // Adjust if needed
const resultsCountSelector = '.ctla-results__count'; // Adjust if needed
const paginationSelector = '.usa-pagination'; // Adjust if needed
const resultsListSelector = '.ctla-results-list'; // Adjust if needed
const mainContentAreaSelector = '.ctla-main-content'; // Adjust selector for the right-side content area
const expandIconSelector = '.usa-accordion__button[aria-expanded="false"] .icon-expand'; // Adjust based on your icon implementation
const collapseIconSelector = '.usa-accordion__button[aria-expanded="true"] .icon-collapse'; // Adjust based on your icon implementation

// Breakpoint setup
Given('screen breakpoint is set to {string}', (breakpoint) => {
	if (breakpoint === 'desktop') {
		cy.viewport(1024, 768); // Example desktop width
	} else if (breakpoint === 'mobile') {
		cy.viewport(375, 667); // Example mobile width
	} else {
		throw new Error(`Unsupported breakpoint: ${breakpoint}`);
	}
});

Given('user is viewing the preview site at 1024px or larger breakpoint', () => {
	cy.viewport(1024, 768); // Set viewport for desktop tests
});

// Visibility checks
Then('the filter content is visible', () => {
	cy.get(filterContentSelector).should('be.visible');
});

Then('the filter content is hidden', () => {
	cy.get(filterContentSelector).should('not.be.visible');
});

Then('the filter content remains visible', () => {
	cy.get(filterContentSelector).should('be.visible');
});

// Icon checks (depends on how icons are implemented, e.g., classes, pseudo-elements)
Then('the filter button does not show expand/collapse icon', () => {
	// There are several ways to check this depending on how icons are implemented:

	// 1. If icons are separate elements that are hidden/shown:
	cy.get(filterToggleButtonSelector).find('.icon-expand, .icon-collapse').should('not.exist');

	// 2. If icons are controlled by aria-expanded attribute:
	cy.get(filterToggleButtonSelector).should('not.have.attr', 'aria-expanded');

	// 3. If icons are implemented via CSS classes:
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--collapsed');
	cy.get(filterToggleButtonSelector).should('not.have.class', 'usa-accordion__button--expanded');

	// 4. If icons are implemented via CSS background-image:
	cy.get(filterToggleButtonSelector).should('have.css', 'background-image', 'none');
});

Then('the filter button shows expand icon', () => {
	// Check for aria-expanded attribute (common for accessibility)
	cy.get(filterToggleButtonSelector).should('have.attr', 'aria-expanded', 'false');

	// Check for the actual icon element if it exists as a separate DOM element
	cy.get(expandIconSelector).should('be.visible');

	// Alternative: Check for a specific class that indicates collapsed state
	cy.get(filterToggleButtonSelector).should('have.class', 'usa-accordion__button--collapsed');

	// If using Font Awesome or similar icon libraries:
	cy.get(filterToggleButtonSelector).find('.fa-plus, .fa-chevron-down').should('be.visible');
});

Then('the filter button shows collapse icon', () => {
	// Check for aria-expanded attribute (common for accessibility)
	cy.get(filterToggleButtonSelector).should('have.attr', 'aria-expanded', 'true');

	// Check for the actual icon element if it exists as a separate DOM element
	cy.get(collapseIconSelector).should('be.visible');

	// Alternative: Check for a specific class that indicates expanded state
	cy.get(filterToggleButtonSelector).should('have.class', 'usa-accordion__button--expanded');

	// If using Font Awesome or similar icon libraries:
	cy.get(filterToggleButtonSelector).find('.fa-minus, .fa-chevron-up').should('be.visible');
});

// Interaction
When('clicks the filter toggle button', () => {
	cy.get(filterToggleButtonSelector).click();
});

// Desktop Layout Checks
Then('Filter Trials section displays on the left side of the screen', () => {
	cy.get(filterSectionSelector).should('be.visible');

	// Check position relative to main content by comparing offsets
	cy.get(filterSectionSelector).then(($filter) => {
		cy.get(mainContentAreaSelector).then(($content) => {
			// The filter section's right edge should be to the left of the content's left edge
			expect($filter.offset().left + $filter.width()).to.be.lessThan($content.offset().left);

			// Or simply check that filter is to the left of content
			expect($filter.offset().left).to.be.lessThan($content.offset().left);
		});
	});

	// Alternative: Check if filter section is in the first column of a grid
	cy.get(filterSectionSelector).parent().children().first().should('have.attr', 'id', filterSectionSelector.replace('.', ''));
});

Then('Filter Trials section has grid-col-3 width', () => {
	// Check for USWDS grid class
	cy.get(filterSectionSelector).should('have.class', 'tablet:grid-col-3');

	// Alternative: Check computed width is approximately 25% (3/12 columns)
	cy.get(filterSectionSelector).then(($filter) => {
		cy.get($filter.parent()).then(($parent) => {
			const filterWidth = $filter.width();
			const parentWidth = $parent.width();
			const ratio = filterWidth / parentWidth;

			// Allow for some margin/padding, so check it's roughly 25% (3/12)
			expect(ratio).to.be.closeTo(0.25, 0.05);
		});
	});
});

Then('Filter Trials section has the heading {string}', (heading) => {
	cy.get(filterSectionSelector).find('h2, h3').should('contain.text', heading);
});

Then('page title displays on the right side of the screen', () => {
	cy.get(pageTitleSelector).should('be.visible');

	// Check position relative to filter section
	cy.get(pageTitleSelector).then(($title) => {
		cy.get(filterSectionSelector).then(($filter) => {
			// The title should be to the right of the filter section
			expect($title.offset().left).to.be.greaterThan($filter.offset().left + $filter.width());
		});
	});

	// Alternative: Check if title is in the main content area
	cy.get(mainContentAreaSelector).find(pageTitleSelector).should('exist');
});

Then('intro text displays below the page title', () => {
	cy.get(introTextSelector).should('be.visible');

	// Check vertical position relative to title
	cy.get(pageTitleSelector).then(($title) => {
		cy.get(introTextSelector).then(($intro) => {
			// The intro text's top edge should be below the title's bottom edge
			expect($intro.offset().top).to.be.greaterThan($title.offset().top + $title.height());
		});
	});

	// Alternative: Check DOM order within parent
	cy.get(pageTitleSelector)
		.parent()
		.children()
		.then(($children) => {
			const titleIndex = $children.index(cy.$$(`${pageTitleSelector}`));
			const introIndex = $children.index(cy.$$(`${introTextSelector}`));
			expect(introIndex).to.be.greaterThan(titleIndex);
		});
});

Then('results count displays below the intro text', () => {
	cy.get(resultsCountSelector).should('be.visible');

	// Check vertical position
	cy.get(introTextSelector).then(($intro) => {
		cy.get(resultsCountSelector).then(($count) => {
			expect($count.offset().top).to.be.greaterThan($intro.offset().top + $intro.height());
		});
	});

	// Alternative: Check DOM order
	cy.get(introTextSelector)
		.parent()
		.children()
		.then(($children) => {
			const introIndex = $children.index(cy.$$(`${introTextSelector}`));
			const countIndex = $children.index(cy.$$(`${resultsCountSelector}`));
			expect(countIndex).to.be.greaterThan(introIndex);
		});
});

Then('pagination displays below the results count', () => {
	cy.get(paginationSelector).should('be.visible');

	// Check vertical position
	cy.get(resultsCountSelector).then(($count) => {
		cy.get(paginationSelector).then(($pagination) => {
			expect($pagination.offset().top).to.be.greaterThan($count.offset().top + $count.height());
		});
	});

	// Alternative: Check DOM order
	cy.get(resultsCountSelector)
		.parent()
		.children()
		.then(($children) => {
			const countIndex = $children.index(cy.$$(`${resultsCountSelector}`));
			const paginationIndex = $children.index(cy.$$(`${paginationSelector}`));
			expect(paginationIndex).to.be.greaterThan(countIndex);
		});
});

Then('results list displays below the pagination', () => {
	cy.get(resultsListSelector).should('be.visible');

	// Check vertical position
	cy.get(paginationSelector).then(($pagination) => {
		cy.get(resultsListSelector).then(($results) => {
			expect($results.offset().top).to.be.greaterThan($pagination.offset().top + $pagination.height());
		});
	});

	// Alternative: Check DOM order
	cy.get(paginationSelector)
		.parent()
		.children()
		.then(($children) => {
			const paginationIndex = $children.index(cy.$$(`${paginationSelector}`));
			const resultsIndex = $children.index(cy.$$(`${resultsListSelector}`));
			expect(resultsIndex).to.be.greaterThan(paginationIndex);
		});
});

Then('page content has grid-col-width-9', () => {
	// Check for USWDS grid class
	cy.get(mainContentAreaSelector).should('have.class', 'tablet:grid-col-9');

	// Alternative: Check computed width is approximately 75% (9/12 columns)
	cy.get(mainContentAreaSelector).then(($content) => {
		cy.get($content.parent()).then(($parent) => {
			const contentWidth = $content.width();
			const parentWidth = $parent.width();
			const ratio = contentWidth / parentWidth;

			// Allow for some margin/padding, so check it's roughly 75% (9/12)
			expect(ratio).to.be.closeTo(0.75, 0.05);
		});
	});
});

// Assuming steps like 'When the user navigates to...' and filter interactions exist elsewhere
