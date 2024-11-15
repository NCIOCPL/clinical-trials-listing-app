import { useState } from 'react';

// showing and hiding a react modal component
export const useModal = () => {
	const [isShowing, setIsShowing] = useState(false);
	function toggleModal() {
		setIsShowing(!isShowing);

		if (!isShowing) {
			document.body.classList.add('modal-open');
		} else {
			document.body.classList.remove('modal-open');
		}
	}
	return {
		isShowing,
		toggleModal,
	};
};
