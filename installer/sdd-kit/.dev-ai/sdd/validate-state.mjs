#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve, relative, isAbsolute, sep } from "node:path";

const allowedStates = new Set([
  "INITIALIZING", "CONSTITUTION_REVIEW_REQUIRED", "READY_FOR_SPEC", "SPECIFYING",
  "SPEC_REVIEW_REQUIRED", "SPEC_APPROVED", "PLANNING", "PLAN_REVIEW_REQUIRED",
  "PLAN_APPROVED", "TASKING", "TASK_REVIEW_REQUIRED", "TASKS_APPROVED", "ANALYZING",
  "IMPLEMENTATION_READY", "IMPLEMENTING", "VALIDATING", "CONVERGING", "CONVERGED",
  "FINAL_REVIEW_REQUIRED", "DONE", "BLOCKED"
]);
const artifactNames = ["spec", "plan", "tasks"];
const approvalNames = ["constitution", "spec", "plan", "tasks", "final"];
const approvalStatuses = new Set(["PENDING", "APPROVED", "NOT_REQUIRED", "STALE"]);
const artifactStatuses = new Set(["MISSING", "CURRENT", "STALE"]);
const errors = [];
const fail = (message) => errors.push(message);

const input = process.argv[2];
if (!input) {
  console.error("Usage: node .dev-ai/sdd/validate-state.mjs <feature-folder>");
  process.exit(2);
}
const featureDir = resolve(input);
const statePath = resolve(featureDir, "sdd-state.json");
let state;
try {
  state = JSON.parse(await readFile(statePath, "utf8"));
} catch (error) {
  console.error("SDD state validation failed: cannot read/parse " + statePath + ": " + error.message);
  process.exit(1);
}

if (!state || typeof state !== "object" || Array.isArray(state)) {
  console.error("SDD state validation failed: state root must be a JSON object.");
  process.exit(1);
}

if (state.schemaVersion !== 1) fail("schemaVersion must be 1.");
if (typeof state.feature !== "string" || !state.feature.trim()) fail("feature must be a non-empty string.");
if (typeof state.featurePath !== "string" || !state.featurePath.trim()) fail("featurePath must be a non-empty string.");
if (!allowedStates.has(state.status)) fail("Unknown workflow status: " + String(state.status));
if (!["LOW", "MEDIUM", "HIGH", "CRITICAL", "UNKNOWN"].includes(state.risk)) fail("risk must be LOW, MEDIUM, HIGH, CRITICAL, or UNKNOWN.");
if (!state.artifacts || typeof state.artifacts !== "object") fail("artifacts object is required.");
if (!state.approvals || typeof state.approvals !== "object") fail("approvals object is required.");
if (!Array.isArray(state.stale)) fail("stale must be an array.");
if (state.blockingIssue !== null && typeof state.blockingIssue !== "string") fail("blockingIssue must be a string or null.");
if (typeof state.nextAction !== "string" || !state.nextAction.trim()) fail("nextAction must be a non-empty string.");

const currentRevisions = {};
for (const name of artifactNames) {
  const item = state.artifacts?.[name];
  if (!item || typeof item.path !== "string" || !item.path.trim()) {
    fail("artifacts." + name + ".path is required.");
    continue;
  }
  if (!artifactStatuses.has(item.status)) fail("artifacts." + name + ".status is invalid.");
  if (item.revision !== null && item.revision !== undefined && !/^R[1-9][0-9]*$/.test(item.revision)) {
    fail("artifacts." + name + ".revision must be null or R<number>.");
  }
  const artifactPath = resolve(featureDir, item.path);
  const rel = relative(featureDir, artifactPath);
  if (isAbsolute(rel) || rel === ".." || rel.startsWith(".." + sep)) {
    fail("Artifact path escapes feature folder: " + item.path);
    continue;
  }
  let content = null;
  try { content = await readFile(artifactPath, "utf8"); } catch {}
  if (item.status === "MISSING") {
    if (content !== null) fail(name + " is marked MISSING but file exists: " + item.path);
    if (item.revision !== null && item.revision !== undefined) fail(name + " is MISSING but has revision " + item.revision + ".");
  } else if (item.status === "CURRENT") {
    if (content === null) {
      fail(name + " is marked CURRENT but file is missing: " + item.path);
    } else {
      const match = content.match(/^\s*(?:SDD )?Revision:\s*(R[1-9][0-9]*)\s*$/m);
      if (!match) fail(name + " has no recognized revision metadata line.");
      else {
        currentRevisions[name] = match[1];
        if (item.revision !== match[1]) fail(name + " state revision " + String(item.revision) + " does not match file revision " + match[1] + ".");
      }
    }
  } else if (item.status === "STALE" && state.status !== "BLOCKED" && !(Array.isArray(state.stale) && state.stale.includes(name))) {
    fail(name + " is STALE but is not listed in stale.");
  }
}

