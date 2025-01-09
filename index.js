const puppeteer = require("puppeteer");

const url = "https://www.google.com/maps/";
const keyWord = "esquadrias aluminio guaruja";
const businessName = 'Mazaglass - Esquadrias de Alumínio e Vidros Guarujá';

async function main(businessName) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(url);
    await page.type(".fontBodyMedium.searchboxinput.xiQnY", keyWord);
    await page.keyboard.press("Enter");

    await page.waitForSelector(".hfpxzc");

    const position = await page.evaluate(async (businessName) => {
        await new Promise((resolve) => {
            const div = document.querySelector('div[role="feed"]');
            if (!div) {
                resolve();
                return;
            }

            let previousHeight = div.scrollHeight;
            const scrollInterval = setInterval(() => {
                div.scrollTop += 80;
                if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
                    setTimeout(() => {
                        if (previousHeight === div.scrollHeight) {
                            clearInterval(scrollInterval);
                            resolve();
                        } else {
                            previousHeight = div.scrollHeight;
                        }
                    }, 3000);
                }
            }, 100);
        });

        const results = Array.from(document.querySelectorAll(".hfpxzc"));
        const filteredResults = results
            .map((result) => {
                const title = result.getAttribute("aria-label");
                return title ? { title } : null;
            })
            .filter((item) => item !== null);

        const position = filteredResults.findIndex((item => item.title === businessName));
        return position + 1;
    }, businessName);

    console.log(`O ${businessName} está na ${position}° posição no ranking do Google.`);
    await browser.close();
}

main(businessName);
