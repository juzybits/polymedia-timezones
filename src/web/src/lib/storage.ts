import { City } from "../App";

const STORAGE_KEY = "polymedia.timezones.cities";

export function saveCitiesToStorage(cities: City[]): void
{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
}

export function loadCitiesFromStorage(): Map<string, City>
{
    const cityMap = new Map<string, City>();
    const rawValue = localStorage.getItem(STORAGE_KEY);
    // const rawValue = getTestCities();
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
        return city_name + "." + city_country;
    }

/*
export function getTestCities(): string
{
    const cities = [
        { "name": "Pago Pago", "country": "as", "tz": "Pacific/Pago_Pago" },
        { "name": "Honolulu", "country": "us", "tz": "Pacific/Honolulu" },
        { "name": "Anchorage", "country": "us", "tz": "America/Anchorage" },
        { "name": "Los Angeles", "country": "us", "tz": "America/Los_Angeles" },
        { "name": "Mexico City", "country": "mx", "tz": "America/Mexico_City" },
        { "name": "New York", "country": "us", "tz": "America/New_York" },
        { "name": "Buenos Aires", "country": "ar", "tz": "America/Buenos_Aires" },
        { "name": "Grytviken", "country": "gs", "tz": "Atlantic/South_Georgia" }, // logo
        { "name": "Reykjavík", "country": "is", "tz": "Atlantic/Reykjavik" },
        { "name": "London", "country": "gb", "tz": "Europe/London" },
        { "name": "Berlin", "country": "de", "tz": "Europe/Berlin" },
        { "name": "Moscow", "country": "ru", "tz": "Europe/Moscow" }, // logo
        { "name": "Dubai", "country": "ae", "tz": "Asia/Dubai" },
        { "name": "Tashkent", "country": "uz", "tz": "Asia/Tashkent" },
        { "name": "Almaty", "country": "kz", "tz": "Asia/Almaty" }, // logo
        { "name": "Bangkok", "country": "th", "tz": "Asia/Bangkok" },
        { "name": "Beijing", "country": "cn", "tz": "Asia/Shanghai" },
        { "name": "Tokyo", "country": "jp", "tz": "Asia/Tokyo" }, // logo
        { "name": "Sydney", "country": "au", "tz": "Australia/Sydney" },
        { "name": "Honiara", "country": "sb", "tz": "Pacific/Guadalcanal" },
        { "name": "Suva", "country": "fj", "tz": "Pacific/Fiji" }
    ];
    return JSON.stringify(cities);
}
*/
