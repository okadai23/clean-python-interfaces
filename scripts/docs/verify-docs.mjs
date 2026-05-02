#!/usr/bin/env node
import { runNodeScript, runPythonScript } from "../lib/runner.mjs";

runNodeScript("scripts/docs/doc-impact.mjs");
runNodeScript("scripts/docs/generate-docs.mjs");
runNodeScript("scripts/docs/check-doc-links.mjs");
runNodeScript("scripts/docs/check-doc-snippets.mjs");
runPythonScript("scripts/docs/check-doc-secrets.py");
runNodeScript("scripts/docs/check-doc-staleness.mjs");

