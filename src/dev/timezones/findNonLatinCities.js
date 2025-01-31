const fs = require('fs');

const tzData = JSON.parse(fs.readFileSync('clean.json', 'utf-8'));
const nonLatinRegex = /[^\u0020-\u007F]/;
const citiesWithNonLatinChars = [];

for (const tz of tzData) {
    for (const city of tz.cities) {
        if (nonLatinRegex.test(city)) {
            console.log(`${city}`);
            citiesWithNonLatinChars.push(city);
        }
    }
}

console.log(`\nTotal: ${citiesWithNonLatinChars.length}`);
