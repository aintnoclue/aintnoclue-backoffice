import { apiGet, orHttpError } from '#lib/api.ts';
import type { AiModelDto } from '#lib/types.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => ({
	models: await orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
});
