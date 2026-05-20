import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const productionTarget = Boolean(process.env.PLAYWRIGHT_BASE_URL)

function collectPageFailures(page: Page) {
  const failures: string[] = []
  page.on('pageerror', (error) => failures.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() === 'error') failures.push(`console: ${message.text()}`)
  })
  page.on('requestfailed', (request) => failures.push(`requestfailed: ${request.url()} ${request.failure()?.errorText ?? ''}`))
  page.on('response', (response) => {
    const current = page.url()
    if (!current) return
    const pageUrl = new URL(current)
    const url = new URL(response.url())
    if (url.origin === pageUrl.origin && response.status() >= 400) {
      failures.push(`http ${response.status()}: ${response.url()}`)
    }
  })
  return failures
}

test('loads and every primary control responds', async ({ page }) => {
  const failures = collectPageFailures(page)
  await page.goto('/')

  await expect(page).toHaveTitle(/Shanto Systems Studio/)
  await expect(page.getByRole('heading', { name: /Intelligence/i })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Shanto Mathew' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Start Walkthrough' }).first()).toBeVisible()

  const nav = page.getByRole('navigation', { name: 'Primary navigation' })
  const workflow = page.locator('#workflow')

  await nav.getByRole('link', { name: 'Workflow', exact: true }).click()
  await expect(page.getByRole('heading', { name: /motion loop/i })).toBeVisible()
  await nav.getByRole('link', { name: 'Systems', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Interactive systems map/i })).toBeVisible()
  await nav.getByRole('link', { name: 'Evidence', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Proof timeline/i })).toBeVisible()
  await nav.getByRole('link', { name: 'Demo Guide', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Run the site like a reviewer/i })).toBeVisible()

  await page.getByRole('button', { name: 'Start Walkthrough' }).first().click()
  await expect(page.locator('.workflow-section')).toHaveAttribute('data-walkthrough', 'true')

  await page.getByRole('button', { name: /Switch to day mode/i }).click()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme-mode', 'day')
  await page.getByRole('button', { name: /Switch to night mode/i }).click()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme-mode', 'night')

  await page.getByRole('button', { name: /Use reduced motion/i }).click()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-reduced-motion', 'true')
  await page.getByRole('button', { name: /Use full motion/i }).click()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-reduced-motion', 'false')

  for (const stage of ['Observe', 'Plan', 'Act', 'Verify']) {
    await workflow.getByRole('button', { name: new RegExp(stage, 'i') }).click()
    await expect(page.locator('.workflow-detail')).toContainText(stage)
  }
  await page.getByRole('button', { name: /Pause loop/i }).click()
  await expect(page.getByRole('button', { name: /Replay loop/i })).toBeVisible()
  await page.getByRole('button', { name: /Next stage/i }).click()

  for (const filter of ['AI', 'Security', 'Automation', 'Frontend', 'Live Ops', 'All']) {
    await page.getByRole('group', { name: 'System filters' }).getByRole('button', { name: filter }).click()
  }
  for (const node of ['Agentic AI', 'XSIAM', 'SOAR', 'Demo Factory', 'Live Ops', 'Data Boundary', 'Evidence RAG', 'Motion UI']) {
    await page.getByRole('group', { name: 'System filters' }).getByRole('button', { name: 'All' }).click()
    await page.getByLabel('Interactive systems nodes').getByRole('button', { name: new RegExp(node, 'i') }).click()
    await expect(page.locator('.system-detail')).toContainText(node)
  }

  for (const filter of ['AI', 'Security', 'Automation', 'Frontend', 'All']) {
    await page.getByRole('group', { name: 'Timeline filters' }).getByRole('button', { name: filter }).click()
  }
  await page.getByRole('button', { name: 'Next proof item' }).click()
  await page.getByRole('button', { name: 'Previous proof item' }).click()

  await page.getByRole('slider', { name: 'Motion density' }).fill('82')
  await expect(page.getByLabel('Motion density value')).toHaveText('82')
  await page.getByRole('slider', { name: 'Animation speed' }).fill('76')
  await expect(page.getByLabel('Animation speed value')).toHaveText('76')
  await page.getByRole('slider', { name: 'Background intensity' }).fill('88')
  await expect(page.getByLabel('Background intensity value')).toHaveText('88')
  await page.getByLabel('Reduce Motion').check()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-reduced-motion', 'true')
  await page.getByRole('button', { name: /Reset motion settings/i }).click()
  await expect(page.getByLabel('Motion density value')).toHaveText('68')

  await expect(page.getByText(/Production Netlify URL/)).toBeVisible()
  const health = await page.request.get('/api/health')
  expect(health.ok()).toBe(true)
  await expect(page.locator('.guide-panel').filter({ hasText: 'System status' })).toContainText(/ok|local-preview|checking/)

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth)

  const media = await page.evaluate(() => ({
    darkPoster: performance.getEntriesByName(new URL('/assets/hero-dark.jpg', location.href).href).length,
    lightPoster: performance.getEntriesByName(new URL('/assets/hero-light.jpg', location.href).href).length,
    videos: [...document.querySelectorAll('video')].map((video) => ({
      width: (video as HTMLVideoElement).videoWidth,
      source: video.querySelector('source')?.getAttribute('src'),
    })),
    profileImageLoaded: [...document.images].some((image) => image.getAttribute('src')?.includes('shanto-linkedin') && image.naturalWidth > 0),
  }))
  expect(media.videos.length).toBe(2)
  expect(media.videos.every((video) => video.source?.endsWith('.mp4'))).toBe(true)
  expect(media.profileImageLoaded).toBe(true)

  await page.screenshot({
    path: productionTarget ? 'docs/evidence/production-desktop.png' : 'docs/evidence/local-desktop.png',
    fullPage: true,
  })
  expect(failures).toEqual([])
})

