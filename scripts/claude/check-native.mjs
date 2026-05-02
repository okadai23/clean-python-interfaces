#!/usr/bin/env node
import fs from "node:fs";

const requiredFiles = [
  "CLAUDE.md",
  "AGENTS.md",
  ".claude/README.md",
  ".claude/settings.json",
  ".claude/agents/pr-explorer.md",
  ".claude/agents/bug-hunter.md",
  ".claude/agents/security-reviewer.md",
  ".claude/agents/architecture-reviewer.md",
  ".claude/agents/e2e-reviewer.md",
  ".claude/agents/doc-impact-reviewer.md",
  ".claude/agents/staff-plan-reviewer.md",
  ".claude/agents/github-maintainer.md",
  ".claude/commands/shape-task.md",
  ".claude/commands/implement-prototype.md",
  ".claude/commands/review-branch.md",
  ".claude/commands/session-retrospective.md",
  ".claude/commands/publish-agent-fix.md",
  ".claude/skills/karpathy-guidelines/SKILL.md",
  ".claude/skills/codex-task-shaping/SKILL.md",
  ".claude/skills/clean-tdd-prototype/SKILL.md",
  ".claude/skills/doc-maintenance/SKILL.md",
  ".claude/skills/research-plan-execute-review-ship/SKILL.md",
  ".claude/skills/pr-review-checklist/SKILL.md",
  ".claude/skills/failure-to-harness/SKILL.md",
  ".claude/skills/security-review/SKILL.md",
  ".claude/skills/architecture-review/SKILL.md",
  ".claude/skills/e2e-review/SKILL.md",
  ".claude/skills/github-issue-pr-automation/SKILL.md"
];

const missing = requiredFiles.filter((file) => !fs.existsSync(file));
const formatIssues = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file) || !file.endsWith(".md")) continue;
  const text = fs.readFileSync(file, "utf8");
  if ((file.includes("/agents/") || file.includes("/commands/") || file.includes("/skills/")) && !text.startsWith("---\n")) {
    formatIssues.push(`${file}: missing YAML frontmatter`);
  }
}

try {
  JSON.parse(fs.readFileSync(".claude/settings.json", "utf8"));
} catch (error) {
  formatIssues.push(`.claude/settings.json: invalid JSON (${error.message})`);
}

if (missing.length || formatIssues.length) {
  if (missing.length) {
    console.error("Missing Claude native files:");
    for (const file of missing) console.error(`- ${file}`);
  }
  if (formatIssues.length) {
    console.error("Claude native format issues:");
    for (const issue of formatIssues) console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Claude native check passed: ${requiredFiles.length} files.`);
