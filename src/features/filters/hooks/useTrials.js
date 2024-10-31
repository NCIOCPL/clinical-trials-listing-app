import { useQuery } from '@tanstack/react-query';
import { useStateValue } from '../../../store/store';
import { createTrialQueries } from '../../../api/queries';

export function useTrials(filters, page, pageSize) {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();
	const queries = createTrialQueries(clinicalTrialsSearchClient);

	return useQuery({
		queryKey: ['trials', filters, page, pageSize],
		queryFn: () => queries.getTrials({ filters, page, pageSize }),
		keepPreviousData: true,
	});
}

export function useTrial(id) {
	const [
		{
			apiClients: { clinicalTrialsSearchClient },
		},
	] = useStateValue();
	const queries = createTrialQueries(clinicalTrialsSearchClient);

	return useQuery({
		queryKey: ['trial', id],
		queryFn: () => queries.getTrialById(id),
		enabled: !!id,
	});
}
