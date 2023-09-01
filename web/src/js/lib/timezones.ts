import timezones from './timezones.json';

/**
 * Return the timezones from timezones.ts that exist in the current browser
 */
export function loadTimezones(): typeof timezones {
    // @ts-ignore // this flag can be removed when VSCode updates to TypeScript >= 5.1
    const browserTzs: string[] = Intl.supportedValuesOf('timeZone');
    const selectedTzs = timezones.filter(tz => browserTzs.includes(tz.timezone));
    return selectedTzs;
}
