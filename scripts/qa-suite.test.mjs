import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const registry = JSON.parse(await readFile(resolve(root, "registry/marketplace.json"), "utf8"));
const expected = {
  "dev-ai-qa": "agents/qa/dev-ai-qa.agent.md",
  "dev-ai-test-engineer": "agents/qa/dev-ai-test-engineer.agent.md",
  "dev-ai-ecc-e2e-runner": "agents/qa/dev-ai-ecc-e2e-runner.agent.md",
  "dev-ai-ecc-pr-test-analyzer": "agents/qa/dev-ai-ecc-pr-test-analyzer.agent.md",
  "dev-ai-accessibility": "agents/qa/dev-ai-accessibility.agent.md"
};

function component(id) {
  return registry.components.find(item => item.type === "agent" && item.id === id);
}
function frontmatter(source) {
  const match = source.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/);
  assert.ok(match, "valid YAML frontmatter is required");
  return match[1];
}

test("exactly five canonical QA agents are registered under agents/qa", async () => {
  const qa = registry.components.filter(item => item.type === "agent" && item.path.startsWith("agents/qa/"));
  assert.equal(qa.length, 5);
  assert.deepEqual(Object.fromEntries(qa.map(item => [item.id, item.path])), expected);
});

for (const [id, path] of Object.entries(expected)) {
  test(`${id}: source, frontmatter and CLI target are valid`, async () => {
    const item = component(id);
    assert.ok(item, "registry entry must exist");
    assert.equal(item.path, path);
    assert.equal(item.target, `.github/agents/${path.split("/").pop()}`);
    assert.equal(item.installCommand, `npx dev-ai-agents --agent ${id}`);
    assert.equal(item.npmExecCommand, `npm exec --yes --package=dev-ai-agents -- dev-ai-agents --agent ${id}`);
    const source = await readFile(resolve(root, path), "utf8");
    const fm = frontmatter(source);
    assert.match(fm, new RegExp(`^name: ${id}$`, "m"));
    assert.match(fm, /^target: "vscode"$/m);
    assert.match(fm, /^user-invocable: true$/m);
    assert.match(fm, /^tools: \[/m);
    assert.match(source, /PASS/);
  });
}

test("QA responsibilities remain distinct and bounded", async () => {
  const qa = await readFile(resolve(root, expected["dev-ai-qa"]), "utf8");
  const testEngineer = await readFile(resolve(root, expected["dev-ai-test-engineer"]), "utf8");
  const e2e = await readFile(resolve(root, expected["dev-ai-ecc-e2e-runner"]), "utf8");
  const pr = await readFile(resolve(root, expected["dev-ai-ecc-pr-test-analyzer"]), "utf8");
  const a11y = await readFile(resolve(root, expected["dev-ai-accessibility"]), "utf8");
  assert.match(qa, /inspect-only \(default\)/);
  assert.match(qa, /does not implement application features/);
  assert.match(testEngineer, /Test files may be created\/edited only under explicit author-tests intent/);
  assert.match(testEngineer, /Avoid over-mocking/);
  assert.match(e2e, /report BLOCKED/);
  assert.match(e2e, /at least 3 times/);
  assert.match(pr, /read-only/);
  assert.match(pr, /Never edit code\/tests/);
  assert.match(a11y, /WCAG 2\.2 Level AA/);
  assert.match(a11y, /Never claim NVDA\/JAWS\/VoiceOver testing/);
});

test("retired duplicate QA agent IDs and source files are absent", async () => {
  const retired = [
    "dev-ai-qa-orchestrator", "dev-ai-qa-manual-browser", "dev-ai-qa-dotnet-microservices",
    "dev-ai-qa-angular", "dev-ai-qa-fullstack", "dev-ai-qa-api-contract",
    "dev-ai-qa-pr-regression", "dev-ai-qa-defect-investigator",
    "accessibility-review-agent", "claude-accessibility-tester", "claude-playwright-tester"
  ];
  for (const id of retired) assert.equal(registry.components.some(item => item.type === "agent" && item.id === id), false, id);
  const oldPaths = [
    "agents/dev-ai-qa.agent.md", "agents/dev-ai-test-engineer.agent.md",
    "agents/dev-ai-ecc-e2e-runner.agent.md", "agents/dev-ai-ecc-pr-test-analyzer.agent.md",
    "agents/dev-ai-accessibility.agent.md", "agents/accessibility-review-agent.agent.md",
    "agents/claude-accessibility-tester.agent.md", "agents/claude-playwright-tester.agent.md"
  ];
  for (const path of oldPaths) await assert.rejects(access(resolve(root, path)));
});

test("shared QA skill is registered and present", async () => {
  const skill = registry.components.find(item => item.type === "skill" && item.id === "qa-engineering");
  assert.ok(skill);
  assert.equal(skill.path, "skills/qa-engineering/SKILL.md");
  await access(resolve(root, skill.path));
});
