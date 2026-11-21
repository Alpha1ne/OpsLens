#!/usr/bin/env bash
# Checks that a deployed site sends the security headers OpsLens expects.
# Usage: ./scripts/check-headers.sh https://your-site.vercel.app
set -u
URL="${1:-}"
if [ -z "$URL" ]; then echo "Usage: $0 https://your-site.vercel.app"; exit 2; fi
case "$URL" in https://*) ;; *) echo "FAIL  URL must start with https://"; exit 2;; esac

HDRS="$(curl -sS -I -L --max-time 20 "$URL")" || { echo "FAIL  could not reach $URL"; exit 2; }
# Keep only the headers of the final response.
HDRS="$(printf '%s' "$HDRS" | tr -d '\r' | awk 'BEGIN{RS="";ORS="\n\n"}{last=$0}END{print last}')"
fail=0

has() {  # has <header-name> <must-contain-text>
  local line
  line="$(printf '%s\n' "$HDRS" | grep -i "^$1:" | head -n1)"
  if [ -z "$line" ]; then echo "FAIL  $1 is missing"; fail=1
  elif [ -n "${2:-}" ] && ! printf '%s' "$line" | grep -qiF -- "$2"; then echo "FAIL  $1 does not contain: $2"; fail=1
  else echo "PASS  $1"; fi
}

has Content-Security-Policy "default-src 'none'"
has Content-Security-Policy "script-src 'self'"
has Content-Security-Policy "frame-ancestors 'none'"
has Strict-Transport-Security "max-age=63072000"
has X-Content-Type-Options "nosniff"
has X-Frame-Options "DENY"
has Referrer-Policy "strict-origin-when-cross-origin"
has Permissions-Policy "camera=()"
has Cross-Origin-Opener-Policy "same-origin"
has Cross-Origin-Resource-Policy "same-origin"

# The script-src directive must never allow inline code or eval.
SCRIPT_SRC="$(printf '%s\n' "$HDRS" | grep -i '^content-security-policy:' | tr ';' '\n' | grep -i 'script-src' | head -n1)"
if printf '%s' "$SCRIPT_SRC" | grep -Eqi "unsafe-inline|unsafe-eval|\*"; then
  echo "FAIL  script-src allows unsafe-inline, unsafe-eval or a wildcard"; fail=1
else echo "PASS  script-src has no unsafe-inline, unsafe-eval or wildcard"; fi

# Plain HTTP should redirect to HTTPS.
HTTP_URL="http://${URL#https://}"
CODE="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 20 "$HTTP_URL" || echo 000)"
case "$CODE" in 301|302|307|308) echo "PASS  http:// redirects to https:// ($CODE)";; *) echo "FAIL  http:// did not redirect (got $CODE)"; fail=1;; esac

if [ "$fail" -eq 0 ]; then echo; echo "All security checks passed."; else echo; echo "Some checks failed. See above."; fi
exit "$fail"
