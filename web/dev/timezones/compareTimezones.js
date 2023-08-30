const fs = require('fs');

const chromeFile = 'chrome.json';
const firefoxFile = 'firefox.json';
// const websiteFile = 'website.json';
const websiteFile = 'clean.json';

const timezonesChrome = JSON.parse(fs.readFileSync(chromeFile, 'utf-8'));
const timezonesFirefox = JSON.parse(fs.readFileSync(firefoxFile, 'utf-8'));
const timezonesWebData = JSON.parse(fs.readFileSync(websiteFile, 'utf-8'));

function compareWebVsBrowser(browserName, browserData) {
    const missingInBrowser = timezonesWebData.filter(webTz =>
        !browserData.includes(webTz.timezone) &&
        (webTz.timezone_old ? !browserData.includes(webTz.timezone_old) : true)
    ).map(tz => tz.timezone);

    console.log('-------------------');
    console.log(`\nTimezones in '${websiteFile}' but not in '${browserName}':`, JSON.stringify(missingInBrowser, null, 2));
}

function compareBrowsers(file1Name, file1Data, file2Name, file2Data) {
    const missingInFile2 = file1Data.filter(tz1 => !file2Data.includes(tz1));

    console.log('-------------------');
    console.log(`\nTimezones in '${file1Name}' but not in '${file2Name}':`, JSON.stringify(missingInFile2, null, 2));
}

// Comparisons
compareWebVsBrowser(chromeFile, timezonesChrome);
compareWebVsBrowser(firefoxFile, timezonesFirefox);
// compareBrowsers(firefoxFile, timezonesFirefox, chromeFile, timezonesChrome);
// compareBrowsers(chromeFile, timezonesChrome, firefoxFile, timezonesFirefox);
