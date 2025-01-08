const puppeteer = require("puppeteer");

const url = "https://www.google.com/maps/";
const keyWord = "esquadrias aluminio guaruja";

async function main() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.type(".fontBodyMedium.searchboxinput.xiQnY", keyWord);
    await page.keyboard.press("Enter");

    await page.waitForSelector(".hfpxzc");

    const jesusMeAjuda = await page.evaluate(async () => {
        await new Promise((resolve) => {
            const distance = 100;
            let scrolledAmount = 0;

            const timer = setInterval(() => {

                window.scrollBy(0, distance);
                scrolledAmount += distance;

                if (scrolledAmount >= document.body.scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });

        const results = Array.from(document.querySelectorAll(".hfpxzc"));
        return results
            .map((result) => {
                const title = result.getAttribute("aria-label");
                return title ? { title } : null;
            })
            .filter((item) => item !== null);
    });

    console.log(jesusMeAjuda);
    await browser.close();
}

main();

