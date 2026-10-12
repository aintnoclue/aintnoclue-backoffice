import { apiGet, orHttpError } from './api';
import { readPage, readPeriod, readSimulate } from './query';
import type { AiModelDto, AiOperationKind, OperationsPageDto } from './types';

export async function loadOperations(
	fetch: typeof globalThis.fetch,
	url: URL,
	kind: AiOperationKind
) {
	const { from } = readPeriod(url);
	const [operations, models] = await Promise.all([
		orHttpError(
			apiGet<OperationsPageDto>(fetch, '/admin/operations', {
				kind,
				page: readPage(url),
				from,
				simulateModelId: readSimulate(url)
			})
		),
		orHttpError(apiGet<AiModelDto[]>(fetch, '/admin/models'))
	]);
	return { operations, models };
}
