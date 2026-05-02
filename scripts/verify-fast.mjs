#!/usr/bin/env node
import { runNodeScript, runPnpmScript, runPythonScript } from "./lib/runner.mjs";

runPnpmScript("lint");
runPnpmScript("typecheck");
runPnpmScript("arch", () => runNodeScript("scripts/check-boundaries.mjs"));
runPnpmScript("test:unit");
runPythonScript("scripts/secret-scan.py");
runPythonScript("scripts/harness/run_rule_tests.py");
runNodeScript("scripts/harness/check-diff-scope.mjs");

