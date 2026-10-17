export type AiOperationKind = 'INVESTIGATION_GENERATION' | 'CHARACTER_EXCHANGE';

export type AiFeature =
	| 'INVESTIGATION_DETAILS'
	| 'INVESTIGATION_SUSPECTS'
	| 'CHARACTER_ANSWER'
	| 'INVESTIGATION_SCENARIO'
	| 'INVESTIGATION_CASTING';

export interface TokenUsage {
	inputTokens: number;
	cachedInputTokens: number;
	cacheWriteTokens: number;
	outputTokens: number;
}

export interface AiModelDto {
	id: number;
	name: string;
	apiName: string;
	inputPrice: number;
	cachedInputPrice: number | null;
	cacheWritePrice: number;
	outputPrice: number;
	createdAt: string;
	updatedAt: string;
	requestCount: number;
}

export interface CreateAiModelInput {
	name: string;
	apiName: string;
	inputPrice: number;
	cachedInputPrice?: number | null;
	cacheWritePrice?: number;
	outputPrice: number;
}

export type UpdateAiModelInput = Partial<CreateAiModelInput>;

export interface PricedWith {
	id: number;
	name: string;
}

export interface PricedTokens {
	tokens: TokenUsage;
	costUsd: number | null;
}

export interface ModelComparison {
	modelId: number;
	name: string;
	apiName: string;
	costUsd: number;
	isActual: boolean;
}

export interface UsageTotals extends PricedTokens {
	requestCount: number;
}

export interface FeatureUsage extends UsageTotals {
	feature: AiFeature;
}

export interface ModelUsage extends UsageTotals {
	model: string;
}

export interface UsageAverage {
	count: number;
	avgTokens: TokenUsage;
	avgCostUsd: number | null;
}

export interface ExchangesUsageAverage extends UsageAverage {
	avgExchanges: number;
}

export interface UsageAverages {
	generation: UsageAverage;
	exchange: UsageAverage;
	conversation: ExchangesUsageAverage;
	game: ExchangesUsageAverage;
}

export interface UsageOverviewDto {
	pricedWith: PricedWith | null;
	totals: UsageTotals;
	byFeature: FeatureUsage[];
	byModel: ModelUsage[];
	averages: UsageAverages;
	unpricedModels: string[];
}

export interface DailyUsagePoint extends UsageTotals {
	day: string;
}

export interface DailyUsageDto {
	pricedWith: PricedWith | null;
	days: DailyUsagePoint[];
	unpricedModels: string[];
}

export interface Page<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
	pricedWith: PricedWith | null;
}

export interface OperationSummaryDto extends UsageTotals {
	id: number;
	kind: AiOperationKind;
	investigationId: number | null;
	characterId: number | null;
	createdAt: string;
}

export type OperationsPageDto = Page<OperationSummaryDto>;

export interface OperationRequestDto {
	id: number;
	feature: AiFeature;
	model: string;
	tokens: TokenUsage;
	durationMs: number;
	createdAt: string;
	costUsd: number | null;
}

export interface OperationDetailDto extends OperationSummaryDto {
	pricedWith: PricedWith | null;
	requests: OperationRequestDto[];
	comparison: ModelComparison[];
}

export interface GameExchangesUsage extends PricedTokens {
	count: number;
}

export interface GameSummaryDto {
	investigationId: number;
	createdAt: string;
	generation: PricedTokens;
	exchanges: GameExchangesUsage;
	total: PricedTokens;
}

export type GamesPageDto = Page<GameSummaryDto>;

export interface GameGenerationDto extends PricedTokens {
	operationId: number;
	createdAt: string;
}

export interface ConversationDto extends PricedTokens {
	characterId: number | null;
	exchangeCount: number;
	operationIds: number[];
}

export interface GameDetailDto {
	investigationId: number;
	pricedWith: PricedWith | null;
	generation: GameGenerationDto;
	conversations: ConversationDto[];
	exchanges: GameExchangesUsage;
	total: PricedTokens;
	comparison: ModelComparison[];
}
