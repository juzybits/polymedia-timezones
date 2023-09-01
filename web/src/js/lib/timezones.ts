import timezones from './timezones.json';

type Timezone = {
    name: string;
    countryName: string;
    countryCode: string;
    cities: string[];
    citiesLatin: string[];
}

/**
 * Return the timezones from timezones.json that exist in the current browser
 */
export function loadTimezones(): Timezone[] {
    // @ts-ignore // this flag can be removed when VSCode updates to TypeScript >= 5.1
    const browserTzs: string[] = Intl.supportedValuesOf('timeZone');
    const selectedTzs: Timezone[] = [];
    for (const tz of timezones) {
        if (browserTzs.includes(tz.timezone)) {
            selectedTzs.push({
                name: tz.timezone,
                countryName: tz.country_name,
                countryCode: tz.country_code,
                cities: tz.cities,
                citiesLatin: tz.cities.map(city => getLatinCityName(city)),
            });
        }
    }
    return selectedTzs;
}

/**
 * Lowercase, remove accents, and transliterate. For example:
 * Łódź -> lodz
 * Miðvágur -> midvagur
 */
export function getLatinCityName(str: string): string {
    const clean = str
        .normalize('NFD')  // this will decompose accented characters into their components
        .replace(/[\u0300-\u036f]/g, '')  // remove decomposed characters (i.e., non-spacing or 'combining' characters)
        .toLowerCase()
        .replace('’', '\'')
        .replace('‘', '\'')
        .replace('ł', 'l')
        .replace('ø', 'o')
        .replace('æ', 'ae')
        .replace('ð', 'd')
        .replace('ħ', 'h')
        .replace('ı', 'i');
    return clean;
}
