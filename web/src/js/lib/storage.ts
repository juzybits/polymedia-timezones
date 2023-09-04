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
        city.key = getCityKey(city.name, city.country);
        cityMap.set(city.key, city);
    }
    return cityMap;
}

export function getCityKey(
    city_name: string,
    city_country: string
): string {
    return city_name + '.' + city_country;
}
