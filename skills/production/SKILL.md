---
name: production
description: "Use when orchestrating Omenia Production Graph jobs through authenticated Omenia API tools: state location, production artifacts, ClawNet assets, chroma, voice timing, scene timeline, render, delivery, and certification."
---

# Omenia Production Graph

This skill is a thin client. It must call Omenia API tools and must not implement backend production logic locally.

## Rules

- Call `omenia_production_locate` first when state is unclear.
- Prefer `job_id` and artifact IDs over paths.
- Use `mode=validate` before expensive or state-changing steps.
- Use `mode=dry_run` for command review.
- Use `mode=run` only after inputs are known.
- Never store API keys, Telegram tokens, or other secrets in prompts, files, commits, logs, or artifacts.
- Never query the database directly.
- Never reimplement CN/chroma/render logic in the client.
- For Telegram, use `delivery_mode=agent_handoff` unless the user explicitly operates an Omenia first-party server channel.
- Send Telegram messages from the local OpenClaw/external agent with that agent's own Telegram token; never pass bot tokens to Omenia.

## Core Tools

- `omenia_production_map`
- `omenia_production_locate`
- `omenia_production_create_job`
- `omenia_production_select_structure`
- `omenia_production_generate_blueprint`
- `omenia_production_generate_script`
- `omenia_production_generate_voice`
- `omenia_production_analyze_voice_timing`
- `omenia_production_index_cn_assets`
- `omenia_production_get_chroma_profile`
- `omenia_production_apply_chroma`
- `omenia_production_select_cn_assets`
- `omenia_production_build_scene_timeline`
- `omenia_production_generate_animation_segments`
- `omenia_production_build_composition`
- `omenia_production_validate_timeline`
- `omenia_production_render_preview`
- `omenia_production_render_final`
- `omenia_production_send_telegram_video`
- `omenia_production_certify_job`

## Certification

A job is not final until `omenia_production_certify_job` returns a certification report with `certified=true`.

For external Telegram delivery, a `delivery_receipt.status` of `ready_for_agent_delivery` means Omenia has prepared the final video handoff and the local agent should send it with its own configured Telegram credentials.
