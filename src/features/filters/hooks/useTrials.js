import { useQuery } from '@tanstack/react-query';
import { trialQueries } from '../../../api/queries';

export function useTrials(filters, page, pageSize) {
	return useQuery({
		queryKey: ['trials', filters, page, pageSize],
		queryFn: () => trialQueries.getTrials({ filters, page, pageSize }),
		keepPreviousData: true,
	});
}

export function useTrial(id) {
	return useQuery({
		queryKey: ['trial', id],
		queryFn: () => trialQueries.getTrialById(id),
		enabled: !!id,
	});
}
