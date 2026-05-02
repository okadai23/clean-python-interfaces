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

function frontmatter(text) {
  if (!text.startsWith("---\n")) return null;
  const end = text.indexOf("\n---", 4);
  if (end === -1) return null;
  const data = {};
  for (const line of text.slice(4, end).split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (match) data[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }
  return data;
}

const today = new Date();
const stale = [];
for (const file of walk("docs")) {
  const fm = frontmatter(fs.readFileSync(file, "utf8"));
  if (!fm?.last_reviewed || !fm?.stale_after_days) continue;
  const reviewed = new Date(`${fm.last_reviewed}T00:00:00Z`);
  const days = Number(fm.stale_after_days);
  if (!Number.isFinite(days)) continue;
  const ageDays = Math.floor((today - reviewed) / 86400000);
  if (ageDays > days) stale.push(`${file}: last_reviewed=${fm.last_reviewed}, stale_after_days=${days}`);
}

if (stale.length) {
  console.error("Stale documentation found:");
  for (const item of stale) console.error(`- ${item}`);
  process.exit(1);
}

console.log("Documentation staleness check passed.");
