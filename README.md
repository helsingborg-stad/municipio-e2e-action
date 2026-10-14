# Sitemap page tests

Playwright fetches a sitemap and creates one Chromium test per unique page URL. Each test checks for an HTTP 200 response, the text `A view rendering issue has occurred`, console errors, and uncaught page exceptions. The test waits for network activity to settle before checking the page; a page that does not reach network idle within five seconds fails.

## Configure locally

Copy [sitemap.example.json](sitemap.example.json) to `sitemaps.json`, then add sitemap URLs to its `sitemaps` array. The local file is gitignored. For example:

```json
{
  "sitemaps": [
    "https://dunkerskulturhus.hbgstage.se/sitemap.xml",
    "https://example.org/sitemap.xml"
  ]
}
```

Local runs use the first entry unless `SITEMAP_URL` is set. With `SITEMAP_URL`, the local file is not needed.

## Run locally

Install Node.js 22 or newer, then install the dependencies and Chromium:

```sh
npm ci
npx playwright install chromium
```

Run the first configured sitemap:

```sh
npm test -- --project=chromium --workers=2
```

Run a different sitemap without changing the settings file:

```sh
SITEMAP_URL=https://example.org/sitemap.xml npm test -- --project=chromium --workers=2
```

To inspect available page tests or run one matching URL, use Playwright's `--list` or `--grep` flags:

```sh
npm test -- --project=chromium --list
npm test -- --project=chromium --grep 'automatisk-dorr/$'
```

The sitemap is still fetched when using `--grep`. Open the local HTML report with `npx playwright show-report`. A run can fail if the website emits console errors even when the page responds with HTTP 200.

## Run in this repository

In [helsingborg-stad/municipio-e2e-action](https://github.com/helsingborg-stad/municipio-e2e-action), open **Settings > Secrets and variables > Actions > Variables** and create a repository variable named `SITEMAP_URLS` containing a JSON array of HTTPS sitemap URLs, for example:

```json
["https://dunkerskulturhus.hbgstage.se/sitemap.xml", "https://example.org/sitemap.xml"]
```

Push the workflow to the repository's default branch. In GitHub, open **Actions > Sitemap page tests > Run workflow** and choose the branch you want to test. The workflow requires `SITEMAP_URLS`; it does not read the local settings file.

The workflow creates a matrix job for each URL in the variable, installs Chromium, and runs the corresponding page tests with two workers. A failure in one sitemap job does not cancel the others. Each job has a two-hour timeout and uploads a `playwright-report-<job index>` artifact, retained for seven days. Download the artifact from the workflow run to inspect the HTML report.

## Call from another repository

This is a reusable workflow hosted at [helsingborg-stad/municipio-e2e-action](https://github.com/helsingborg-stad/municipio-e2e-action). In the calling repository, add `.github/workflows/sitemap-tests.yml` with:

```yaml
name: Sitemap page tests
on:
  workflow_dispatch:

jobs:
  sitemap-tests:
    uses: helsingborg-stad/municipio-e2e-action/.github/workflows/sitemap-tests.yml@main
    with:
      tests_repository: helsingborg-stad/municipio-e2e-action
      tests_ref: main
      sitemap_urls: ${{ vars.SITEMAP_URLS }}
```

Set `SITEMAP_URLS` as a JSON array in the **calling** repository's Actions variables, or supply a JSON array directly as `sitemap_urls`. The `tests_ref` input should match the version in `uses`, so the tests and reusable workflow come from the same revision. For reproducible runs, replace both `main` values with the same release tag or commit SHA when one is available.

The tests repository is public, so callers do not need a separate access token or reusable-workflow access setting. Reports are uploaded to the calling repository's workflow run.