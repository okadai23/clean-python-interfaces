#!/usr/bin/env node
import fs from "node:fs";

const source = "docs/_meta/public-env-vars.yaml";
const target = "docs/guides/environment.md";
const start = "<!-- GENERATED:public-env-vars:start -->";
const end = "<!-- GENERATED:public-env-vars:end -->";

function parseVars(text) {
  const vars = [];
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    const trimmed = raw.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const startVar = trimmed.match(/^-\s+name:\s*(.+)$/);
    if (startVar) {
      current = { name: unquote(startVar[1]) };
      vars.push(current);
      continue;
    }
    if (!current) continue;
    const kv = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (kv) current[kv[1]] = unquote(kv[2]);
  }
  return vars;
}

function unquote(value) {
  return String(value).replace(/^["']|["']$/g, "");
}

function replaceBlock(text, content) {
  const block = `${start}\n${content.trim()}\n${end}`;
  const re = new RegExp(`${escapeRegex(start)}[\\s\\S]*?${escapeRegex(end)}`);
  return re.test(text) ? text.replace(re, block) : `${text.trim()}\n\n${block}\n`;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (!fs.existsSync(source)) {
  console.log(`No ${source}; environment docs skipped.`);
  process.exit(0);
}

const vars = parseVars(fs.readFileSync(source, "utf8"));
const rows = vars.map((v) => {
  const value = v.secret === "true" || v.document_value === "false" ? "_not documented_" : (v.default || v.example || "");
  return `| \`${v.name}\` | ${v.required === "true" ? "yes" : "no"} | \`${value}\` | ${v.secret === "true" ? "yes" : "no"} | ${v.description || ""} |`;
});
const content = [
  "| Name | Required | Example/Default | Secret | Description |",
  "| --- | --- | --- | --- | --- |",
  ...(rows.length ? rows : ["| _none_ | no |  | no |  |"])
].join("\n");

fs.mkdirSync("docs/guides", { recursive: true });
const existing = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : "# Environment\n\n";
fs.writeFileSync(target, replaceBlock(existing, content), "utf8");
console.log(`Generated ${target}`);
