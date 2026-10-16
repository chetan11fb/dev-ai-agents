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

const timestamp = "2026-10-17T00:00:00Z";
const approval = (revision=null,status="PENDING",decision=null,approvedAt=null) => ({revision,status,decision,approvedAt});
const baseState = () => ({
  schemaVersion:1, feature:"example-feature", featurePath:"specs/001-example-feature", status:"SPEC_REVIEW_REQUIRED", risk:"LOW",
  constitution:{path:".specify/memory/constitution.md",revision:"C1",status:"RATIFIED",approvedAt:timestamp},
  artifacts:{spec:{path:"spec.md",revision:"R1",status:"CURRENT"},plan:{path:"plan.md",revision:null,status:"MISSING"},tasks:{path:"tasks.md",revision:null,status:"MISSING"}},
  approvals:{constitution:approval("C1","APPROVED","APPROVE",timestamp),spec:approval(),plan:approval(),tasks:approval(),final:approval()},
  analysis:{status:"NOT_RUN",completedAt:null}, verification:{status:"NOT_RUN",completedAt:null}, convergence:{status:"NOT_RUN",completedAt:null},
  stale:[],blockingIssue:null,nextAction:"Review spec",finalRevision:null
});
const fullyApprovedState = () => {
  const state=baseState();
  state.status="DONE";
  state.artifacts.plan={path:"plan.md",revision:"R1",status:"CURRENT"};
  state.artifacts.tasks={path:"tasks.md",revision:"R1",status:"CURRENT"};
  state.approvals.spec=approval("R1","APPROVED","APPROVE",timestamp);
  state.approvals.plan=approval("R1","APPROVED","APPROVE",timestamp);
  state.approvals.tasks=approval("R1","APPROVED","APPROVE",timestamp);
  state.analysis={status:"PASS",completedAt:timestamp};
  state.verification={status:"PASS",completedAt:timestamp};
  state.convergence={status:"PASS",completedAt:timestamp};
  state.finalRevision="F1";
  state.approvals.final=approval("F1","APPROVED","APPROVE",timestamp);
  return state;
};
const tempDir = await mkdtemp(join(root, ".sdd-contract-test-"));
try {
  const statePath = join(tempDir,"state.json");
  const runState = async state => {
    await writeFile(statePath,JSON.stringify(state,null,2));
    return spawnSync(process.execPath,[validatorPath,statePath],{encoding:"utf8"});
  };
  const expectPass = async (state,label) => {
    const run=await runState(state);
    assert.equal(run.status,0,`${label}: ${run.stderr || run.stdout}`);
  };
  const expectFail = async (state,label,expectedText) => {
    const run=await runState(state);
    assert.notEqual(run.status,0,`${label}: validator unexpectedly passed`);
    if(expectedText) assert((run.stderr+run.stdout).includes(expectedText),`${label}: expected error not found in ${run.stderr+run.stdout}`);
  };

  await expectPass(baseState(),"spec review state should be valid");
  const staleApproval=baseState();
  staleApproval.status="SPEC_APPROVED";
  staleApproval.approvals.spec=approval("R0","APPROVED","APPROVE",timestamp);
  await expectFail(staleApproval,"stale spec approval","approval revision does not match current artifact revision");

  const unratified=baseState();
  unratified.constitution.status="DRAFT";
  await expectFail(unratified,"draft constitution must block feature workflow","requires a RATIFIED constitution");

  const unexpectedField=baseState();
  unexpectedField.chatMemoryApproval=true;
  await expectFail(unexpectedField,"unknown state fields must be rejected","unsupported field");

  const prematureImplementation=baseState();
  prematureImplementation.status="IMPLEMENTATION_READY";
  await expectFail(prematureImplementation,"implementation readiness requires approved artifacts","requires approval of the current spec revision");

  const noVerification=fullyApprovedState();
  noVerification.status="CONVERGING";
  noVerification.verification={status:"NOT_RUN",completedAt:null};
  noVerification.convergence={status:"RUNNING",completedAt:null};
  noVerification.approvals.final=approval();
  noVerification.finalRevision=null;
  await expectFail(noVerification,"convergence requires passing verification","requires current passing verification");

  const noConvergence=fullyApprovedState();
  noConvergence.convergence={status:"RUNNING",completedAt:null};
  noConvergence.approvals.final=approval();
  noConvergence.finalRevision=null;
  await expectFail(noConvergence,"completion requires passing convergence","requires passing convergence");

  const noFinalApproval=fullyApprovedState();
  noFinalApproval.approvals.final=approval();
  await expectFail(noFinalApproval,"DONE requires final approval","DONE requires final approval");

  await expectPass(fullyApprovedState(),"fully reviewed and verified DONE state should be valid");
} finally {
  await rm(tempDir,{recursive:true,force:true});
}
console.log("SDD contract tests passed: constitution, approval revisions, state schema, analysis, verification, convergence and DONE gates.");
