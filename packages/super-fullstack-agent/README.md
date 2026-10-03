# @chetan11fb/dev-ai-super-fullstack-agent

DEV-AI Super Fullstack Agent for VS Code GitHub Copilot Agent Mode.

## Install

From any project:

    npx @chetan11fb/dev-ai-super-fullstack-agent

Or:

    npm install --save-dev @chetan11fb/dev-ai-super-fullstack-agent
    npx dev-ai-super-fullstack-agent

The installer creates:

    .github/agents/super-fullstack-agent.agent.md

Then open the project in VS Code with GitHub Copilot and use:

    @super-fullstack-agent <your task>

## Update

    npm install --save-dev @chetan11fb/dev-ai-super-fullstack-agent@latest
    npx dev-ai-super-fullstack-agent --force

The package installs the custom-agent definition locally. The agents list describes specialist responsibilities; actual agent-to-agent invocation depends on the target Copilot/agent runtime.

Repository: https://github.com/chetan11fb/dev-ai-agents
