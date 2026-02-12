import { Rule } from "eslint";

declare const rule: Rule.RuleModule & { meta: { schema: [] } };

export = rule;
