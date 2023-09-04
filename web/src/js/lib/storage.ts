import { City } from '../App';

const STORAGE_KEY = 'polymedia.timezones.cities';

export function saveCitiesToStorage(cities: City[]): void
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export function loadCitiesFromStorage(): Map<string, City>
{
    const cityMap = new Map<string, City>();
    const rawValue = localStorage.getItem(STORAGE_KEY);
    if (!rawValue) {
        return cityMap;
    }
    const cityArr: City[] = JSON.parse(rawValue);
    for (const city of cityArr) {
        const key = getCityKey(city);
        cityMap.set(key, city);
    }
    return cityMap;
}

export function getCityKey(city: City): string {
    return city.name + '.' + city.country;
}
