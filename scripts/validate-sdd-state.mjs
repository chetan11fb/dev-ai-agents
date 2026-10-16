#!/usr/bin/env node
import { readFile, stat } from "node:fs/promises";
import { resolve, relative, isAbsolute, sep } from "node:path";

const featureDir = resolve(process.argv[2] ?? "");
if (!process.argv[2]) {
  console.error("Usage: node scripts/validate-sdd-state.mjs <feature-directory>");
  process.exit(2);
}
const errors = [];
const statePath = resolve(featureDir, "sdd-state.json");
const schemaPath = resolve("installer/sdd-kit/.specify/schemas/sdd-state.schema.json");
let state, schema;
try { state = JSON.parse(await readFile(statePath, "utf8")); }
catch (e) { console.error(`Cannot parse ${statePath}: ${e.message}`); process.exit(1); }
try { schema = JSON.parse(await readFile(schemaPath, "utf8")); }
catch (e) { console.error(`Cannot parse canonical state schema: ${e.message}`); process.exit(1); }

const states = schema.properties?.status?.enum ?? [];
if (state.schemaVersion !== 1) errors.push("schemaVersion must be 1");
for (const key of ["feature","featurePath","status","risk","artifacts","approvals","stale","blockingIssue","nextAction"]) {
  if (!(key in state)) errors.push(`Missing required state field: ${key}`);
}
if (!states.includes(state.status)) errors.push(`Unknown lifecycle status: ${state.status}`);
if (!["UNKNOWN","LOW","MEDIUM","HIGH","CRITICAL"].includes(state.risk)) errors.push(`Unknown risk level: ${state.risk}`);
if (state.featurePath && resolve(state.featurePath) !== featureDir) errors.push("featurePath must resolve to the supplied feature directory");
for (const name of ["spec","plan","tasks"]) {
  const artifact = state.artifacts?.[name];
  if (!artifact) { errors.push(`Missing artifacts.${name}`); continue; }
  if (!artifact.path || typeof artifact.path !== "string") { errors.push(`artifacts.${name}.path must be a relative path`); continue; }
  if (isAbsolute(artifact.path)) { errors.push(`artifacts.${name}.path must be relative`); continue; }
  const target = resolve(featureDir, artifact.path);
  const rel = relative(featureDir, target);
  if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) { errors.push(`artifacts.${name}.path escapes the feature directory`); continue; }
  const status = artifact.status;
  if (!["CURRENT","MISSING","STALE","NOT_CREATED"].includes(status)) errors.push(`Invalid artifacts.${name}.status: ${status}`);
  if (status === "CURRENT" || status === "STALE") {
    try {
      await stat(target);
      const body = await readFile(target, "utf8");
      const match = body.match(/^SDD Revision:\s*(R[0-9]+)\s*$/m);
      if (!match) errors.push(`${artifact.path} has no canonical 'SDD Revision: Rn' metadata`);
      else if (artifact.revision !== match[1]) errors.push(`State revision for ${name} (${artifact.revision}) does not match ${artifact.path} (${match[1]})`);
    } catch { errors.push(`Artifact ${name} marked ${status} but file is missing/unreadable: ${artifact.path}`); }
  }
  const approval = state.approvals?.[name];
  if (!approval) errors.push(`Missing approvals.${name}`);
  else if (approval.status === "APPROVED") {
    if (!approval.revision || approval.revision !== artifact.revision) errors.push(`Approval for ${name} does not match current artifact revision`);
    if (status !== "CURRENT") errors.push(`Approval for ${name} cannot remain APPROVED while artifact status is ${status}`);
  }
}
for (const name of ["constitution","spec","plan","tasks","final"]) {
  if (!state.approvals?.[name]) errors.push(`Missing approvals.${name}`);
  else if (!["NOT_REQUIRED","PENDING","APPROVED","STALE","REJECTED"].includes(state.approvals[name].status)) errors.push(`Invalid approvals.${name}.status`);
}
if (["IMPLEMENTATION_READY","IMPLEMENTING","VALIDATING","CONVERGING","CONVERGED","FINAL_REVIEW_REQUIRED","DONE"].includes(state.status)) {
  for (const name of ["spec","plan","tasks"]) if (state.approvals?.[name]?.status !== "APPROVED") errors.push(`${state.status} requires approved ${name}`);
}
if (state.status === "DONE" && (state.stale?.length || ["spec","plan","tasks"].some(name => state.artifacts?.[name]?.status !== "CURRENT"))) errors.push("DONE requires current artifacts and an empty stale list");
if (errors.length) {
  console.error("SDD state validation FAILED:\n- " + errors.join("\n- "));
  process.exit(1);
}
console.log(`SDD state valid: ${state.feature} [${state.status}], risk ${state.risk}.`);
