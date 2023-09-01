const fs = require('fs');

const tzData = JSON.parse(fs.readFileSync('clean.json', 'utf-8'));
const cities = [];
for (const tz of tzData) {
    for (const city of tz.cities) {
        cities.push(city);
    }
}

cities.sort((a, b) => a.length - b.length);
for (const city of cities) {
    console.log(city);
}
