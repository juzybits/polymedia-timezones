import timezones from "./timezones.json";
import { toLatinString } from "./utils";

type Timezone = {
    name: string;
    countryName: string;
    countryCode: string;
    cities: string[];
    citiesLatin: string[];
};

/**
 * Return the timezones from timezones.json that exist in the current browser
 */
export function loadTimezones(): Timezone[] {
    // @ts-ignore // this flag can be removed when VSCode updates to TypeScript >= 5.1
    const browserTzs: string[] = Intl.supportedValuesOf("timeZone");
    const selectedTzs: Timezone[] = [];
    for (const tz of timezones) {
        if (browserTzs.includes(tz.timezone)) {
            selectedTzs.push({
                name: tz.timezone,
                countryName: tz.country_name,
                countryCode: tz.country_code,
                cities: tz.cities,
                citiesLatin: tz.cities.map(city => toLatinString(city)),
            });
        }
    }
    return selectedTzs;
}
