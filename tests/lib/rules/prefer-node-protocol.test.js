const RuleTester = require("eslint").RuleTester;

const rule = require("../../../lib/rules/prefer-node-protocol");

const MESSAGE_ID = "prefer-node-protocol";
const MESSAGE_ID_DISALLOW = "prefer-node-protocol:disallow";

const cjsTester = new RuleTester({
	env: {
		node: true,
		commonjs: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "script",
	},
});

const esmTester = new RuleTester({
	env: {
		node: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
});

[[], [{ disallow: false }]].forEach((options) => {
	const suffix = options[0] ? JSON.stringify(options[0]) : "(no options)";
	cjsTester.run(`prefer-node-protocol (require) ${suffix}`, rule, {
		valid: [
			{ code: 'const fs = require("node:fs");', options },
			{ code: 'const fs = require("node:fs/promises");', options },
			{ code: "const fs = require(fs);", options },
			{ code: 'const fs = notRequire("fs");', options },
			{ code: 'const fs = foo.require("fs");', options },
			{ code: 'const fs = require.resolve("fs");', options },
			{ code: "const fs = require(`fs`);", options },
			{ code: 'const fs = require?.("fs");', options },
			{ code: 'const fs = require("fs", extra);', options },
			{ code: "const fs = require();", options },
			{ code: 'const fs = require(...["fs"]);', options },
			{ code: 'const fs = require("eslint");', options },
		],
		invalid: [
			{
				code: 'const {promises} = require("fs")',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'const {promises} = require("node:fs")',
				options,
			},
			{
				code: 'const fs = require("fs/promises")',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'const fs = require("node:fs/promises")',
				options,
			},
			{
				code: "const fs = require('fs/promises')",
				errors: [{ messageId: MESSAGE_ID }],
				output: "const fs = require('node:fs/promises')",
				options,
			},
		],
	});

	esmTester.run(`prefer-node-protocol (import) ${suffix}`, rule, {
		valid: [
			{ code: 'import eslint from "eslint";', options },
			{ code: 'import fs from "./fs";', options },
			{ code: 'import fs from "unknown-builtin-module";', options },
			{ code: 'import fs from "node:fs";', options },
			{
				code: "async function foo() {\nconst fs = await import(fs);\n}",
				options,
			},
			{
				code: "async function foo() {\nconst fs = await import(0);\n}",
				options,
			},
			{
				code: "async function foo() {\nconst fs = await import(`fs`);\n}",
				options,
			},
			{ code: 'import "punycode/"', options },
			{ code: 'export const DEFAULT_REGION = "alt-ww"', options },
		],
		invalid: [
			{
				code: 'import fs from "fs";',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'import fs from "node:fs";',
				options,
			},
			{
				code: 'export {promises} from "fs";',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'export {promises} from "node:fs";',
				options,
			},
			{
				code: 'async function foo() {\nconst fs = await import("fs");\n}',
				errors: [{ messageId: MESSAGE_ID }],
				output:
					'async function foo() {\nconst fs = await import("node:fs");\n}',
				options,
			},
			{
				code: 'import fs from "fs/promises";',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'import fs from "node:fs/promises";',
				options,
			},
			{
				code: 'export {default} from "fs/promises";',
				errors: [{ messageId: MESSAGE_ID }],
				output: 'export {default} from "node:fs/promises";',
				options,
			},
			{
				code: "import fs from 'fs';",
				errors: [{ messageId: MESSAGE_ID }],
				output: "import fs from 'node:fs';",
				options,
			},
		],
	});
});

// ---------------------------------------------------------------------------

const options = [{ disallow: true }];

cjsTester.run("prefer-node-protocol:disallow (require)", rule, {
	valid: [
		{ code: 'const fs = require("fs");', options },
		{ code: 'const fs = require("fs/promises");', options },
		{ code: "const fs = require(fs);", options },
		{ code: 'const fs = notRequire("node:fs");', options },
		{ code: 'const fs = foo.require("node:fs");', options },
		{ code: 'const fs = require.resolve("node:fs");', options },
		{ code: "const fs = require(`node:fs`);", options },
		{ code: 'const fs = require?.("node:fs");', options },
		{ code: 'const fs = require("node:fs", extra);', options },
		{ code: "const fs = require();", options },
		{ code: 'const fs = require(...["node:fs"]);', options },
		{ code: 'const fs = require("eslint");', options },
	],
	invalid: [
		{
			code: 'const {promises} = require("node:fs")',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'const {promises} = require("fs")',
			options,
		},
		{
			code: 'const fs = require("node:fs/promises")',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'const fs = require("fs/promises")',
			options,
		},
		{
			code: "const fs = require('node:fs/promises')",
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: "const fs = require('fs/promises')",
			options,
		},
	],
});

esmTester.run("prefer-node-protocol:disallow (import)", rule, {
	valid: [
		{ code: 'import eslint from "eslint";', options },
		{ code: 'import fs from "./node:fs";', options },
		{ code: 'import fs from "unknown-builtin-module";', options },
		{ code: 'import fs from "fs";', options },
		{
			code: "async function foo() {\nconst fs = await import(fs);\n}",
			options,
		},
		{
			code: "async function foo() {\nconst fs = await import(0);\n}",
			options,
		},
		{
			code: "async function foo() {\nconst fs = await import(`node:fs`);\n}",
			options,
		},
		{ code: 'import "punycode/"', options },
		{ code: 'export const DEFAULT_REGION = "alt-ww"', options },
	],
	invalid: [
		{
			code: 'import fs from "node:fs";',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'import fs from "fs";',
			options,
		},
		{
			code: 'export {promises} from "node:fs";',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'export {promises} from "fs";',
			options,
		},
		{
			code: 'async function foo() {\nconst fs = await import("node:fs");\n}',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'async function foo() {\nconst fs = await import("fs");\n}',
			options,
		},
		{
			code: 'import fs from "node:fs/promises";',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'import fs from "fs/promises";',
			options,
		},
		{
			code: 'export {default} from "node:fs/promises";',
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: 'export {default} from "fs/promises";',
			options,
		},
		{
			code: "import fs from 'node:fs';",
			errors: [{ messageId: MESSAGE_ID_DISALLOW }],
			output: "import fs from 'fs';",
			options,
		},
	],
});
