const nodeImport = require("eslint-plugin-node-import");

module.exports = [
	{
		plugins: { "node-import": nodeImport },
		rules: {
			"node-import/prefer-node-protocol": "error",
		},
	},
];
