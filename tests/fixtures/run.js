#!/usr/bin/env node
/**
 * Run every configs.yaml × {in,}valid.{c,m}js combination via npx eslint.
 */
"use strict";

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const fixturesDir = __dirname;
const FILES = ["valid.cjs", "valid.mjs", "invalid.cjs", "invalid.mjs"];

/** @returns {{ eslint: number, config: string }[]} */
function loadMatrix(filePath) {
	const configs = [];
	let current;
	for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
		const t = line.trim();
		if (!t || t.startsWith("#")) continue;

		const mEslint = /^- eslint:\s*(\d+)\s*$/.exec(t);
		if (mEslint) {
			current = { eslint: Number(mEslint[1]) };
			configs.push(current);
			continue;
		}

		const mConfig = /^config:\s*(\S+)\s*$/.exec(t);
		if (mConfig && current) {
			current.config = mConfig[1];
		}
	}
	return configs;
}

/** Set ESLINT_USE_FLAT_CONFIG where the version defaults would otherwise mismatch. */
function envFor(eslint, config) {
	const env = { ...process.env };
	const isFlat = config.startsWith("eslint.config");
	// v8 enables flat when any eslint.config.* is present (fixtures has both).
	if (eslint === 8) env.ESLINT_USE_FLAT_CONFIG = isFlat ? "true" : "false";
	if (eslint === 9 && !isFlat) env.ESLINT_USE_FLAT_CONFIG = "false";
	return env;
}

function main() {
	const filterArg = process.env.ESLINT_VERSION ?? process.argv[2];
	const filterEslint = filterArg === undefined ? null : Number(filterArg);
	if (filterEslint !== null && !Number.isInteger(filterEslint)) {
		console.error(`Invalid ESLint version filter: ${filterArg}`);
		process.exitCode = 1;
		return;
	}

	const matrix = loadMatrix(path.join(fixturesDir, "configs.yaml")).filter(
		({ eslint }) => filterEslint === null || eslint === filterEslint,
	);
	if (matrix.length === 0) {
		console.error(
			filterEslint === null
				? "No configs found in configs.yaml"
				: `No configs found for ESLint ${filterEslint}`,
		);
		process.exitCode = 1;
		return;
	}

	let passed = 0;
	let failed = 0;

	for (const { eslint, config } of matrix) {
		for (const file of FILES) {
			const expectOk = file.startsWith("valid");
			const label = `eslint@${eslint} -c ${config} ${file}`;

			const result = spawnSync(
				"npx",
				["-y", `eslint@${eslint}`, "-c", config, file],
				{
					cwd: fixturesDir,
					env: envFor(eslint, config),
					encoding: "utf8",
				},
			);

			const ok = expectOk ? result.status === 0 : result.status !== 0;
			if (ok) {
				passed++;
				console.log(`PASS ${label}`);
			} else {
				failed++;
				console.error(
					`FAIL ${label} (exit ${result.status}, expected ${expectOk ? "0" : "non-zero"})`,
				);
				if (result.stdout) console.error(result.stdout);
				if (result.stderr) console.error(result.stderr);
			}
		}
	}

	console.log(`\n${passed} passed, ${failed} failed`);
	process.exitCode = failed > 0 ? 1 : 0;
}

main();
