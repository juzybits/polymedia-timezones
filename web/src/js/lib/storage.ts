import { City } from '../App';

const STORAGE_KEY = 'polymedia.timezones.cities';

const DEFAULTS = new Map<string, City>([
    ['San Francisco', { name: 'San Francisco', tz: 'America/Los_Angeles', country: 'us' }],
    ['London', { name: 'London', tz: 'Europe/London', country: 'gb' }],
    ['Dubai', { name: 'Dubai', tz: 'Asia/Dubai', country: 'ae' }],
    ['Bangkok', { name: 'Bangkok', tz: 'Asia/Bangkok', country: 'th' }],
    ['Tokyo', { name: 'Tokyo', tz: 'Asia/Tokyo', country: 'jp' }],
]);

export function saveCitiesToStorage(cities: City[]): void
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export function loadCitiesFromStorage(): Map<string, City>
{
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
        return DEFAULTS;
    }
    const cityArr: City[] = JSON.parse(rawValue);
    const cityMap = new Map<string, City>();
    for (const city of cityArr) {
        const key = getCityKey(city);
        cityMap.set(key, city);
    }
    return cityMap;
}

export function getCityKey(city: City): string {
    return city.name + '.' + city.country;
}
