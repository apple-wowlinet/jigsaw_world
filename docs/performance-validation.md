# Catalogue performance validation

## Implementation

Home, category directory/detail and the three Explore modes render their initial content on the server. Public anonymous reads use Next.js `unstable_cache` with a 1,800 second revalidation lifetime. The category metadata and body share a request-memoized category read. Category interactions use `GET /api/catalogue/category/[slug]` with validated `page`, `difficulty`, `pieces` and `sort` parameters and the same data cache. Errors return 503 rather than a successful empty catalogue.

Pages render per request over cached data, avoiding a second route-cache lifetime. Daily puzzle cache keys contain the request's UTC date. Revalidation uses Next.js stale-while-revalidate behavior, so 30 minutes is the refresh interval, not a strict freshness deadline during backend failures. Personal progress and sessions stay outside shared caches. Explore retains its existing 96-item candidate set, 24-item pages and sorting semantics.

## Verification on 2026-10-29

- TypeScript and ESLint for changed files passed.
- `node --test tests/*.test.cjs`: 9 passed, 2 existing PostgreSQL integration tests skipped (optional PGlite dependency absent).
- Production `npm run build` could not download the existing Google Fonts. Public DNS resolution for `jigsawworld.co` also timed out, including outside the sandbox. No real production baseline or US measurements are available.
- An isolated `next build --webpack` passed with temporary local fixture data and system-font substitutes. Real `.env.local`, fonts, dependencies and deployment configuration were not edited. This verifies compilation and production rendering, not real image/network performance. The fixture `.next` build and cache were moved out of the repository after verification; rebuild normally before deployment.
- Browser checks passed for SSR content and hydration without duplicate public-data requests on all target pages, category page-2 direct loading and pagination/filter reset, Explore mode/page reset and `/explore` redirection, with no browser exceptions. These checks use fixture data and substitute image responses; they are not performance measurements.

## Production measurement

Run a normal build with real environment variables and network access before deployment. Run the optional audit from a **US host** against that production URL:

```sh
PLAYWRIGHT_MODULE_PATH=/absolute/path/to/playwright BROWSER_EXECUTABLE=/absolute/path/to/chrome node scripts/audit-page-performance.cjs https://jigsawworld.co /tmp/jigsaw-performance.json
```

Playwright is optional tooling, not a new app dependency. Set its module path to an existing installation and use an installed Chrome or Playwright Chromium executable. The script uses 1365×768, 10 Mbps download, 5 Mbps upload and 100 ms latency, with five fresh browser contexts per route. Update its representative category paths if the deployed catalogue differs. It records LCP, CLS and resource/navigation timing, including the `/explore` redirect. Missing LCP, non-200 responses or wrong final URLs invalidate a run. INP needs real interactions and is assessed through Clarity.

Browser caches are cold on each run; this does **not** reset Vercel functions or the server data cache. Record server cold-start/cache-hit status separately using deployment logs and response timings, and report those groups separately. Do not infer geographic location or server cache state from the script alone.

After release, compare Clarity by URL, US location and desktop devices over seven days, requiring at least 100 valid visits per page group; extend the window if needed. Targets: LCP p75 ≤ 2,000 ms, CLS p75 ≤ 0.1, INP p75 ≤ 200 ms. Inspect the slowest category and a child category separately. If targets fail, use the captured waterfall and actual LCP element to distinguish document latency, image delivery, font loading and rendering delay before changing hosting or storage.
