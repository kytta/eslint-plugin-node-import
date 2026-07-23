import nodeImport from "eslint-plugin-node-import";

export default [
	{
		plugins: { "node-import": nodeImport },
		rules: {
			"node-import/prefer-node-protocol": "error",
		},
	},
];
