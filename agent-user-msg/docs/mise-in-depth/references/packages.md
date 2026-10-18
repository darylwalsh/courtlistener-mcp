# Mise - Packages

**Pages:** 1

---

## dnf | mise-en-place

**URL:** https://mise.jdx.dev/bootstrap/packages/dnf.html

**Contents:**
- dnf experimental ​
- Behavior ​

System packages for RedHat-family Linux (Fedora, RHEL, CentOS Stream, Rocky, Alma, ...).

Only dnf is supported — not legacy yum-only systems. On RHEL/CentOS 8+ and all current Fedora releases dnf is the default.

**Examples:**

Example 1 (json):
```json
[bootstrap.packages]
"dnf:openssl-devel" = "latest"
"dnf:postgresql-server" = "latest"
"dnf:bash" = "5.2.26-3.fc40" # version or version-release pin
```

---
