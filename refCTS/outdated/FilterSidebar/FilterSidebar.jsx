import React from 'react';
import FilterGroup from '../../src/features/filters/FilterGroup';
import Sidebar from '../Sidebar';

const FilterSidebar = ({ isOpen, onToggle }) => {
	return (
		<Sidebar isOpen={isOpen} onToggle={onToggle}>
			<FilterGroup title="Subtype" helpText="More than one selection may be made.">
				{/* Subtype filter component will go here */}
			</FilterGroup>

			<FilterGroup title="Stage" required>
				{/* Stage filter component will go here */}
			</FilterGroup>

			<FilterGroup title="Drug/Intervention" helpText="You can use the drug's generic or brand name.">
				{/* Drug/Intervention filter component will go here */}
			</FilterGroup>

			{/* Additional filter groups */}
		</Sidebar>
	);
};

export default FilterSidebar;
