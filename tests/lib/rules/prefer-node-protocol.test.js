const RuleTester = require("eslint").RuleTester;

const rule = require("../../../lib/rules/prefer-node-protocol");
const MESSAGE_ID = "prefer-node-protocol";

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
cjsTester.run("prefer-node-protocol (require)", rule, {
	valid: [
		{ code: 'const fs = require("node:fs");' },
		{ code: 'const fs = require("node:fs/promises");' },
		{ code: "const fs = require(fs);" },
		{ code: 'const fs = notRequire("fs");' },
		{ code: 'const fs = foo.require("fs");' },
		{ code: 'const fs = require.resolve("fs");' },
		{ code: "const fs = require(`fs`);" },
		{ code: 'const fs = require?.("fs");' },
		{ code: 'const fs = require("fs", extra);' },
		{ code: "const fs = require();" },
		{ code: 'const fs = require(...["fs"]);' },
		{ code: 'const fs = require("eslint");' },
		{ code: 'const test = require("node:test");' },
	],
	invalid: [
		{
			code: 'const {promises} = require("fs")',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'const {promises} = require("node:fs")',
		},
		{
			code: 'const fs = require("fs/promises")',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'const fs = require("node:fs/promises")',
		},
		{
			code: "const fs = require('fs/promises')",
			errors: [{ messageId: MESSAGE_ID }],
			output: "const fs = require('node:fs/promises')",
		},
	],
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
esmTester.run("prefer-node-protocol (import)", rule, {
	valid: [
		{ code: 'import eslint from "eslint";' },
		{ code: 'import fs from "./fs";' },
		{ code: 'import fs from "unknown-builtin-module";' },
		{ code: 'import fs from "node:fs";' },
		{ code: "async function foo() {\nconst fs = await import(fs);\n}" },
		{ code: "async function foo() {\nconst fs = await import(0);\n}" },
		{ code: "async function foo() {\nconst fs = await import(`fs`);\n}" },
		{ code: 'import "punycode/"' },
		{ code: 'export const DEFAULT_REGION = "alt-ww"' },
		{ code: 'import test from "node:test";' },
	],
	invalid: [
		{
			code: 'import fs from "fs";',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'import fs from "node:fs";',
		},
		{
			code: 'export {promises} from "fs";',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'export {promises} from "node:fs";',
		},
		{
			code: 'async function foo() {\nconst fs = await import("fs");\n}',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'async function foo() {\nconst fs = await import("node:fs");\n}',
		},
		{
			code: 'import fs from "fs/promises";',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'import fs from "node:fs/promises";',
		},
		{
			code: 'export {default} from "fs/promises";',
			errors: [{ messageId: MESSAGE_ID }],
			output: 'export {default} from "node:fs/promises";',
		},
		{
			code: "import fs from 'fs';",
			errors: [{ messageId: MESSAGE_ID }],
			output: "import fs from 'node:fs';",
		},
	],
});
