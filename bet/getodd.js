import { promises as fs } from 'fs';

export async function searchAndPrintLastChars(searchString, filePath) {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        const lines = data.split('\n');

        const results = [];

        lines.forEach(line => {
            if (line.includes(searchString)) {
                const last14Chars = line.slice(-14);
                results.push(last14Chars);
            }
        });

        // Join all collected 14-character strings into one single string
        return results.join(''); // Joins without any separator

    } catch (err) {
        console.error(`Error reading file: ${err}`);
        return ''; // Return an empty string in case of an error
    }
}

// --- Example Usage ---

// Wrap the call in an IIFE (Immediately Invoked Function Expression)
// or an async main function to use 'await' at the top level.
// (async () => {
//     // Call the function and await its result
//     const extractedString = await searchAndPrintLastChars('Basel Copenhagen', 'output.txt');
//     console.log(extractedString); // This will now log the actual string
// })();

// Note: Ensure 'output.txt' exists and has content that matches your search criteria
// For example, if 'output.txt' contains:
// ID: 31609 Aston Villa Newcastle 2.31 3.77 3.11
// ID: 31637 Brighton Fulham 1.97 3.85 3.95
//
// And you search for 'ID:', it would return: "3.113.95"