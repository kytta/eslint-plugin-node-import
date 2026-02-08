import { Rule } from "eslint";

declare const rule: Rule.RuleModule & {
	meta: {
		type: string,
		docs: {
			description: string,
			recommended: true,
			url: string,
		},
		fixable: string,
		schema: [],
		messages: { [messageId: string]: string },
	}
};

export = rule;
