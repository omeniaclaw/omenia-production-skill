# Publishing Checklist

Before pushing this package to GitHub or publishing it through any channel:

- [ ] Run `npm run self-test`.
- [ ] Confirm no `.env`, API keys, Telegram tokens, cookies, logs, storage, or MP4s are included.
- [ ] Confirm no backend PHP files are included.
- [ ] Confirm no `lib/Production`, migrations, or private SQL dumps are included.
- [ ] Confirm `README.md` says this is a thin client.
- [ ] Confirm `SECURITY.md` describes the disclosure boundary.
- [ ] Confirm `LICENSE.md` is included.
- [ ] Use a private repository unless public schemas are intentionally disclosed.
- [ ] Store any CI/API keys only in GitHub Secrets.
- [ ] Test with a revocable `om_claw_` key, never with a master/admin key.
- [ ] Rotate any key pasted in a terminal, chat, issue, CI log, or demo.

Recommended command:

```bash
npm run self-test
npm run publish:github
```

Expected result:

```text
self-test ok
publish ok
```
