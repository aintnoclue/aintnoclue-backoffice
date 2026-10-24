import type {
	AiFeature,
	AiOperationKind,
	AiReasoningEffort,
	AiServiceTier,
	ModelSettings
} from './types';

export const featureLabels: Record<AiFeature, string> = {
	INVESTIGATION_DETAILS: "Détails de l'enquête",
	INVESTIGATION_SUSPECTS: 'Suspects',
	CHARACTER_ANSWER: "Réponse d'un suspect",
	INVESTIGATION_SCENARIO: "Scénario de l'enquête",
	INVESTIGATION_CASTING: 'Casting des personnages'
};

export const operationKindLabels: Record<AiOperationKind, string> = {
	INVESTIGATION_GENERATION: 'Génération',
	CHARACTER_EXCHANGE: 'Échange'
};

export const reasoningEffortLabels: Record<AiReasoningEffort, string> = {
	NONE: 'Aucun',
	MINIMAL: 'Minimal',
	LOW: 'Faible',
	MEDIUM: 'Moyen',
	HIGH: 'Élevé',
	XHIGH: 'Très élevé',
	MAX: 'Maximal'
};

export const serviceTierLabels: Record<AiServiceTier, string> = {
	DEFAULT: 'Standard',
	FLEX: 'Flex',
	PRIORITY: 'Prioritaire'
};

export function modelSettingsLabel({ reasoningEffort, serviceTier }: ModelSettings): string {
	return [
		reasoningEffort && reasoningEffortLabels[reasoningEffort],
		serviceTier && serviceTierLabels[serviceTier]
	]
		.filter(Boolean)
		.join(' · ');
}

export function modelLabel(model: ModelSettings & { name: string }): string {
	const settings = modelSettingsLabel(model);
	return settings ? `${model.name} (${settings})` : model.name;
}
