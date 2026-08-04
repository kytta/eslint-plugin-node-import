import js from "@eslint/js";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import node from "eslint-plugin-n";

export default [
	js.configs.recommended,
	eslintPlugin.configs["flat/recommended"],
	node.configs["flat/recommended"],
	{
		files: ["**/*.mjs"],
		languageOptions: {
			sourceType: "module",
		},
		...node.configs["flat/recommended-module"],
	},
];
