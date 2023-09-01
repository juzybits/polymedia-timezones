import { useEffect, useState } from 'react';
import { City } from './App';
import { getLatinCityName, loadTimezones } from './lib/timezones';
import '../css/AddCity.less';

export const AddCityButton: React.FC<{
    openModal: (content: React.ReactNode) => void;
}> = ({
    openModal,
}) =>
{
    return (
        <div id='add-city-btn' onClick={() => openModal(<AddCityMenu />)}>
            <span>+</span>
        </div>
    );
}

const timezones = loadTimezones();
export const AddCityMenu: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredCities, setFilteredCities] = useState<City[]>([]);

    useEffect(() => {
        if (searchText.length <= 2) {
            setFilteredCities([]);
            return;
        }
        const citySearch = getLatinCityName(searchText);
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

    return (
        <div id='add-city-menu'>
            <h2>Add City</h2>
            <input
                id='add-city-input'
                type='text'
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder='Search for a city...'
                spellCheck='false' autoCorrect='off' autoComplete='off'
            />
            {
            filteredCities.length > 0
            ?
            <div id='add-city-results'>
                {filteredCities.map((city, index) => (
                    <div className='result' key={index}>
                        {city.name}
                    </div>
                ))}
            </div>
            : (
                searchText.length <= 2
                ? null
                : <div id='add-city-no-results'>No results. Try searching for a big city nearby.</div>
            )}
        </div>
    );
}
