export async function writeUrlsToFile(filePath: string, urls: URL[]) {
    const fs = await import('fs');
    const file = fs.createWriteStream(filePath);
    const urlHrefs = urls.map((url) => url.href);

    Array.from(new Set(urlHrefs)).forEach((href) => {
        file.write(href + '\n');
    });

    file.end();
}