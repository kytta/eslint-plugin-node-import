const { builtinModules } = require("module");

const notBunModule = (m) => m !== "bun" && !m.startsWith("bun:");

const nodeBuiltins = new Set(builtinModules.filter(notBunModule));

const PREFIX = "node:";
const PREFIX_LENGTH = PREFIX.length;

const MESSAGE_ID = "prefer-node-protocol";
const MESSAGE_ID_DISALLOW = "prefer-node-protocol:disallow";

/** @type {import("eslint").Rule.RuleModule} */
module.exports = {
	meta: {
		type: "problem",
		docs: {
			description:
				"Enforce consistent use of the `node:` protocol when importing Node.js builtin modules.",
			recommended: true,
			url: "https://github.com/kytta/eslint-plugin-node-import/blob/main/docs/rules/prefer-node-protocol",
		},
		fixable: "code",
		schema: [
			{
				type: "object",
				properties: {
					disallow: { type: "boolean" },
				},
				additionalProperties: false,
			},
		],
		messages: {
			[MESSAGE_ID]: "Prefer `node:{{ moduleName }}` over `{{ moduleName }}`.",
			[MESSAGE_ID_DISALLOW]:
				"Prefer `{{ moduleName }}` over `node:{{ moduleName }}`.",
		},
	},
	create: function (context) {
		function preferNodePrefix(source) {
			if (typeof source.value !== "string") {
				return;
			}

			const moduleName = source.value;
			if (!nodeBuiltins.has(moduleName)) {
				return;
			}

			context.report({
				node: source,
				messageId: MESSAGE_ID,
				data: { moduleName },
				/** @param {import('eslint').Rule.RuleFixer} fixer */
				fix: (fixer) => {
					const start = source.range[0] + 1;
					return fixer.replaceTextRange([start, start], PREFIX);
				},
			});
		}

		function disallowNodePrefix(source) {
			if (typeof source.value !== "string") {
				return;
			}

			const moduleName = source.value;
			if (!moduleName.startsWith(PREFIX)) {
				return;
			}

			context.report({
				node: source,
				messageId: MESSAGE_ID_DISALLOW,
				data: { moduleName: moduleName.slice(PREFIX_LENGTH) },
				/** @param {import('eslint').Rule.RuleFixer} fixer */
				fix: (fixer) => {
					const start = source.range[0] + 1;
					return fixer.replaceTextRange([start, start + PREFIX_LENGTH], "");
				},
			});
		}

		const literalVisitor = !context.options[0]?.disallow
			? preferNodePrefix
			: disallowNodePrefix;

		return {
			ImportDeclaration(node) {
				return literalVisitor(node.source);
			},
			ExportNamedDeclaration(node) {
				if (node.source?.type === "Literal") return literalVisitor(node.source);
			},
			ImportExpression(node) {
				return literalVisitor(node.source);
			},

			CallExpression(node) {
				if (node.callee.name !== "require") {
					return;
				}

				if (node.arguments.length !== 1) {
					return;
				}

				if (node.optional) {
					return;
				}

				const argument = node.arguments[0];

				if (argument.type !== "Literal" || typeof argument.value !== "string") {
					return;
				}

				return literalVisitor(argument);
			},
		};
	},
};
