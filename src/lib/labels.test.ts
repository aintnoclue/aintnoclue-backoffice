import { describe, expect, it } from 'vitest';
import { modelLabel, modelSettingsLabel } from './labels';

describe('modelSettingsLabel', () => {
	it('is empty without settings', () => {
		expect(modelSettingsLabel({ reasoningEffort: null, serviceTier: null })).toBe('');
	});

	it('shows the reasoning effort alone', () => {
		expect(modelSettingsLabel({ reasoningEffort: 'XHIGH', serviceTier: null })).toBe('Très élevé');
	});

	it('shows the service tier alone', () => {
		expect(modelSettingsLabel({ reasoningEffort: null, serviceTier: 'FLEX' })).toBe('Flex');
	});

	it('joins the reasoning effort and the service tier', () => {
		expect(modelSettingsLabel({ reasoningEffort: 'HIGH', serviceTier: 'PRIORITY' })).toBe(
			'Élevé · Prioritaire'
		);
	});
});

describe('modelLabel', () => {
	it('is the name of a model without settings', () => {
		expect(modelLabel({ name: 'GPT-4o mini', reasoningEffort: null, serviceTier: null })).toBe(
			'GPT-4o mini'
		);
	});

	it('appends the settings to the name', () => {
		expect(modelLabel({ name: 'GPT-5.6', reasoningEffort: 'LOW', serviceTier: 'PRIORITY' })).toBe(
			'GPT-5.6 (Faible · Prioritaire)'
		);
	});
});
