const fs = require('fs');

const chromeFile = 'chrome.json';
const firefoxFile = 'firefox.json';
const websiteFile = 'website.json';

const timezonesChrome = JSON.parse(fs.readFileSync(chromeFile, 'utf-8'));
const timezonesFirefox = JSON.parse(fs.readFileSync(firefoxFile, 'utf-8'));
const timezonesWebData = JSON.parse(fs.readFileSync(websiteFile, 'utf-8'));
const timezonesWeb = timezonesWebData.map(tz => tz.timezone);

function compareFiles(file1Name, file1Data, file2Name, file2Data) {
    const inFile1NotInFile2 = file1Data.filter(tz => !file2Data.includes(tz));
    const inFile2NotInFile1 = file2Data.filter(tz => !file1Data.includes(tz));

    console.log('-------------------');
    console.log(`\nTimezones in '${file1Name}' but not in '${file2Name}':`, JSON.stringify(inFile1NotInFile2, null, 2));
    console.log(`\nTimezones in '${file2Name}' but not in '${file1Name}':`, JSON.stringify(inFile2NotInFile1, null, 2));
}

// Comparisons
compareFiles(chromeFile, timezonesChrome, firefoxFile, timezonesFirefox);
compareFiles(chromeFile, timezonesChrome, websiteFile, timezonesWeb);
compareFiles(firefoxFile, timezonesFirefox, websiteFile, timezonesWeb);
