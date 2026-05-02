#!/usr/bin/env node

const name = process.argv[2] ?? "command";
console.log(`[harness] No project-specific '${name}' command is configured yet. Replace this package script when the app is scaffolded.`);

