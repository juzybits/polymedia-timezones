import { useEffect, useState } from 'react';
import { City } from './App';
import { loadTimezones } from './lib/timezones';
import { toLatinString } from './lib/utils';
import '../css/AddCity.less';

// TODO: support arrows and enter keys in .add-city-results
// TODO: support escape key in .add-city-menu

export const AddCityButton: React.FC<{
    openModal: (content: React.ReactNode) => void;
    addCity: (city: City) => void;
}> = ({
    openModal,
    addCity,
}) =>
{
    return (
        <div id='add-city-btn' onClick={() => openModal(<AddCityMenu addCity={addCity} />)}>
            <span>+</span>
        </div>
    );
}

const timezones = loadTimezones();
export const AddCityMenu: React.FC<{
    addCity: (city: City) => void;
}> = ({
    addCity,
}) => {
    const [searchText, setSearchText] = useState('');
    const [filteredCities, setFilteredCities] = useState<City[]>([]);

    useEffect(() => {
        if (searchText.length <= 2) {
            setFilteredCities([]);
            return;
        }
        const citySearch = toLatinString(searchText);
        const foundCities: City[] = [];
        for (const tz of timezones) {
            let citiesCount = tz.citiesLatin.length;
            for (let i = 0; i < citiesCount; i++) {
                const cityLatin = tz.citiesLatin[i];
                if (cityLatin.startsWith(citySearch)) {
                    foundCities.push({
                        name: tz.cities[i], // use the original city name
                        country: tz.countryCode,
                        tz: tz.name
                    });
                }
            }
        }
        setFilteredCities(foundCities);
    }, [searchText]);

    const hasResults = filteredCities.length > 0;
    return (
        <div id='add-city-menu'>
            <h2>Add City</h2>
            <input
                id='add-city-input'
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
                    {filteredCities.map((city, index) => (
                        <div
                            className='result'
                            onClick={() => addCity(city)}
                            key={index}
                        >
                            {city.name} ({city.country.toUpperCase()})
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
