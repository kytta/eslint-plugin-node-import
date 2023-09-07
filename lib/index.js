/**
 * @fileoverview Disallow imports of built-in Node.js modules without the `node:` prefix
 * @author Nikita Karamov
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const preferNodeProtocol = require("./rules/prefer-node-protocol");

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules
module.exports.rules = {
	"prefer-node-protocol": preferNodeProtocol,
};
