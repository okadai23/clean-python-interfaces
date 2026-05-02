#!/usr/bin/env node
import { runNodeScript, runPnpmScript, runPythonScript, writeText } from "./lib/runner.mjs";

runNodeScript("scripts/verify-fast.mjs");
runPnpmScript("test:integration");
runPnpmScript("test:e2e");
runNodeScript("scripts/docs/verify-docs.mjs");
runPythonScript("scripts/secret-scan.py");
writeText(".harness/last_verify_passed", `${new Date().toISOString()}\n`);

