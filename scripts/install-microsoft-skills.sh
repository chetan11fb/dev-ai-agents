#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "Node.js/npm/npx is required. Install Node.js 20+ and retry." >&2
  exit 1
fi

if [[ "${1:-}" == "--all" ]]; then
  npx skills add microsoft/skills --all
else
  echo "Launching the Microsoft skills selector. Choose only skills required by this repo."
  npx skills add microsoft/skills
fi

echo "Microsoft Agent Skills installation completed."
echo "Restart/reload VS Code if the new skills are not immediately visible."
