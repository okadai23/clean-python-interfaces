#!/usr/bin/env node
import fs from "node:fs";

const target = "docs/development/commands.md";
const start = "<!-- GENERATED:package-commands:start -->";
const end = "<!-- GENERATED:package-commands:end -->";

function replaceBlock(text, content) {
  const block = `${start}\n${content.trim()}\n${end}`;
  const re = new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`);
  return re.test(text) ? text.replace(re, block) : `${text.trim()}\n\n${block}\n`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scripts = pkg.scripts ?? {};
const lines = Object.entries(scripts)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([name, command]) => `| \`${name}\` | \`${String(command).replace(/\|/g, "\\|")}\` |`);

const content = [
  "| Script | Command |",
  "| --- | --- |",
  ...(lines.length ? lines : ["| _none_ | _none_ |"])
].join("\n");

fs.mkdirSync("docs/development", { recursive: true });
const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "# Commands\n\n";
fs.writeFileSync(target, replaceBlock(existing, content), "utf8");
console.log(`Generated ${target}`);
