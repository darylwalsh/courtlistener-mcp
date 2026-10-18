#!/usr/bin/env bash
# Rename the template package "starter" to a new name.
# Usage: mise run init <package_name>   (or: bash scripts/rename.sh <package_name>)
set -euo pipefail

new="${1:-}"
if [[ -z "$new" ]]; then
  echo "usage: mise run init <package_name>" >&2
  exit 1
fi
if [[ ! "$new" =~ ^[a-z][a-z0-9_]*$ ]]; then
  echo "package name must be snake_case (letters, digits, underscores)" >&2
  exit 1
fi
if [[ ! -d src/starter ]]; then
  echo "src/starter not found; this project was already renamed" >&2
  exit 1
fi

dist="${new//_/-}"   # distribution name uses hyphens

git mv src/starter "src/$new" 2>/dev/null || mv src/starter "src/$new"

# Package imports and references
grep -rlZ --include='*.py' --include='*.md' --include='*.toml' -E '\bstarter\b' \
  src tests AGENTS.md mise.toml 2>/dev/null \
  | xargs -0 -r sed -i.bak -E "s/\bstarter\b/$new/g"
# README title
sed -i.bak -E "1s/^# starter$/# $dist/" README.md
# Distribution name in pyproject.toml
sed -i.bak -E "s/^name = \"starter\"/name = \"$dist\"/" pyproject.toml
find . -name '*.bak' -not -path './.venv/*' -delete

rm -f CHANGELOG.md
uv lock -q
echo "Renamed package to '$new' (distribution '$dist')."
