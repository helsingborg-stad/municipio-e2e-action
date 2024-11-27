import { getUrlsFromSitemap } from "./getUrlsFromSitemap";
import Logger from "./Logger";
import { writeUrlsToFile } from "./writeUrlsToFile";

function getSitemapUrlsFromEnv(): URL[] {
    const sitemapUrls = process.env.SITEMAP_URLS;
    if (!sitemapUrls) {
        throw new Error('Environment variable SITEMAP_URLS is not set');
    }

    return sitemapUrls.split(' ').map((url) => new URL(url));
}

async function main() {
    const logger = new Logger();
    const path = await import('path');
    const filePath = path.resolve(__dirname, '../fixtures/sitemap-urls.txt');
    const urls: URL[] = [];
    let sitemapUrls: URL[] = [];

    try {
        sitemapUrls = getSitemapUrlsFromEnv();
    } catch (error) {
        logger.logError(error.message);
        process.exit(1);
    }

    for (const sitemapUrl of sitemapUrls) {
        logger.logSuccess(`Getting urls from ${sitemapUrl.href}`);
        let innerUrls: URL[] = [];

        try {
            innerUrls = await getUrlsFromSitemap(sitemapUrl.href)
        } catch (error) {
            logger.logError(error.message);
            process.exit(1);
        }

        logger.logSuccess(`Got ${innerUrls.length} urls from ${sitemapUrl.href}`);

        for (const url of innerUrls) {
            urls.push(url);
        }
    }

    writeUrlsToFile(filePath, urls);
    logger.logSuccess(`Urls written to ${filePath}\n`);
    logger.logSuccess('Setup complete\n');
}

main();