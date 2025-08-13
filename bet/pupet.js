import puppeteer from 'puppeteer';


(async () => {
    const browser = await puppeteer.launch({ headless: true }); // Set to false to see the browser
    const page = await browser.newPage();

    // Navigate to a URL (replace with the page you want to inspect)
    await page.goto('https://www.sportybet.com/ng/sport/football/today');

    // Get all text content from the body of the page
    const allPageText = await page.evaluate(() => {
        return document.body.textContent;
    });

    // Log the extracted text to your Node.js console
    console.log("--- All Text Content of the Page ---");
    console.log(allPageText);
    console.log("------------------------------------");

    await browser.close();
})();