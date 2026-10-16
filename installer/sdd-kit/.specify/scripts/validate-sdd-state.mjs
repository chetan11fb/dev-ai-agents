#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

if (!process.argv[2]) {
  console.error("Usage: node .specify/scripts/validate-sdd-state.mjs <path-to-sdd-state.json>");
  process.exit(2);
}
const file = resolve(process.argv[2]);
let state;
try {
  state = JSON.parse(await readFile(file, "utf8"));
} catch (error) {
  console.error(`SDD state is not readable valid JSON: ${error.message}`);
  process.exit(1);
}
const errors = [];
const states = new Set(["INITIALIZING","CONSTITUTION_REVIEW_REQUIRED","READY_FOR_SPEC","SPECIFYING","SPEC_REVIEW_REQUIRED","SPEC_APPROVED","PLANNING","PLAN_REVIEW_REQUIRED","PLAN_APPROVED","TASKING","TASK_REVIEW_REQUIRED","TASKS_APPROVED","ANALYZING","IMPLEMENTATION_READY","IMPLEMENTING","VALIDATING","CONVERGING","CONVERGED","FINAL_REVIEW_REQUIRED","DONE","BLOCKED"]);
const risks = new Set(["UNKNOWN","LOW","MEDIUM","HIGH","CRITICAL"]);
const approvalStatuses = new Set(["NOT_REQUIRED","PENDING","APPROVED","REJECTED","STALE"]);
const artifactStatuses = new Set(["MISSING","DRAFT","CURRENT","STALE"]);
const isObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
function objectAt(parent, key) {
  if (!isObject(parent?.[key])) errors.push(`${key} must be an object`);
  return isObject(parent?.[key]) ? parent[key] : {};
}
function stringAt(value, label, nullable = false) {
  if (!(typeof value === "string" && value.trim()) && !(nullable && value === null)) errors.push(`${label} must be a non-empty string${nullable ? " or null" : ""}`);
}
if (!isObject(state)) {
  errors.push("state root must be an object");
} else {
  if (state.schemaVersion !== 1) errors.push("schemaVersion must be 1");
  stringAt(state.feature, "feature"); stringAt(state.featurePath, "featurePath"); stringAt(state.nextAction, "nextAction"); stringAt(state.finalRevision, "finalRevision", true);
  if (!states.has(state.status)) errors.push(`unsupported status: ${String(state.status)}`);
  if (!risks.has(state.risk)) errors.push(`unsupported risk: ${String(state.risk)}`);
  const constitution = objectAt(state, "constitution");
  stringAt(constitution.path, "constitution.path"); stringAt(constitution.revision, "constitution.revision", true); stringAt(constitution.approvedAt, "constitution.approvedAt", true);
  if (!["MISSING","DRAFT","RATIFIED","STALE"].includes(constitution.status)) errors.push("constitution.status must be MISSING, DRAFT, RATIFIED, or STALE");
  const artifacts = objectAt(state, "artifacts");
  for (const name of ["spec","plan","tasks"]) {
    const artifact = objectAt(artifacts, name);
    stringAt(artifact.path, `artifacts.${name}.path`); stringAt(artifact.revision, `artifacts.${name}.revision`, true);
    if (!artifactStatuses.has(artifact.status)) errors.push(`artifacts.${name}.status is invalid`);
    if (artifact.status === "MISSING" && artifact.revision !== null) errors.push(`artifacts.${name}: MISSING artifact must have null revision`);
    if (artifact.status === "CURRENT" && !artifact.revision) errors.push(`artifacts.${name}: CURRENT artifact needs a revision`);
  }
  const approvals = objectAt(state, "approvals");
  const revisions = {constitution:constitution.revision,spec:artifacts.spec?.revision,plan:artifacts.plan?.revision,tasks:artifacts.tasks?.revision,final:state.finalRevision};
  for (const name of ["constitution","spec","plan","tasks","final"]) {
    const approval = objectAt(approvals, name);
    if (!approvalStatuses.has(approval.status)) errors.push(`approvals.${name}.status is invalid`);
    if (![null,"APPROVE","REJECT"].includes(approval.decision)) errors.push(`approvals.${name}.decision must be APPROVE, REJECT, or null`);
    stringAt(approval.revision, `approvals.${name}.revision`, true); stringAt(approval.approvedAt, `approvals.${name}.approvedAt`, true);
    if (approval.status === "APPROVED") {
      if (approval.decision !== "APPROVE") errors.push(`approvals.${name}: APPROVED requires decision APPROVE`);
      if (!approval.revision || approval.revision !== revisions[name]) errors.push(`approvals.${name}: approval revision does not match current artifact revision`);
      if (!approval.approvedAt) errors.push(`approvals.${name}: APPROVED requires approvedAt`);
    }
  }
  const analysis = objectAt(state, "analysis");
  if (!["NOT_RUN","PASS","FAIL","STALE"].includes(analysis.status)) errors.push("analysis.status is invalid");
  stringAt(analysis.completedAt, "analysis.completedAt", true);
  if (!Array.isArray(state.stale) || state.stale.some(item => typeof item !== "string")) errors.push("stale must be an array of strings");
  if (!(state.blockingIssue === null || typeof state.blockingIssue === "string")) errors.push("blockingIssue must be a string or null");
  const rank = new Map([["SPEC_APPROVED",1],["PLANNING",1],["PLAN_REVIEW_REQUIRED",1],["PLAN_APPROVED",2],["TASKING",2],["TASK_REVIEW_REQUIRED",2],["TASKS_APPROVED",3],["ANALYZING",3],["IMPLEMENTATION_READY",4],["IMPLEMENTING",4],["VALIDATING",4],["CONVERGING",4],["CONVERGED",4],["FINAL_REVIEW_REQUIRED",4],["DONE",4]]);
  const required = rank.get(state.status) ?? 0;
  if (required >= 1 && !(approvals.spec?.status === "APPROVED" && approvals.spec?.revision === artifacts.spec?.revision)) errors.push(`${state.status} requires approval of the current spec revision`);
  if (required >= 2 && !(approvals.plan?.status === "APPROVED" && approvals.plan?.revision === artifacts.plan?.revision)) errors.push(`${state.status} requires approval of the current plan revision`);
  if (required >= 3 && !(approvals.tasks?.status === "APPROVED" && approvals.tasks?.revision === artifacts.tasks?.revision)) errors.push(`${state.status} requires approval of the current tasks revision`);
  if (required >= 4 && analysis.status !== "PASS") errors.push(`${state.status} requires a current passing analysis`);
  const featureStates = ["READY_FOR_SPEC","SPECIFYING","SPEC_REVIEW_REQUIRED","SPEC_APPROVED","PLANNING","PLAN_REVIEW_REQUIRED","PLAN_APPROVED","TASKING","TASK_REVIEW_REQUIRED","TASKS_APPROVED","ANALYZING","IMPLEMENTATION_READY","IMPLEMENTING","VALIDATING","CONVERGING","CONVERGED","FINAL_REVIEW_REQUIRED","DONE"];
  if (featureStates.includes(state.status) && constitution.status !== "RATIFIED") errors.push(`${state.status} requires a RATIFIED constitution`);
  if (["IMPLEMENTING","VALIDATING","CONVERGING","CONVERGED","FINAL_REVIEW_REQUIRED","DONE"].includes(state.status) && state.stale?.length) errors.push(`${state.status} cannot proceed while stale items remain`);
  if (state.status === "DONE" && approvals.final?.status !== "APPROVED") errors.push("DONE requires final approval to be APPROVED");
}
if (errors.length) {
  console.error("SDD state validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`SDD state valid: ${state.feature} [${state.status}]`);
