import { apiGet, orHttpError } from '#lib/api.ts';
import { readPeriod, readSimulate } from '#lib/query.ts';
import type { AiModelDto, UsageOverviewDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const { from } = readPeriod(url);
	const [overview, models] = await Promise.all([
		orHttpError(
			apiGet<UsageOverviewDto>(fetch, '/admin/stats/overview', {
				from,
				simulateModelId: readSimulate(url)
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { overview, models };
};
