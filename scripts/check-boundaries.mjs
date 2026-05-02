#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const src = path.join(root, "src", "clean_interfaces");

const rules = [
  {
    name: "core modules must not depend on app, main, or interfaces",
    from: /^src\/clean_interfaces\/(base|types)\.py$/,
    deny: [
      "clean_interfaces.app",
      "clean_interfaces.main",
      "clean_interfaces.interfaces"
    ]
  },
  {
    name: "models must not depend on app, main, interfaces, or utilities",
    from: /^src\/clean_interfaces\/models\//,
    deny: [
      "clean_interfaces.app",
      "clean_interfaces.main",
      "clean_interfaces.interfaces",
      "clean_interfaces.utils"
    ]
  },
  {
    name: "utilities must not depend on app, main, or interfaces",
    from: /^src\/clean_interfaces\/utils\//,
    deny: [
      "clean_interfaces.app",
      "clean_interfaces.main",
      "clean_interfaces.interfaces"
    ]
  },
  {
    name: "interfaces must not depend on the application composition root",
    from: /^src\/clean_interfaces\/interfaces\//,
    deny: [
      "clean_interfaces.app",
      "clean_interfaces.main"
    ]
  }
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    if (entry.name === "__pycache__" || entry.name === ".git") return [];
    if (entry.isDirectory()) return walk(p);
    return entry.name.endsWith(".py") ? [p] : [];
  });
}

function normalize(p) {
  return p.split(path.sep).join("/");
}

function importedModules(text) {
  const imports = [];
  for (const match of text.matchAll(/^\s*from\s+([A-Za-z_][A-Za-z0-9_.]*)\s+import\s+/gm)) {
    imports.push(match[1]);
  }
  for (const match of text.matchAll(/^\s*import\s+([A-Za-z_][A-Za-z0-9_.]*)/gm)) {
    imports.push(match[1]);
  }
  return imports;
}

function violates(imported, denied) {
  return denied.some((prefix) => imported === prefix || imported.startsWith(`${prefix}.`));
}

const files = walk(src);
const failures = [];

for (const abs of files) {
  const rel = normalize(path.relative(root, abs));
  const text = fs.readFileSync(abs, "utf8");
  const imports = importedModules(text);

  for (const rule of rules) {
    if (!rule.from.test(rel)) continue;
    for (const imported of imports) {
      if (violates(imported, rule.deny)) {
        failures.push(`${rule.name}: ${rel} imports ${imported}`);
      }
    }
  }
}

if (failures.length) {
  console.error("Architecture boundary violations:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(files.length ? `Architecture boundary check passed: ${files.length} Python files.` : "No clean_interfaces source tree found; architecture check skipped.");