test('mobile layout has no horizontal overflow and exposes primary controls', async ({ page }) => {
  const failures = collectPageFailures(page)
  await page.goto('/')

  await expect(page.getByRole('heading', { name: /Intelligence/i })).toBeVisible()
  await page.getByRole('button', { name: /Switch to day mode/i }).click()
  await expect(page.locator('.site-shell')).toHaveAttribute('data-theme-mode', 'day')
  await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Workflow', exact: true }).click()
  await expect(page.locator('#workflow').getByRole('button', { name: /Observe/i })).toBeVisible()

  const targetSizes = await page.locator('a, button, input').evaluateAll((elements) =>
    elements
      .filter((element) => {
        const box = element.getBoundingClientRect()
        return box.width > 0 && box.height > 0
      })
      .map((element) => {
        const box = element.getBoundingClientRect()
        return { width: box.width, height: box.height, tag: element.tagName }
      }),
  )
  for (const target of targetSizes) {
    if (target.tag === 'INPUT') continue
    expect(target.height).toBeGreaterThanOrEqual(32)
  }

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
  expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.innerWidth)
  await page.screenshot({
    path: productionTarget ? 'docs/evidence/production-mobile.png' : 'docs/evidence/local-mobile.png',
    fullPage: true,
  })
  expect(failures).toEqual([])
})

test('production response has security headers', async ({ request, baseURL }) => {
  test.skip(!productionTarget, 'production header checks run against Netlify only')
  const response = await request.get(baseURL ?? '/')
  expect(response.status()).toBe(200)
  const headers = response.headers()
  expect(headers['content-security-policy']).toContain("default-src 'self'")
  expect(headers['x-frame-options']).toBe('DENY')
  expect(headers['x-content-type-options']).toBe('nosniff')
  expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin')
  expect(headers['permissions-policy']).toContain('camera=()')
  expect(headers['strict-transport-security']).toContain('max-age=31536000')
})
