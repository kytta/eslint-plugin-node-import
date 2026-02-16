import { Linter, ESLint } from "eslint";
import preferNodeProtocol from "./rules/prefer-node-protocol";

declare const plugin: ESLint.Plugin & {
	rules: {
		"prefer-node-protocol": typeof preferNodeProtocol;
	};
	configs: {
		"flat/recommended": Linter.FlatConfig[];
		"recommended": Linter.LegacyConfig;
	}
};

export = plugin;
