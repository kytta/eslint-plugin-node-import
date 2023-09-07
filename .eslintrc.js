"use strict";

module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:eslint-plugin/recommended",
		"plugin:n/recommended",
	],
	env: {
		node: true,
	},
	overrides: [
		{
			files: ["tests/**/*.js"],
		},
	],
};
