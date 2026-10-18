"""Entry point for `python -m starter`."""

import sys

from starter.core import normalize


def main() -> int:
    """Print a normalized example so `mise run run -- python -m starter` works."""
    sys.stdout.write(f"{normalize([1.0, 2.0, 3.0])}\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
