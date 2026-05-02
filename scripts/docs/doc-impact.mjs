#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const indexPath = "docs/_meta/doc-index.yaml";
const baseRef = process.env.DOCS_BASE_REF || "HEAD";

function parseDocIndex(text) {
  const docs = [];
  let current = null;
  let activeList = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/\s+$/, "");
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const docMatch = trimmed.match(/^-\s+path:\s*(.+)$/);
    if (docMatch) {
      current = { path: unquote(docMatch[1]), update_when: [] };
      docs.push(current);
      activeList = null;
      continue;
    }
    if (!current) continue;
    const scalar = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (scalar) {
      const [, key, value] = scalar;
      if (value === "") {
        activeList = key;
        if (!Array.isArray(current[key])) current[key] = [];
      } else {
        current[key] = unquote(value);
        activeList = null;
      }
      continue;
    }
    const item = trimmed.match(/^-\s+(.+)$/);
    if (item && activeList) {
      current[activeList].push(unquote(item[1]));
    }
  }
  return { documents: docs };
}

function unquote(value) {
  return String(value).replace(/^["']|["']$/g, "");
}

function changedFiles() {
  const files = new Set();
  try {
    const cmd = baseRef === "HEAD"
      ? "git diff --name-only HEAD"
      : `git diff --name-only ${baseRef}...HEAD`;
    const out = childProcess.execSync(cmd, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (out) {
      for (const file of out.split(/\r?\n/).filter(Boolean)) files.add(file);
    }
    const untracked = childProcess.execSync("git ls-files --others --exclude-standard", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    }).trim();
    if (untracked) {
      for (const file of untracked.split(/\r?\n/).filter(Boolean)) files.add(file);
    }
    if (files.size) return [...files];
  } catch {
    // Not a git repo or no base ref. Fall back to all known source-like paths.
  }
  return collectFiles(".");
}

function collectFiles(dir) {
  const skip = new Set([".git", "node_modules", ".next", "dist", "build", "coverage"]);
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...collectFiles(p));
    else result.push(p.split(path.sep).join("/").replace(/^\.\//, ""));
  }
  return result;
}

function matches(file, pattern) {
  const f = file.split(path.sep).join("/");
  const p = pattern.replace(/^\.\//, "");
  if (p.endsWith("/**")) return f.startsWith(p.slice(0, -3));
  if (p.includes("**")) {
    const re = new RegExp("^" + escapeRegex(p).replace(/\\\*\\\*/g, ".*").replace(/\\\*/g, "[^/]*") + "$");
    return re.test(f);
  }
  if (p.includes("*")) {
    const re = new RegExp("^" + escapeRegex(p).replace(/\\\*/g, "[^/]*") + "$");
    return re.test(f);
  }
  return f === p;
}

function escapeRegex(s) {
  return s.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

if (!fs.existsSync(indexPath)) {
  console.log("No docs/_meta/doc-index.yaml found. Documentation impact skipped.");
  process.exit(0);
}

const index = parseDocIndex(fs.readFileSync(indexPath, "utf8"));
const changed = changedFiles();
const impacted = [];

for (const doc of index.documents ?? []) {
  const patterns = doc.update_when ?? [];
  const matched = changed.filter((file) => patterns.some((pattern) => matches(file, pattern)));
  if (matched.length) impacted.push({ ...doc, matched });
}

if (!impacted.length) {
  console.log("No documentation impact detected.");
  process.exit(0);
}

console.log("Documentation impact detected:");
for (const item of impacted) {
  console.log(`- ${item.path} (${item.type ?? "unknown"})`);
  for (const file of item.matched.slice(0, 10)) console.log(`  - ${file}`);
  if (item.matched.length > 10) console.log(`  - ...and ${item.matched.length - 10} more`);
  if (item.generator) console.log(`  generator: ${item.generator}`);
}

if (process.env.DOCS_IMPACT_STRICT === "1") {
  const changedSet = new Set(changed);
  const missing = impacted.filter((doc) => doc.type !== "generated" && !changedSet.has(doc.path));
  if (missing.length) {
    console.error("\nMissing documentation updates:");
    for (const doc of missing) console.error(`- ${doc.path}`);
    process.exit(1);
  }
}
