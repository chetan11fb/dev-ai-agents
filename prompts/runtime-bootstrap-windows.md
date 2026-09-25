# Windows Node/npm Runtime Bootstrap Prompt

First run:
node -v
npm -v
where.exe node
where.exe npm

If Node/npm is missing, use scripts/bootstrap-node.ps1. Prefer Node.js LTS through winget when available. Refresh PATH and verify again.

Never report successful installation unless node -v, npm -v and command resolution succeed. If PATH is stale, ask for a new VS Code terminal rather than pretending the runtime is available.
