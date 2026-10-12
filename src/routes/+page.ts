import { apiGet, orHttpError } from '#lib/api.ts';
import { readChartDays, readPeriod, readSimulate } from '#lib/query.ts';
import type { AiModelDto, DailyUsageDto, UsageOverviewDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const { period, from } = readPeriod(url);
	const simulateModelId = readSimulate(url);
	const [overview, daily, models] = await Promise.all([
		orHttpError(
			apiGet<UsageOverviewDto>(fetch, '/admin/stats/overview', { from, simulateModelId })
		),
		orHttpError(
			apiGet<DailyUsageDto>(fetch, '/admin/stats/daily', {
				days: readChartDays(url),
				simulateModelId
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { period, overview, daily, models };
};
