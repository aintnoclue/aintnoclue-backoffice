import { error } from '@sveltejs/kit';
import { apiGet, orHttpError } from '#lib/api.ts';
import { parseId, readSimulate } from '#lib/query.ts';
import type { AiModelDto, OperationDetailDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch, params, url }) => {
	const id = parseId(params.id);
	if (id === undefined) error(404, 'Introuvable');

	const [operation, models] = await Promise.all([
		orHttpError(
			apiGet<OperationDetailDto>(fetch, `/admin/operations/${id}`, {
				simulateModelId: readSimulate(url)
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { operation, models };
};
