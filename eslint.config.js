"use strict";

const globals = require("globals");
const js = require("@eslint/js");
const nodePlugin = require("eslint-plugin-n");
const eslintPlugin = require("eslint-plugin-eslint-plugin");
const nodeImportPlugin = require("./lib/index.js");

module.exports = [
    {
        languageOptions: { globals: globals.mocha },
    },
	js.configs.recommended,
	nodePlugin.configs["flat/recommended-script"],
	eslintPlugin.configs["flat/recommended"],
	...nodeImportPlugin.configs["flat/recommended"],
];
