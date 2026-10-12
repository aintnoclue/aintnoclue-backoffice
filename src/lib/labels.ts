import type { AiFeature, AiOperationKind } from './types';

export const featureLabels: Record<AiFeature, string> = {
	INVESTIGATION_DETAILS: "Détails de l'enquête",
	INVESTIGATION_SUSPECTS: 'Suspects',
	CHARACTER_ANSWER: "Réponse d'un suspect"
};

export const operationKindLabels: Record<AiOperationKind, string> = {
	INVESTIGATION_GENERATION: 'Génération',
	CHARACTER_EXCHANGE: 'Échange'
};
