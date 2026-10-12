import { error } from '@sveltejs/kit';
import { apiGet, orHttpError } from '#lib/api.ts';
import { parseId, readSimulate } from '#lib/query.ts';
import type { AiModelDto, GameDetailDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const investigationId = parseId(params.investigationId);
	if (investigationId === undefined) error(404, 'Introuvable');

	const [game, models] = await Promise.all([
		orHttpError(
			apiGet<GameDetailDto>(fetch, `/admin/games/${investigationId}`, {
				simulateModelId: readSimulate(url)
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { game, models };
};
