import { useEffect, useRef, useState } from 'react';
import { City } from './App';
import { getCityKey } from './lib/storage';
import { loadTimezones } from './lib/timezones';
import { toLatinString } from './lib/utils';

export const AddCityButton: React.FC<{
    openModal: (content: React.ReactNode) => void;
    hasCity: (city: City) => boolean;
    addCity: (city: City) => void;
    closeModal: () => void;
}> = ({
    openModal,
    hasCity,
    addCity,
    closeModal,
}) =>
{
    return (
        <div
            id='add-city-btn'
            className='big-btn'
            onClick={() => openModal(
                <AddCityMenu hasCity={hasCity} addCity={addCity} closeModal={closeModal} />
            )}
        >
            <span>+</span>
        </div>
    );
}

type UICity = City & {
    selected: boolean;
};
const timezones = loadTimezones();

export const AddCityMenu: React.FC<{
    hasCity: (city: City) => boolean;
    addCity: (city: City) => void;
    closeModal: () => void;
}> = ({
    hasCity,
    addCity,
    closeModal,
}) => {
    const [searchText, setSearchText] = useState('');
    const [foundCities, setFoundCities] = useState<UICity[]>([]);

    useEffect(() => {
        if (searchText.length <= 2) {
            setFoundCities([]);
            return;
        }
        const searchLatin = toLatinString(searchText);
        const newFoundCities: UICity[] = [];
        for (const tz of timezones) {
            let citiesCount = tz.citiesLatin.length;
            for (let i = 0; i < citiesCount; i++) {
                const cityLatin = tz.citiesLatin[i];
                if (!cityLatin.startsWith(searchLatin)) {
                    continue;
                }
                const city: UICity = {
                    name: tz.cities[i], // the actual city name with special characters
                    country: tz.countryCode,
                    tz: tz.name,
                    key: getCityKey(tz.cities[i], tz.countryCode),
                    selected: false,
                };
                city.selected = hasCity(city);
                newFoundCities.push(city);
            }
        }
        setFoundCities(newFoundCities);
    }, [searchText]);

    const inputRef = useRef<HTMLInputElement>(null);
    const hasResults = foundCities.length > 0;
    return (
        <div id='add-city-menu'>
            <h2>Add City</h2>
            <input
                id='add-city-input'
                ref={inputRef}
                className={hasResults ? 'has-results' : ''}
                type='text'
                value={searchText}
                autoFocus
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Search for a city...'
                spellCheck='false' autoCorrect='off' autoComplete='off'
            />
            {
                hasResults
                ?
                <div id='add-city-results' >
                    {foundCities.map((city, index) => (
                        <div
                            className={`city-result ${city.selected ? 'selected' : ''}`}
                            onClick={() => {
                                if (!city.selected) {
                                    city.selected = true;
                                    addCity(city);
                                    setFoundCities([...foundCities]);
                                }
                                closeModal();
                            }}
                            key={index}
                        >
                            <span>{city.name} ({city.country.toUpperCase()})</span>
                            {city.selected && <span className='city-checkmark'>✓</span>}
                        </div>
                    ))}
                </div>
                :
                (
                    searchText.length <= 2
                    ? null
                    : <div id='add-city-no-results'>No results. Try searching for a big city nearby.</div>
                )
            }
        </div>
    );
}
