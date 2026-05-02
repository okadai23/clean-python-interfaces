#!/usr/bin/env node
import { runNodeScript } from "../lib/runner.mjs";

runNodeScript("scripts/docs/generate-command-docs.mjs");
runNodeScript("scripts/docs/generate-env-docs.mjs");
runNodeScript("scripts/docs/generate-usecase-docs.mjs");

