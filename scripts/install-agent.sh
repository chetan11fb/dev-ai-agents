#!/usr/bin/env bash
set -euo pipefail
COMPONENT="${1:-dev-ai-fullstack-engineer}"; TARGET_ROOT="${2:-$PWD}"; FORCE="${DEV_AI_FORCE:-0}"
BASE="https://raw.githubusercontent.com/chetan11fb/dev-ai-agents/main"
command -v curl >/dev/null || { echo "curl is required"; exit 1; }
command -v python3 >/dev/null || { echo "python3 is required"; exit 1; }
r="$(curl -fsSL "$BASE/registry/marketplace.json")"
path="$(printf '%s' "$r"|python3 -c 'import json,sys;d=json.load(sys.stdin);x=next((x for x in d["components"] if x["id"]==sys.argv[1]),None);print(x["path"] if x else "")' "$COMPONENT")"
target="$(printf '%s' "$r"|python3 -c 'import json,sys;d=json.load(sys.stdin);x=next((x for x in d["components"] if x["id"]==sys.argv[1]),None);print(x["target"] if x else "")' "$COMPONENT")"
[ -n "$path" ] || { echo "Unknown DEV-AI component: $COMPONENT"; exit 1; }
dest="$TARGET_ROOT/$target"; mkdir -p "$(dirname "$dest")"
if [ -e "$dest" ] && [ "$FORCE" != "1" ]; then echo "Target exists: $dest"; exit 1; fi
curl -fsSL "$BASE/$path" -o "$dest"
echo "Installed $COMPONENT -> $dest"
