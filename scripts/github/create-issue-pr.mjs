#!/usr/bin/env node
import childProcess from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = parseArgs(process.argv.slice(2));
const confirm = args.confirm === true;
const title = args.title || "Agent harness maintenance";
const body = readBody(args);
const labels = splitCsv(args.labels || "agent,harness");
const base = args.base || "main";
const branchPrefix = args.branchPrefix || "agent-fix";
const commitMessage = args.commitMessage || `chore: ${title}`;
const prTitle = args.prTitle || title;
const dryRun = !confirm;

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--confirm") {
      result.confirm = true;
    } else if (arg.startsWith("--")) {
      const key = arg.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        result[key] = next;
        i += 1;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

function splitCsv(value) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function readBody(parsedArgs) {
  if (parsedArgs.bodyFile) {
    return fs.readFileSync(parsedArgs.bodyFile, "utf8");
  }
  if (parsedArgs.body) return parsedArgs.body;
  return [
    "Automated agent maintenance request.",
    "",
    "This issue and PR were created by the agent harness automation.",
    "",
    "Review the diff and CI results before merging."
  ].join("\n");
}

function run(command, commandArgs = [], options = {}) {
  if (dryRun && options.mutates !== false) {
    console.log(`[dry-run] ${[command, ...commandArgs].join(" ")}`);
    return "";
  }

  const result = childProcess.spawnSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
    shell: process.platform === "win32"
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`${command} ${commandArgs.join(" ")} failed with status ${result.status}\n${result.stdout ?? ""}${result.stderr ?? ""}`);
  }
  return (result.stdout ?? "").trim();
}

function capture(command, commandArgs = []) {
  return run(command, commandArgs, { capture: true, mutates: false });
}

function ensureTool(command, argsForVersion = ["--version"]) {
  const result = childProcess.spawnSync(command, argsForVersion, {
    encoding: "utf8",
    stdio: "ignore",
    shell: process.platform === "win32"
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${command} is required. Install/authenticate it before running this automation.`);
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "maintenance";
}

function changedFiles() {
  const out = capture("git", ["status", "--porcelain"]);
  return out.split(/\r?\n/).filter(Boolean);
}

function repoDefaultBranch() {
  try {
    const out = capture("gh", ["repo", "view", "--json", "defaultBranchRef", "--jq", ".defaultBranchRef.name"]);
    return out || base;
  } catch {
    return base;
  }
}

function createIssue() {
  const commandArgs = ["issue", "create", "--title", title, "--body", body];
  for (const label of labels) commandArgs.push("--label", label);
  const url = run("gh", commandArgs, { capture: true });
  if (dryRun) return "https://github.example/dry-run/issues/0";
  console.log(`Created issue: ${url}`);
  return url;
}

function issueNumberFromUrl(url) {
  const match = String(url).match(/\/issues\/(\d+)$/);
  return match ? match[1] : null;
}

function createBranch(issueNumber) {
  const branch = args.branch || `${branchPrefix}/${issueNumber ? `${issueNumber}-` : ""}${slugify(title)}`;
  const current = capture("git", ["branch", "--show-current"]);
  if (current !== branch) {
    run("git", ["checkout", "-B", branch]);
  }
  return branch;
}

function commitAndPush(branch) {
  run("git", ["add", "--all"]);
  run("git", ["commit", "-m", commitMessage]);
  run("git", ["push", "--set-upstream", "origin", branch]);
}

function createPr(issueUrl, branch) {
  const issueNumber = issueNumberFromUrl(issueUrl);
  const linkText = issueNumber ? `Closes #${issueNumber}` : `Related issue: ${issueUrl}`;
  const prBody = [
    body,
    "",
    "## Automation",
    "",
    `- Issue: ${issueUrl}`,
    `- Branch: ${branch}`,
    "",
    linkText
  ].join("\n");

  const commandArgs = [
    "pr",
    "create",
    "--title",
    prTitle,
    "--body",
    prBody,
    "--base",
    base,
    "--head",
    branch
  ];
  const url = run("gh", commandArgs, { capture: true });
  if (dryRun) return "https://github.example/dry-run/pull/0";
  console.log(`Created pull request: ${url}`);
  return url;
}

function main() {
  ensureTool("git");
  ensureTool("gh");

  const changes = changedFiles();
  if (!changes.length) {
    console.log("No working tree changes found. Create/fix files before opening an agent PR.");
    return;
  }

  console.log(`Detected ${changes.length} changed paths.`);
  if (dryRun) {
    console.log("Dry run mode. Pass --confirm to create GitHub issue, branch, commit, push, and PR.");
  }

  const resolvedBase = repoDefaultBranch();
  if (!args.base && resolvedBase) {
    console.log(`Default branch: ${resolvedBase}`);
  }

  const issueUrl = createIssue();
  const issueNumber = issueNumberFromUrl(issueUrl);
  const branch = createBranch(issueNumber);
  commitAndPush(branch);
  const prUrl = createPr(issueUrl, branch);

  console.log(JSON.stringify({ issueUrl, prUrl, branch, dryRun }, null, 2));
}

main();

