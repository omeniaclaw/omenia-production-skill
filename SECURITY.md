# Security

This package is intentionally a thin client.

It must not contain:

- Omenia backend PHP code.
- Production Graph service logic.
- Database migrations or credentials.
- API keys, Telegram tokens, session cookies, or `.env` files.
- ClawNet source assets or private calibration datasets.

The Omenia API key must be configured through the host application's secret store or environment variable and must never be committed.

Recommended deployment:

- Keep the Omenia backend in a private repository or private server only.
- Publish this package only if the public tool names and request schemas are acceptable to disclose.
- Use short-lived or revocable API keys when possible.
- Rotate any key that was ever pasted into chat, logs, Git history, or a ticket.
- Prefer external-agent Telegram delivery. Each OpenClaw/agent instance should keep its own Telegram token in its own secret store.
- Use Omenia server-side Telegram credentials only for controlled first-party deployments.

Disclosure boundary:

- This package exposes tool names and parameter contracts.
- It does not expose how production stages select assets, build timelines, render, certify, or access credentials.

Commercial boundary:

- The distributable package is not the product logic.
- Paid value is controlled by authenticated Omenia API access, plan limits, render capacity, and server-side features.
- If this package is made public, assume tool names and request schemas are public forever.

Telegram boundary:

- Do not send Telegram bot tokens to Omenia tool payloads.
- Use `delivery_mode=agent_handoff` so the external agent sends the final video with its own Telegram token.
