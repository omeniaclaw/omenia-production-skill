#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OWNER="${GITHUB_OWNER:-omeniaclaw}"
REPO="${GITHUB_REPO:-omenia-production-skill}"
VISIBILITY="${GITHUB_VISIBILITY:-private}"
TOKEN="${GITHUB_TOKEN:-}"
AUTHOR_NAME="${GIT_AUTHOR_NAME:-Omenia Publisher}"
AUTHOR_EMAIL="${GIT_AUTHOR_EMAIL:-security@omenia.io}"

if [[ -z "$TOKEN" ]]; then
	echo "GITHUB_TOKEN is required in the environment." >&2
	exit 1
fi

if [[ "$VISIBILITY" != "private" && "$VISIBILITY" != "public" ]]; then
	echo "GITHUB_VISIBILITY must be private or public." >&2
	exit 1
fi

cd "$ROOT_DIR"
npm run check

api_headers=(
	-H "Authorization: Bearer $TOKEN"
	-H "Accept: application/vnd.github+json"
	-H "User-Agent: omenia-production-skill-publisher"
)

repo_api="https://api.github.com/repos/$OWNER/$REPO"
status="$(curl -sS -o /tmp/omenia-production-skill-repo.json -w '%{http_code}' "${api_headers[@]}" "$repo_api")"

if [[ "$status" == "404" ]]; then
	create_payload="$(REPO="$REPO" VISIBILITY="$VISIBILITY" python3 - <<'PY'
import json, os
print(json.dumps({
    'name': os.environ['REPO'],
    'description': 'Commercial thin client for Omenia Production Graph skill distribution.',
    'private': os.environ['VISIBILITY'] == 'private',
    'has_issues': True,
    'has_projects': False,
    'has_wiki': False,
    'auto_init': False,
}))
PY
)"
	status="$(REPO="$REPO" VISIBILITY="$VISIBILITY" curl -sS -o /tmp/omenia-production-skill-create.json -w '%{http_code}' "${api_headers[@]}" -H 'Content-Type: application/json' -d "$create_payload" https://api.github.com/user/repos)"
	if [[ "$status" != "201" ]]; then
		echo "GitHub repo creation failed with HTTP $status" >&2
		cat /tmp/omenia-production-skill-create.json >&2
		exit 1
	fi
elif [[ "$status" != "200" ]]; then
	echo "GitHub repo lookup failed with HTTP $status" >&2
	cat /tmp/omenia-production-skill-repo.json >&2
	exit 1
fi

if [[ ! -d .git ]]; then
	git init
	git branch -M main
fi

git config user.name "$AUTHOR_NAME"
git config user.email "$AUTHOR_EMAIL"
git remote remove origin >/dev/null 2>&1 || true
git remote add origin "https://github.com/$OWNER/$REPO.git"

git add .
if ! git diff --cached --quiet || ! git rev-parse --verify HEAD >/dev/null 2>&1; then
	git commit -m "Initial publish of Omenia Production Skill"
fi

version="$(python3 - <<'PY'
import json
with open('package.json', 'r', encoding='utf-8') as fh:
    print(json.load(fh)['version'])
PY
)"
tag="v$version"

if ! git rev-parse "$tag" >/dev/null 2>&1; then
	git tag "$tag"
fi

git -c http.extraHeader="Authorization: Bearer $TOKEN" push -u origin main
git -c http.extraHeader="Authorization: Bearer $TOKEN" push origin "$tag"

echo "publish ok"
echo "repo=https://github.com/$OWNER/$REPO"
echo "tag=$tag"