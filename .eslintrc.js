module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: "standard-with-typescript",
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		project: "./tsconfig.json",
	},
	rules: {
		"no-tabs": "off",
		quotes: "off",
		semi: "off",
		"comma-dangle": "off",
		indent: ["error", "tab"],
		"@typescript-eslint/quotes": ["warn", "double"],
		"@typescript-eslint/semi": ["error", "always"],
		"@typescript-eslint/comma-dangle": "off",
		"@typescript-eslint/strict-boolean-expressions": "off",
		"@typescript-eslint/no-misused-promises": "off",
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/indent": "off",
		"@typescript-eslint/space-before-function-paren": "off",
	},
};
