import { loadOperations } from '#lib/loaders.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, url }) =>
	loadOperations(fetch, url, 'INVESTIGATION_GENERATION');
