#!/usr/bin/env node
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = path => readFile(resolve(root, path), "utf8");
const agent = await read("agents/dev-ai-sdd.agent.md");
const schema = JSON.parse(await read("installer/sdd-kit/.specify/schemas/sdd-state.schema.json"));
const validatorPath = resolve(root, "installer/sdd-kit/.specify/scripts/validate-sdd-state.mjs");
const validator = await read("installer/sdd-kit/.specify/scripts/validate-sdd-state.mjs");
const registry = JSON.parse(await read("registry/marketplace.json"));
const constitution = await read("installer/sdd-kit/.specify/memory/constitution.md");
const specTemplate = await read("installer/sdd-kit/specs/_template/spec.md");
const planTemplate = await read("installer/sdd-kit/specs/_template/plan.md");
const taskTemplate = await read("installer/sdd-kit/specs/_template/tasks.md");
const pkg = JSON.parse(await read("package.json"));

assert.equal(schema.properties.schemaVersion.const, 1);
assert(schema.properties.status.enum.includes("CONVERGED"));
assert(schema.properties.status.enum.includes("TASK_REVIEW_REQUIRED"));
assert(schema.properties.constitution.properties.status.enum.includes("RATIFIED"));
assert(schema.properties.approvals.properties.spec.$ref === "#/$defs/approval");
assert(schema.properties.verification.properties.status.enum.includes("PASS"));
assert(schema.properties.convergence.properties.status.enum.includes("PASS"));
assert(validator.includes("approval revision does not match current artifact revision"));
assert(validator.includes("requires a RATIFIED constitution"));
assert(validator.includes("requires current passing verification"));
assert(validator.includes("requires passing convergence"));
assert(agent.includes("If its status is DRAFT"));
assert(agent.includes("validate-sdd-state.mjs"));
assert(agent.includes("CONVERGED"));
assert(!existsSync(resolve(root, "installer/sdd-kit/specs/_template/sdd-state.md")));
assert(!existsSync(resolve(root, "installer/sdd-kit/specs/_template/decisions.md")));
assert(specTemplate.includes("SDD Revision: R1"));
assert(planTemplate.includes("SDD Revision: R1"));
assert(taskTemplate.includes("SDD Revision: R1"));
assert(pkg.scripts["test:sdd"] === "node scripts/test-sdd-contract.mjs");
assert(registry.components.some(item => item.id === "dev-ai-sdd-templates" && item.version === "1.2.0"));
assert(registry.components.some(item => item.id === "dev-ai-sdd" && item.version === "1.3.0"));
assert(constitution.includes("DRAFT — awaiting explicit human approval"));

const tempDir = await mkdtemp(join(root, ".sdd-contract-test-"));
try {
  const validState = {
    schemaVersion:1, feature:"example-feature", featurePath:"specs/001-example-feature", status:"SPEC_REVIEW_REQUIRED", risk:"LOW",
    constitution:{path:".specify/memory/constitution.md",revision:"C1",status:"RATIFIED",approvedAt:"2026-10-17T00:00:00Z"},
    artifacts:{spec:{path:"spec.md",revision:"R1",status:"CURRENT"},plan:{path:"plan.md",revision:null,status:"MISSING"},tasks:{path:"tasks.md",revision:null,status:"MISSING"}},
    approvals:{
      constitution:{revision:"C1",status:"APPROVED",decision:"APPROVE",approvedAt:"2026-10-17T00:00:00Z"},
      spec:{revision:null,status:"PENDING",decision:null,approvedAt:null},
      plan:{revision:null,status:"PENDING",decision:null,approvedAt:null},
      tasks:{revision:null,status:"PENDING",decision:null,approvedAt:null},
      final:{revision:null,status:"PENDING",decision:null,approvedAt:null}
    },
    analysis:{status:"NOT_RUN",completedAt:null}, verification:{status:"NOT_RUN",completedAt:null}, convergence:{status:"NOT_RUN",completedAt:null},
    stale:[],blockingIssue:null,nextAction:"Review spec",finalRevision:null
  };
  const statePath = join(tempDir,"state.json");
  await writeFile(statePath,JSON.stringify(validState,null,2));
  let run = spawnSync(process.execPath,[validatorPath,statePath],{encoding:"utf8"});
  assert.equal(run.status,0,run.stderr || run.stdout);
  const invalid = structuredClone(validState);
  invalid.status="SPEC_APPROVED";
  invalid.approvals.spec={revision:"R0",status:"APPROVED",decision:"APPROVE",approvedAt:"2026-10-17T00:00:00Z"};
  await writeFile(statePath,JSON.stringify(invalid,null,2));
  run = spawnSync(process.execPath,[validatorPath,statePath],{encoding:"utf8"});
  assert.notEqual(run.status,0,"validator must reject approval for a stale revision");
  assert((run.stderr+run.stdout).includes("approval revision does not match current artifact revision"));
  const premature = structuredClone(validState);
  premature.status="DONE";
  await writeFile(statePath,JSON.stringify(premature,null,2));
  run = spawnSync(process.execPath,[validatorPath,statePath],{encoding:"utf8"});
  assert.notEqual(run.status,0,"validator must reject premature completion");
  assert((run.stderr+run.stdout).includes("DONE requires"));
} finally {
  await rm(tempDir,{recursive:true,force:true});
}
console.log("SDD contract tests passed: workflow, templates, revision-bound approvals, and completion gates.");
