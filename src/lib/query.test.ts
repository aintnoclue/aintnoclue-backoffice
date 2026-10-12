import { describe, expect, it } from 'vitest';
import { readPage, readPeriod, readSimulate, withParams } from './query';

const url = (search: string) => new URL(`http://admin.test/generations${search}`);

describe('readSimulate', () => {
	it('reads a positive model id', () => {
		expect(readSimulate(url('?simulate=3'))).toBe(3);
	});

	it('ignores a missing or invalid id', () => {
		expect(readSimulate(url(''))).toBeUndefined();
		expect(readSimulate(url('?simulate=abc'))).toBeUndefined();
		expect(readSimulate(url('?simulate=0'))).toBeUndefined();
		expect(readSimulate(url('?simulate=-2'))).toBeUndefined();
		expect(readSimulate(url('?simulate=1.5'))).toBeUndefined();
	});
});

describe('readPage', () => {
	it('reads the page number', () => {
		expect(readPage(url('?page=4'))).toBe(4);
	});

	it('falls back to the first page', () => {
		expect(readPage(url(''))).toBe(1);
		expect(readPage(url('?page=0'))).toBe(1);
		expect(readPage(url('?page=x'))).toBe(1);
	});
});

describe('readPeriod', () => {
	const now = new Date('2026-10-12T15:30:00.000Z');

	it('starts the window at UTC midnight, today included', () => {
		expect(readPeriod(url('?period=7d'), now)).toEqual({
			period: '7d',
			from: '2026-10-06T00:00:00.000Z'
		});
		expect(readPeriod(url('?period=90d'), now).from).toBe('2026-07-15T00:00:00.000Z');
	});

	it('has no lower bound for all', () => {
		expect(readPeriod(url('?period=all'), now)).toEqual({ period: 'all' });
	});

	it('defaults to the last 30 days', () => {
		const expected = { period: '30d', from: '2026-09-13T00:00:00.000Z' };
		expect(readPeriod(url(''), now)).toEqual(expected);
		expect(readPeriod(url('?period=1y'), now)).toEqual(expected);
	});
});

describe('withParams', () => {
	it('sets params and keeps the others', () => {
		expect(withParams(url('?period=7d&page=2'), { simulate: 3 })).toBe(
			'/generations?period=7d&page=2&simulate=3'
		);
	});

	it('removes empty params', () => {
		expect(withParams(url('?simulate=3&page=2'), { simulate: null, page: undefined })).toBe(
			'/generations'
		);
		expect(withParams(url('?simulate=3'), { simulate: '' })).toBe('/generations');
	});
});
