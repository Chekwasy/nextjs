import puppeteer from 'puppeteer';


// (async () => {
//     const browser = await puppeteer.launch({ headless: true }); // Set to false to see the browser
//     const page = await browser.newPage();

//     // Navigate to a URL (replace with the page you want to inspect)
//     await page.goto('https://www.sportybet.com/ng/sport/football/upcoming?time=0');

//     // Get all text content from the body of the page
//     const allPageText = await page.evaluate(() => {
//         return document.body.textContent;
//     });

//     // Log the extracted text to your Node.js console
//     console.log("--- All Text Content of the Page ---");
//     console.log(allPageText);
//     console.log("------------------------------------");

//     await browser.close();
// })();

import fs from 'fs/promises';



const getcontent = async (link) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
        
    try {
        // Start from the first URL
        let url = link;

        while (url) {

            // Navigate to the current page and wait for the DOM to be ready
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 60000 // Set a generous timeout
            });
            
            // Get the text content from the chapter heading
            const headingText = await page.evaluate(() => {
                const headingElement = document.querySelector('.panel.panel-reading.text-center h1');
                if (headingElement) {
                    return headingElement.textContent.trim();
                }
                return null;
            });
            
            // Append the heading to the file if it exists
            if (headingText) {
                await fs.appendFile('book.txt', `\n\n--- ${headingText} ---\n\n`);
                console.log(`Wrote heading: ${headingText}`);
            }

            // Scroll to the end of the page to load all content
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let lastScrollHeight = 0;
                    const interval = setInterval(() => {
                        const newScrollHeight = document.body.scrollHeight;
                        if (newScrollHeight === lastScrollHeight) {
                            clearInterval(interval);
                            resolve();
                        }
                        lastScrollHeight = newScrollHeight;
                        window.scrollTo(0, lastScrollHeight);
                    }, 500); // Check and scroll every 500ms
                });
            });

            // Wait for at least one <pre> tag to appear
            await page.waitForSelector('pre', { timeout: 30000 });

            // Get the text content from all <p> tags inside <pre> tags on the current page
            const allPText = await page.evaluate(() => {
                const pElements = document.querySelectorAll('pre p');
                let combinedText = '';

                pElements.forEach(p => {
                    // Extract text from child nodes directly to ignore nested divs
                    let pText = '';
                    p.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            pText += node.textContent;
                        }
                    });
                    combinedText += pText.trim() + '\n\n';
                });

                return combinedText;
            });

            // Append the extracted text to a file. Use fs.appendFile to add content without overwriting.
            await fs.appendFile('book.txt', allPText);
            console.log(`Successfully wrote content to book.txt`);

            // Find the "Next Part" button/link to navigate to the next chapter
            const nextButton = await page.$('a.next-part');

            if (nextButton) {
                // Get the URL of the next page and click the button
                url = await page.evaluate(btn => btn.href, nextButton);
            } else {
                // If there is no next button, the loop will terminate
                url = null;
            }

            // Add a small delay to mimic human behavior and avoid being blocked
            await new Promise(resolve => setTimeout(resolve, 2000));
        }


    } catch (error) {
        console.error('An error occurred:', error.message);
    } finally {
        await browser.close();
    }
};
(async () => {
    const links = [
            'https://www.wattpad.com/1549164116-paul-and-veronica-copyright-notice',
            'https://www.wattpad.com/1549163397-paul-and-veronica-author%27s-note',
            'https://www.wattpad.com/1497119712-paul-and-veronica-chapter-1-veronica-the-only-real',
            'https://www.wattpad.com/1497120371-paul-and-veronica-chapter-2-veronica-good-morning',
            'https://www.wattpad.com/1542835273-paul-and-veronica-chapter-3-veronica-the-proper',
            'https://www.wattpad.com/1547493876-paul-and-veronica-chapter-4-veronica-they',
            'https://www.wattpad.com/1549508191-paul-and-veronica-chapter-5-veronica-little-did-i',
            'https://www.wattpad.com/1549705628-paul-and-veronica-chapter-6-veronica-checkmate',
            'https://www.wattpad.com/1549588236-paul-and-veronica-chapter-7-veronica-meet-your',
            'https://www.wattpad.com/1549969374-paul-and-veronica-chapter-8-veronica-another',
            'https://www.wattpad.com/1550326494-paul-and-veronica-chapter-9-paul-attention',
            'https://www.wattpad.com/1550438232-paul-and-veronica-chapter-10-veronica-the-real-fun',
            'https://www.wattpad.com/1550667401-paul-and-veronica-chapter-11-veronica-i-can%27t-say',
            'https://www.wattpad.com/1551274952-paul-and-veronica-chapter-12-paul-the-variable',
            'https://www.wattpad.com/1551603777-paul-and-veronica-chapter-13-paul-the-filth',
            'https://www.wattpad.com/1551604728-paul-and-veronica-chapter-14-paul-his-first-name',
            'https://www.wattpad.com/1552322893-paul-and-veronica-chapter-15-paul-how-suspicious',
            'https://www.wattpad.com/1552615440-paul-and-veronica-you%27re-invited',
            'https://www.wattpad.com/1552476856-paul-and-veronica-chapter-16-veronica-pure-ice',
            'https://www.wattpad.com/1552665384-paul-and-veronica-chapter-17-veronica-a-genteel',
            'https://www.wattpad.com/1553572153-paul-and-veronica-chapter-18-veronica-we%27d-be',
            'https://www.wattpad.com/1554030577-paul-and-veronica-chapter-19-veronica-a-black',
            'https://www.wattpad.com/1554351258-paul-and-veronica-chapter-20-paul-check-on-me',
            'https://www.wattpad.com/1555434239-paul-and-veronica-chapter-21-veronica-feel-fully',
            'https://www.wattpad.com/1555869116-paul-and-veronica-chapter-22-paul-the-suspicious',
            'https://www.wattpad.com/1556357214-paul-and-veronica-chapter-23-veronica-the-garbage',
            'https://www.wattpad.com/1557097886-paul-and-veronica-chapter-24-paul-do-better',
            'https://www.wattpad.com/1557751372-paul-and-veronica-chapter-25-veronica-pay-dearly',
            'https://www.wattpad.com/1558060344-paul-and-veronica-chapter-26-veronica-i-have-some',
            'https://www.wattpad.com/1558427349-paul-and-veronica-chapter-27-veronica-legal',
            'https://www.wattpad.com/1560131873-paul-and-veronica-chapter-28-paul-she-looked-at-me',
            'https://www.wattpad.com/1560328473-paul-and-veronica-chapter-29-veronica-promises',
            'https://www.wattpad.com/1561134994-paul-and-veronica-chapter-30-paul-i-knew-more',
            'https://www.wattpad.com/1562390149-paul-and-veronica-chapter-31-paul-i-knew',
            'https://www.wattpad.com/1563023718-paul-and-veronica-chapter-32-veronica-real',
            'https://www.wattpad.com/1563652318-paul-and-veronica-epilogue-paul-a-good-woman',
            'https://www.wattpad.com/1562390149-paul-and-veronica-chapter-31-paul-i-knew',
            'https://www.wattpad.com/1563023718-paul-and-veronica-chapter-32-veronica-real',
            'https://www.wattpad.com/1563652318-paul-and-veronica-epilogue-paul-a-good-woman'
    ];
    for (let i = 0; i < links.length; i++) {
        console.log(`Scraping page: ${i}`);
        await getcontent(links[i]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log(`Finished scraping page ${i}.`);
    }
})();