for (const name of approvalNames) {
  const approval = state.approvals?.[name];
  if (!approval || !approvalStatuses.has(approval.status)) {
    fail("approvals." + name + ".status is missing or invalid.");
    continue;
  }
  if (approval.status === "APPROVED") {
    if (typeof approval.approvedAt !== "string" || !Number.isFinite(Date.parse(approval.approvedAt))) {
      fail(name + " approval requires an ISO-compatible approvedAt timestamp.");
    }
    if (!approval.dependsOn || typeof approval.dependsOn !== "object" || Array.isArray(approval.dependsOn)) {
      fail(name + " approval requires a dependsOn object.");
    }
    if (name !== "constitution" && name !== "final" && approval.revision !== currentRevisions[name]) {
      fail(name + " approval revision does not match the current artifact revision.");
    }
  }
}

const isApproved = (name) => {
  const approval = state.approvals?.[name];
  return Boolean(approval && approval.status === "APPROVED" &&
    (name === "constitution" || name === "final" || approval.revision === currentRevisions[name]));
};
const checkDependency = (approvalName, dependencyName) => {
  const approval = state.approvals?.[approvalName];
  if (approval?.status === "APPROVED" && approval.dependsOn?.[dependencyName] !== currentRevisions[dependencyName]) {
    fail(approvalName + " approval is stale: dependsOn." + dependencyName + " must equal current " + dependencyName + " revision.");
  }
};
checkDependency("plan", "spec");
checkDependency("tasks", "spec");
checkDependency("tasks", "plan");
checkDependency("final", "spec");
checkDependency("final", "plan");
checkDependency("final", "tasks");

const requiresSpec = new Set([
  "SPEC_APPROVED", "PLANNING", "PLAN_REVIEW_REQUIRED", "PLAN_APPROVED", "TASKING",
  "TASK_REVIEW_REQUIRED", "TASKS_APPROVED", "ANALYZING", "IMPLEMENTATION_READY",
  "IMPLEMENTING", "VALIDATING", "CONVERGING", "CONVERGED", "FINAL_REVIEW_REQUIRED", "DONE"
]);
const requiresPlan = new Set([
  "PLAN_APPROVED", "TASKING", "TASK_REVIEW_REQUIRED", "TASKS_APPROVED", "ANALYZING",
  "IMPLEMENTATION_READY", "IMPLEMENTING", "VALIDATING", "CONVERGING", "CONVERGED",
  "FINAL_REVIEW_REQUIRED", "DONE"
]);
const requiresTasks = new Set([
  "TASKS_APPROVED", "ANALYZING", "IMPLEMENTATION_READY", "IMPLEMENTING", "VALIDATING",
  "CONVERGING", "CONVERGED", "FINAL_REVIEW_REQUIRED", "DONE"
]);
if (requiresSpec.has(state.status) && !isApproved("spec")) fail("Status " + state.status + " requires an approved current spec.");
if (requiresPlan.has(state.status) && !isApproved("plan")) fail("Status " + state.status + " requires an approved current plan.");
if (requiresTasks.has(state.status) && !isApproved("tasks")) fail("Status " + state.status + " requires approved current tasks.");
if (state.status === "DONE" && !isApproved("final")) fail("DONE requires explicit final approval.");
if (state.stale.length > 0 && ["IMPLEMENTATION_READY", "IMPLEMENTING", "VALIDATING", "CONVERGING", "CONVERGED", "DONE"].includes(state.status)) {
  fail("State has stale artifacts but workflow status is " + state.status + "; reconcile before proceeding.");
}

if (errors.length) {
  console.error("SDD state validation FAILED:");
  for (const error of errors) console.error("- " + error);
  process.exit(1);
}
console.log("SDD state validation PASSED: schema fields, artifact paths/revisions, approval timestamps, dependency revisions and phase gates are consistent.");
console.log("Scope: this checks persisted SDD state only; it does not validate source code, test results, or runtime behavior.");
