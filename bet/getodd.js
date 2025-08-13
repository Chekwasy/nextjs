import { promises as fs } from 'fs'; // Keep this import

async function searchAndPrintLastChars(searchString, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8'); // Use await with promise-based readFile
        const lines = data.split('\n');

        lines.forEach(line => {
            if (line.includes(searchString)) {
                const last14Chars = line.slice(-14);
                console.log(last14Chars);
            }
        });
    } catch (err) {
        console.error(`Error reading file: ${err}`);
    }
}

// --- Example Usage ---
// First, create a dummy pup.txt for demonstration
// const dummyContent = `This is a test line with man united and some extra text.
// Another line without the string.
// Manchester United is a famous football club. Here are some numbers: 1234567890ABCD
// A line with man united at the end. Final characters.
// This line is short.
// `;

// fs.writeFileSync('pup.txt', puppeteer.txt);

// Call the function to search for 'man united' in 'pup.txt'
searchAndPrintLastChars('Cerro Porteno', 'pup.txt');