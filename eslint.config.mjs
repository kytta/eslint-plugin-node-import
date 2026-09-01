import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import eslintPlugin from "eslint-plugin-eslint-plugin";
import node from "eslint-plugin-n";

export default defineConfig([
	js.configs.recommended,
	eslintPlugin.configs.recommended,
	node.configs["flat/mixed-esm-and-cjs"],
]);
