const icons: UmbExtensionManifest = {
	type: 'icons',
	alias: 'jumoo.tm.icons.openai',
	name: 'Translation Manager OpenAi Icon',
	js: () => import('./icons.js'),
};

export const manifests = [icons];