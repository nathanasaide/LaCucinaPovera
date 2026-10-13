## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Verification

- `npm run check` checks Astro and Vue/TypeScript.
- Install the browser once with `npx playwright install chromium`.
- `npm test` builds the static site and runs schedule and Chromium regression tests.
- Tests manage an Astro preview server on `127.0.0.1:4322`; keep that port free.
- Opening-status calculations must use `Europe/London`, independent of the visitor's timezone. Tests cover DST, alternate weekends, overrides, and hours-note expiry.
- Woodbank has separate CMS content in `src/content/woodbank/site.json`. Keep its directions hidden until a verified park pin is provided.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
