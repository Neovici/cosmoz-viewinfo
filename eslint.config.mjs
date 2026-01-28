import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		rules: {
			'max-lines-per-function': 'off',
			'import/group-exports': 'off',
		},
	},
	{
		files: ['test/**/*.js'],
		rules: {
			'mocha/max-top-level-suites': 'off',
			'mocha/no-top-level-hooks': 'off',
		},
	},
	{ ignores: ['coverage/**'] },
];
