const puppeteer = require('puppeteer-extra');
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-dev-shm-usage']
    });
    const page = await browser.newPage();
    await page.goto('https://www.tiktok.com/@anitta');
    await page.setViewport({
        width: 1200,
        height: 800
    });
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if(req.resourceType() === 'image'){
        req.abort();
        }
        else {
        req.continue();
        }
        });

    await autoScroll(page);

    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    });

    await browser.close();
})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}