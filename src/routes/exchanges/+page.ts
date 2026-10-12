import { loadOperations } from '#lib/loaders.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ fetch, url }) => loadOperations(fetch, url, 'CHARACTER_EXCHANGE');
