#!/usr/bin/env bash
# Explicit opt-in: create/reuse a personal identity and register its public key.
set -Eeuo pipefail

usage() {
    # shellcheck disable=SC2016 # Show the default path expression literally.
    printf '%s\n' \
        'Usage: mise run secrets:init [--help]' \
        'Requires Python and age-keygen (installed by mise).' \
        'Uses FNOX_AGE_KEY_FILE or ${XDG_CONFIG_HOME:-$HOME/.config}/fnox/age.txt.' \
        'Exit codes: 0 success, 1 initialization failure, 2 invalid arguments.'
}

if [[ "${1:-}" == '--help' && $# -eq 1 ]]; then
    usage
    exit 0
elif [[ $# -ne 0 ]]; then
    usage >&2
    exit 2
fi

trap 'printf "[ERROR] Secret initialization failed at line %s.\n" "$LINENO" >&2' ERR
cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."
for executable in age-keygen python; do
    command -v "$executable" >/dev/null || {
        printf '[ERROR] Missing %s; run mise install first.\n' "$executable" >&2
        exit 1
    }
done

key_file="${FNOX_AGE_KEY_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/fnox/age.txt}"
if [[ ! -f "$key_file" ]]; then
    umask 077
    mkdir -p -- "$(dirname -- "$key_file")"
    age-keygen -o "$key_file"
    printf '[INFO] Created age identity at %s; back it up outside the repository.\n' "$key_file"
fi

recipient="$(age-keygen -y "$key_file")"
python - "$recipient" <<'PY'
import json
from pathlib import Path
import re
import sys
import tomllib

path = Path('fnox.toml')
text = path.read_text()
recipient = sys.argv[1]
recipients = tomllib.loads(text)['providers']['age']['recipients']
if recipient in recipients:
    print('[INFO] This public key is already registered.')
elif recipients:
    print('[INFO] Existing recipients preserved. Add this public key manually:')
    print(recipient)
    print('Then re-encrypt existing entries: fnox reencrypt -p age')
else:
    # Match this repository's empty age-provider declaration only.
    updated, count = re.subn(
        r'(age\s*=\s*\{\s*type\s*=\s*"age",\s*recipients\s*=\s*)\[\s*\]',
        lambda match: match[1] + json.dumps([recipient]),
        text,
        count=1,
    )
    if count != 1:
        sys.exit('Unable to locate the empty age provider; no config changes made.')
    path.write_text(updated)
    print('[INFO] Registered the public age recipient in fnox.toml.')
PY

printf '%s\n' \
    'Add a secret with hidden input: fnox set OPENAI_API_KEY --provider age' \
    'Run with secrets: mise run run -- python -m <package>'
