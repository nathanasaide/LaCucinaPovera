## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Mandatory verification loop

Before changing code, inspect `git status`, the current routes/components, and the relevant tests. Preserve unrelated user changes. For a reported failure, inspect the actual error log and reproduce it before fixing it.

Before declaring work complete, committing changes, or making any authorized push, run from the repository root:

```bash
npm run check && npm test && git diff --check
```

- `npm run check` checks Astro and Vue/TypeScript. `npm test` builds fresh production output and runs the full schedule and Chromium regression suites. A successful Astro build alone is NOT a passing verification run.
- Install the browser once with `npx playwright install chromium`. Tests manage an Astro preview server on `127.0.0.1:4322`; keep that port free. Do not terminate unrelated user processes to free it.
- Wait for every command to finish and inspect its exit status and failure output. Starting a background command is not evidence of success.
- If anything fails: read the diagnostics/trace, identify the root cause, fix it, run the affected tests, then repeat the FULL command above. Continue this repair loop until it passes.
- Any subsequent edit invalidates the previous verification result. Rerun the full gate against the final working tree, including after resolving merge conflicts or applying hook-generated changes.
- Never skip/delete failing coverage, lower accessibility thresholds, increase retries/timeouts, bypass hooks, or weaken CI/security controls just to obtain a green result. Replace obsolete tests only when the feature intentionally changed; retain equivalent coverage of the new behaviour.
- If authentication, permissions, missing business information, or an external service blocks progress, stop the affected operation, report the exact blocker, and leave it explicitly pending. Do not claim success or repeatedly rerun an unchanged failing command.
- After the checks pass, review `git diff` and all new files for regressions, accidental changes, and secrets. Report the commands run, test result, remaining limitations, and whether anything was committed, pushed, or deployed.

## Keep tests aligned with the product

- Current public pages are `/`, `/pizzas`, `/sandwiches`, and `/photos`. Route renames must update navigation and tests in the same change; explicitly consider redirects for old URLs.
- Browser tests must assert a successful page response and expected content before checking layout. A narrow 404 page must not pass a responsive-layout test.
- Prefer roles, accessible names, and specific status text over incidental wrapper text or outdated CSS classes. If markup changes, inspect the rendered page before updating assertions.
- Keep coverage for menu content/prices, optional directions, opening-status transitions, keyboard navigation, lightbox focus restoration, contrast, and narrow mobile layouts. If a UI feature is intentionally removed, replace its obsolete test with coverage of its replacement rather than silently dropping the case.
- Opening-status calculations must use `Europe/London`, independent of the visitor's timezone. Preserve DST, alternate-weekend, override, and hours-note-expiry tests.
- Pizza/location content lives in `src/content/woodbank/site.json`; sandwiches use `src/content/menu/focaccia.json`. Do not invent a directions pin or silently change business information to satisfy tests.

## Push and deployment gate

- Never push without explicit user authorization. A request to fix code or edit these instructions is not permission to push.
- Before an authorized push to `main`, check the branch and outgoing commits, ensure no unfinished/unverified changes are included, and run the full verification loop on the exact final state. Reverify the merged result; passing checks on an earlier branch state do not cover a merge.
- After an authorized push, find the GitHub Actions run for that exact commit with `gh run list --commit <sha>`, then wait with `gh run watch <run-id> --exit-status`. Do not report deployment success until that run's deploy job succeeds.
- If CI fails, inspect `gh run view <run-id> --log-failed`, reproduce the failure locally, and repeat the repair loop. Keep the deployment task open; obtain any needed authorization before another push.
- These are agent instructions, not a Git-level push hook. GitHub branch protection/required PR checks must be configured separately for mechanical prevention of unverified changes reaching `main`; do not claim this file enforces that by itself.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
