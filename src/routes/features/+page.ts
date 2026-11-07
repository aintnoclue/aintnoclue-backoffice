import { apiGet, orHttpError } from '#lib/api.ts';
import type { AiModelDto, FeatureModelDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const [features, models] = await Promise.all([
		orHttpError(apiGet<FeatureModelDto[]>(fetch, '/admin/features')),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { features, models };
};
