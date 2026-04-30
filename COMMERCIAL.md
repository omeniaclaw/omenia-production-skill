# Commercial Distribution Plan

Goal: distribute the Omenia Production Skill to attract users, followers, and paying customers without exposing private logic.

## Product Boundary

What users get:

- OpenClaw/Claude skill plugin.
- Tool names and public schemas.
- Secure authenticated access to Omenia Production Graph.
- Documentation for installation and certification workflow.

What users do not get:

- Backend PHP logic.
- Database schema internals beyond public API contracts.
- CN asset selection rules.
- Chroma calibration internals beyond public preset usage.
- Rendering/certification implementation.
- Omenia API keys, Telegram tokens, or server credentials.

## Monetization Options

Recommended tiers:

- Free follower tier: `production_map`, `production_locate`, examples, videos, demos.
- Creator tier: job creation, blueprint, script, preview render.
- Studio tier: final render, CN timeline, animation, certification.
- Agency/API tier: higher rate limits, batch jobs, priority render, white-label onboarding.

## Funnel

Public content can show:

- Before/after renders.
- High-level graph diagram.
- Tool names.
- Install flow.
- Certification output summary.

Public content must not show:

- Backend source files.
- Database credentials.
- Private API keys.
- Telegram tokens.
- Full internal scoring/routing logic.
- Raw CN asset calibration tables beyond already intentional public examples.

## Recommended GitHub Setup

Use a separate repository containing only this package.

Recommended repository visibility:

- Private for paid distribution.
- Public only as a lead magnet if public disclosure of tool schemas is acceptable.

Do not add Omenia backend as a submodule.
Do not add generated MP4s or storage output.
Do not add `.env` files.
