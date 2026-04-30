# Omenia Production Skill

Commercial thin OpenClaw/Claude skill client for the Omenia Production Graph.

This repository/package contains only the client plugin, skill instructions, and public tool contracts. The actual production logic stays private on the Omenia server and is reached only through authenticated API calls.

Use this package to sell access, onboard users, or attract followers without exposing backend logic.

## Install

Use your OpenClaw/Claude client plugin installer with this directory or a private GitHub repository containing these files.

Configure:

- `baseUrl`: `https://omenia.io` or your private Omenia host.
- `apiKey`: an Omenia API key stored in the client secret store, not in Git.

Environment fallback for local development is supported, but do not document real values in files or tickets. Set these only in your shell or secret manager:

```bash
OMENIA_BASE_URL
OMENIA_API_KEY
```

Do not commit those variables.

## Telegram

Telegram tokens belong to the user's OpenClaw agent or external automation layer.

The Omenia backend does not need those tokens. Production delivery defaults to `delivery_mode=agent_handoff`, which returns a safe delivery receipt with the final video URI and caption for the external agent to send using its own Telegram credentials.

Never send Telegram tokens to Omenia payloads.

## Why Thin Client

Publishing the backend would expose production logic. This package only forwards tool calls to:

```text
POST /api/v1/claw/tools
GET  /api/v1/claw/tools
GET  /api/v1/claw/skills
```

All requests require `Authorization: Bearer <Omenia API key>`.

## Verify

After installing, run:

```bash
omenia-production health
omenia-production tools
```

Then validate without side effects:

```json
{
  "tool": "production_map",
  "arguments": { "mode": "explain" }
}
```

## Safe GitHub Strategy

Recommended:

- Private GitHub repo for this package.
- Omenia backend repo remains private and separate.
- No `.env`, keys, generated MP4s, storage, logs, or backend PHP service files in this repo.

Public GitHub is possible only if tool names and schemas are acceptable to disclose.

## Commercial Distribution

Recommended paths:

- Private GitHub repository for paid users.
- Public GitHub repository only as a lead magnet.
- SaaS access key required for all useful calls.
- Backend remains private and hosted by Omenia.

Before publishing:

```bash
npm run self-test
npm run publish:github
```

Expected output:

```text
self-test ok
publish ok
```
