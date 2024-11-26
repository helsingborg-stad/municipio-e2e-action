import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const urls: string[] = fs.readFileSync(path.resolve(__dirname, '../fixtures/sitemap-urls.txt'), 'utf-8').split('\n');

urls.forEach((url: string) => {
  test(`Response code was 200: ${url}`, async ({ page }) => {
    const response = await page.goto(`${url}`, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    const renderErrorCount = await page.getByText('A view rendering issue has occurred').count();
    expect(renderErrorCount).toBe(0);
  });
});