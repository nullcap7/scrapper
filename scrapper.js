const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set realistic headers
    await page.setExtraHTTPHeaders({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Referer": "https://nova.bg/"
    });

    console.log('🌐 Loading nova.bg/live...');
    let streamUrls = new Set();

    // Listen for .m3u8 URLs
    page.on('response', (response) => {
        const url = response.url();
        if (url.includes('.m3u8')) {
            console.log('✅ Found:', url);
            streamUrls.add(url);
        }
    });

    await page.goto('https://nova.bg/live', { 
        waitUntil: 'networkidle2', 
        timeout: 15000 
    });

    // Save all URLs to a text file
    const output = Array.from(streamUrls).join('\n');
    fs.writeFileSync('m3u_links.txt', output);
    console.log(`🔗 Saved ${streamUrls.size} M3U links to m3u_links.txt`);

    await browser.close();
})();
