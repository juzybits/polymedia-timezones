const fs = require('fs');

const cleanFile = 'clean.json';
const outputFile = 'clean.withcities.json';

const timezonesClean = JSON.parse(fs.readFileSync(cleanFile, 'utf-8'));

function saveTimezonesWithCities() {
    const timezonesWithCities = timezonesClean.filter(tz => tz.cities.length > 0);

    fs.writeFileSync(outputFile, JSON.stringify(timezonesWithCities, null, 4), 'utf-8');
    console.log(`Saved timezones with cities to ${outputFile}`);
}

saveTimezonesWithCities();
