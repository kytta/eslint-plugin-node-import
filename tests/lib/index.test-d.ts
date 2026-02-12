import { expectAssignable } from "tsd";
import { ESLint, Linter } from "eslint";
import plugin from "../../lib/index";

expectAssignable<ESLint.Plugin>(plugin);
expectAssignable<Linter.FlatConfig[]>(plugin.configs["flat/recommended"]);
expectAssignable<Linter.LegacyConfig>(plugin.configs["recommended"]);
