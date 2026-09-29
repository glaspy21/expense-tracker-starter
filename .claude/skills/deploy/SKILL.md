---
name: deploy
description: Deploy the app to staging. Runs all tests, builds the production bundle, then pushes the current commit to the `staging` branch on origin.
disable-model-invocation: true
---

# Deploy to staging

Run these steps in order. Each step is a hard gate: if it fails, stop immediately, show the failing output, and do not run the later steps.

1. **Preflight.** Run `git status --porcelain`. If it prints anything, stop and tell the user to commit or stash first. Note the current branch and `git rev-parse --short HEAD`.
2. **Test.** Run `npm test`. Any failing test aborts the deploy.
3. **Build.** Run `npm run build`. A build error aborts the deploy. Confirm `dist/` was produced.
4. **Push to staging.** Run `git push origin HEAD:staging`.
   - Never use `--force` or `--force-with-lease`.
   - If the push is rejected as non-fast-forward, stop and report it. Only force-push if the user explicitly asks.
5. **Report.** Summarize: tests passed, build succeeded, and which commit sha was pushed to `origin/staging`.

Staging is the `staging` branch of `origin`. Pushing creates the branch on the first deploy.
