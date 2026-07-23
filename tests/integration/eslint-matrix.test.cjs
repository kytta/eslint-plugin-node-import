"use strict";

const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const path = require("node:path");

const fixturesDir = path.resolve(__dirname, "../fixtures");

const FILES = ["valid.cjs", "valid.mjs", "invalid.cjs", "invalid.mjs"];
const LEGACY_CONFIGS = [".eslintrc.cjs", ".eslintrc.recommended.cjs"];
const FLAT_CONFIGS = [
	"eslint.config.cjs",
	"eslint.config.mjs",
	"eslint.config.recommended.cjs",
	"eslint.config.recommended.mjs",
];

const eslintVersion = process.env.ESLINT_VERSION;
if (!eslintVersion) {
	throw new Error("ESLINT_VERSION environment variable is required");
}

const eslintMajor = Number(eslintVersion);
const eslintSpec = `catalog:eslint${eslintMajor}`;
const configs = [];
if (eslintMajor >= 8) configs.push(...FLAT_CONFIGS);
if (eslintMajor < 10) configs.push(...LEGACY_CONFIGS);

describe(`integration: eslint@${eslintSpec}`, function () {
	this.timeout(180000);

	for (const config of configs) {
		for (const file of FILES) {
			const isFlat = config.startsWith("eslint.config");
			const env = { ...process.env };
			if (eslintMajor === 8) env.ESLINT_USE_FLAT_CONFIG = isFlat ? "true" : "false";
			if (eslintMajor === 9 && !isFlat) env.ESLINT_USE_FLAT_CONFIG = "false";
			const expectValid = file.startsWith("valid");
			it(`${config} + ${file}`, function () {
				const result = spawnSync(
					"pnpm",
					[
						"--dir",
						fixturesDir,
						"dlx",
						`eslint@${eslintSpec}`,
						"-c",
						config,
						file,
					],
					{
						cwd: fixturesDir,
						env,
						encoding: "utf8",
					},
				);

				const combinedOutput = `${result.stdout || ""}\n${result.stderr || ""}`;
				const details =
					`exit=${result.status}\n` +
					`command=pnpm --dir ${fixturesDir} dlx eslint@${eslintSpec} -c ${config} ${file}\n` +
					combinedOutput;

				if (expectValid) {
					assert.equal(result.status, 0, details);
					return;
				}

				assert.equal(result.status, 1, details);
				assert.match(combinedOutput, /node-import\/prefer-node-protocol/u, details);
			});
		}
	}
});
