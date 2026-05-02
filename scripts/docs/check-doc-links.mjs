#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

function walk(dir) {
  const skip = new Set([
    ".git",
    ".mypy_cache",
    ".nox",
    ".pytest_cache",
    ".ruff_cache",
    ".venv",
    "__pycache__",
    "build",
    "dist",
    "htmlcov",
    "node_modules",
    "site"
  ]);
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
  for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const href = match[1].split("#")[0];
    if (!href || /^[a-z]+:\/\//i.test(href) || href.startsWith("mailto:")) continue;
    const resolved = path.resolve(path.dirname(file), href);
    if (!fs.existsSync(resolved)) failures.push(`${file}: missing link target ${match[1]}`);
  }
}

if (failures.length) {
  console.error("Documentation link check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Documentation link check passed.");
