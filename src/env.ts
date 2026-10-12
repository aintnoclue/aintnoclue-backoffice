import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_URL: {
		public: true,
		static: true,
		description: "URL de l'API du back, figée au build",
		schema: (value) => {
			const url = value || 'http://localhost:8080';
			if (!URL.canParse(url)) throw new Error(`PUBLIC_API_URL is not a valid URL: ${url}`);
			return url;
		}
	}
});
