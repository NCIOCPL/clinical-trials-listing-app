import { useEffect } from 'react';

// Context API store
import { useAppSettings } from '../store/store';
import { updateCTXGlobalValue } from '../store/ctx-actions';

export const useAppInitializer = () => {
	// This must be called before any conditionals
	const [, updateAppSettings] = useAppSettings();

	// Dispatches the reducer action once and only once.
	useEffect(() => {
		updateAppSettings(
			updateCTXGlobalValue({
				field: 'appHasBeenInitialized',
				value: true,
			})
		);
	}, []);
};
