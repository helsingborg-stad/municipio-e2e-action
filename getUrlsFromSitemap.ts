export async function getUrlsFromSitemap(url: string): Promise<URL[]> {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(url);
    const data = await response.text();
    const urlStrings = data.match(/<loc>(.*?)<\/loc>/g)?.map((loc) => loc.replace(/<\/?loc>/g, ''));

    if (!urlStrings) {
        return [];
    }

    const urls = urlStrings.map((urlString) => new URL(urlString));

    urls.forEach((url) => {
        url.searchParams.append('pw_test', '1');
    });

    return urls;
}