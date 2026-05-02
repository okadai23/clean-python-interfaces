#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const skip = new Set([".git", ".nox", ".venv", "node_modules", ".next", "dist", "build", "site"]);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip.has(entry.name)) return [];
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(p);
    return entry.name.endsWith(".md") ? [p] : [];
  });
}

const failures = [];
for (const file of walk(".")) {
  const text = fs.readFileSync(file, "utf8");
  const fences = [...text.matchAll(/^```([^\n]*)\n[\s\S]*?^```/gm)];
  for (const fence of fences) {
    const info = fence[1].trim();
    if (/test-doc-snippet/.test(info) && /no-run/.test(info)) {
      failures.push(`${file}: snippet cannot be both test-doc-snippet and no-run`);
    }
  }
}

if (failures.length) {
  console.error("Documentation snippet check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Documentation snippet check passed.");
