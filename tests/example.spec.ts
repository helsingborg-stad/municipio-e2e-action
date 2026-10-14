import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import Sitemapper from 'sitemapper';

const getUrlsFromSitemap = async (sitemapUrl: string): Promise<string[]> => {
  const sitemap = new Sitemapper({
    timeout: 10000, // 10 second timeout
  });
  const result = await sitemap.fetch(sitemapUrl);
  return result.sites;
};

const sitemapUrl = process.env.SITEMAP_URL ??
  (JSON.parse(readFileSync(new URL('../sitemaps.json', import.meta.url), 'utf8')) as { sitemaps: string[] }).sitemaps[0];
if (!sitemapUrl) throw new Error('No sitemap URL configured');

const sitemapUrls = [...new Set(await getUrlsFromSitemap(sitemapUrl))];
if (sitemapUrls.length === 0) throw new Error('No sitemap URLs to test');

for (const url of sitemapUrls) {
  test(`page loads without rendering or browser errors: ${url}`, async ({ page }) => {
    const browserErrors: string[] = [];
    page.on('console', message => {
      if (message.type() === 'error') browserErrors.push(message.text());
    });
    page.on('pageerror', error => browserErrors.push(error.message));

    const response = await page.goto(url);
    expect.soft(response?.status(), `HTTP status on ${url}`).toBe(200);
    await page.waitForLoadState('networkidle', { timeout: 5000 });
    const pageContent = await page.content();
    expect.soft(pageContent, `Rendering issue on ${url}`).not.toContain('A view rendering issue has occurred');
    expect.soft(browserErrors, `Browser errors on ${url}`).toEqual([]);
  });
}