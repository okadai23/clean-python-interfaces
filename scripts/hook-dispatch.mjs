#!/usr/bin/env node
import childProcess from "node:child_process";
import { findPython } from "./lib/runner.mjs";

const script = process.argv[2];
const args = process.argv.slice(3);

if (!script) {
  console.error("usage: node scripts/hook-dispatch.mjs <python-hook> [args...]");
  process.exit(2);
}

const python = findPython();
const result = childProcess.spawnSync(python.command, [...python.argsPrefix, script, ...args], {
  shell: process.platform === "win32",
  stdio: "inherit"
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
