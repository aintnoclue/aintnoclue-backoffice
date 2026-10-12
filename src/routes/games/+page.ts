import { apiGet, orHttpError } from '#lib/api.ts';
import { readPage, readPeriod, readSimulate } from '#lib/query.ts';
import type { AiModelDto, GamesPageDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const { from } = readPeriod(url);
	const [games, models] = await Promise.all([
		orHttpError(
			apiGet<GamesPageDto>(fetch, '/admin/games', {
				page: readPage(url),
				from,
				simulateModelId: readSimulate(url)
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { games, models };
};
