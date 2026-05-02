#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const dir = "src/clean_interfaces/interfaces";
const target = "docs/api/overview.md";
const start = "<!-- GENERATED:interface-entrypoints:start -->";
const end = "<!-- GENERATED:interface-entrypoints:end -->";

function walk(root) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(root, entry.name);
    if (entry.isDirectory()) return walk(p);
    return /\.(ts|tsx|js|jsx|mjs|cjs|py|go)$/.test(entry.name) ? [p] : [];
  });
}

function replaceBlock(text, content) {
  const block = `${start}\n${content.trim()}\n${end}`;
  const re = new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`);
  return re.test(text) ? text.replace(re, block) : `${text.trim()}\n\n${block}\n`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const files = walk(dir);
const content = files.length
  ? files.map((file) => `- \`${file.split(path.sep).join("/")}\``).join("\n")
  : "No `src/clean_interfaces/interfaces` directory found yet.";

fs.mkdirSync("docs/api", { recursive: true });
const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "# Use Cases\n\n";
fs.writeFileSync(target, replaceBlock(existing, content), "utf8");
console.log(`Generated ${target}`);
