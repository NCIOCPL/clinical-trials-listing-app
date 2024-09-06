export const pageTypePatterns = {
	Disease: ['Disease', 'DiseaseTrialType', 'DiseaseTrialTypeIntervention'],
	Intervention: ['Intervention', 'InterventionTrialType'],
};

// Order matters here as matching occurs on all items in the array,
// and first correct match is returned
// 1. DiseaseTrialTypeIntervention
// 2. DiseaseTrialType
// 3. Disease
export const pageTypePatternsQueryParamsByTrialTypeMap = {
	Disease: [
		{
			DiseaseTrialTypeIntervention: ['codeOrPurl', 'type', 'interCodeOrPurl'],
			Disease: ['codeOrPurl'],
		},
		{
			DiseaseTrialTypeIntervention: ['p1', 'p2', 'p3'],
			Disease: ['p1'],
		},
	],
	Intervention: [
		{
			InterventionTrialType: ['codeOrPurl', 'type'],
			Intervention: ['codeOrPurl'],
		},
		{
			InterventionTrialType: ['p1', 'p2'],
			Intervention: ['p1'],
		},
	],
};

export const queryParamType = {
	code: 'code',
	purl: 'purl',
};

export const textProperties = ['browserTitle', 'introText', 'metaDescription', 'noTrialsHtml', 'pageTitle'];
