/**
 * @fileoverview Disallow imports of built-in Node.js modules without the `node:` prefix
 * @author Nikita Karamov
 */
"use strict";

/** @import { ESLint } from 'eslint' */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const preferNodeProtocol = require("./rules/prefer-node-protocol");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const { name, version } = require("../package.json");

/** @type {ESLint.Plugin} */
const plugin = {
	meta: { name, version },
	configs: {},
	rules: {
		// import all rules in lib/rules
		"prefer-node-protocol": preferNodeProtocol,
	},
};

Object.assign(plugin.configs, {
		}
	"recommended": {
		plugins: ["node-import"],
		env: { node: true },
		rules: {
			"node-import/prefer-node-protocol": "error"
		}
	}
})

module.exports = plugin;
