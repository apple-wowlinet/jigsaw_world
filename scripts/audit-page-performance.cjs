/* eslint-disable @typescript-eslint/no-require-imports -- Standalone optional browser audit. */
// Run on a US host against a production build. See docs/performance-validation.md.
const fs = require('node:fs')
const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright')
const baseUrl = process.argv[2]
if (!baseUrl) throw new Error('Usage: node scripts/audit-page-performance.cjs https://example.com')
const paths = ['/', '/categories', '/category/nature', '/category/forests', '/explore', '/explore/weekly', '/explore/all-time', '/explore/trending']
const output = process.argv[3] || '/tmp/jigsaw-performance.json'

async function main() {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) })
  const results = []
  try {
    for (const path of paths) {
      for (let run = 1; run <= 5; run++) {
        const context = await browser.newContext({ viewport: { width: 1365, height: 768 } })
        try {
          const page = await context.newPage()
          const session = await context.newCDPSession(page)
          await session.send('Network.enable')
          await session.send('Network.setCacheDisabled', { cacheDisabled: true })
          await session.send('Network.emulateNetworkConditions', {
            offline: false, latency: 100, downloadThroughput: 10 * 1000000 / 8,
            uploadThroughput: 5 * 1000000 / 8, connectionType: 'ethernet',
          })
          await page.addInitScript(() => {
            window.__audit = { lcp: null, cls: 0 }
            let start = 0, last = 0, score = 0
            new PerformanceObserver((list) => {
              const entry = list.getEntries().at(-1)
              window.__audit.lcp = { ms: entry.startTime, tag: entry.element?.tagName, image: entry.url || null }
            }).observe({ type: 'largest-contentful-paint', buffered: true })
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if (entry.hadRecentInput) continue
                if (entry.startTime - last > 1000 || entry.startTime - start > 5000) {
                  start = entry.startTime
                  score = 0
                }
                last = entry.startTime
                score += entry.value
                window.__audit.cls = Math.max(window.__audit.cls, score)
              }
            }).observe({ type: 'layout-shift', buffered: true })
          })
          const response = await page.goto(new URL(path, baseUrl).href, { waitUntil: 'load', timeout: 60000 })
          await page.waitForTimeout(3000)
          const metrics = await page.evaluate(() => ({
            ...window.__audit,
            navigation: performance.getEntriesByType('navigation')[0]?.toJSON(),
            resources: performance.getEntriesByType('resource').map((entry) => entry.toJSON()),
          }))
          results.push({ path, run, status: response.status(), finalUrl: page.url(), ...metrics })
          console.log(JSON.stringify({ path, run, status: response.status(), lcp: metrics.lcp, cls: metrics.cls }))
          fs.writeFileSync(output, JSON.stringify({ baseUrl, measuredAt: new Date().toISOString(), browser: browser.version(), results }, null, 2))
        } finally { await context.close() }
      }
    }
  } finally { await browser.close() }
}
main().catch((error) => { console.error(error); process.exitCode = 1 })
