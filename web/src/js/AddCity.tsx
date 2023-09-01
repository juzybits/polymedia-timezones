import { useEffect, useState } from 'react';
import { City } from './App';
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

export const AddCityMenu: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredCities, _setFilteredCities] = useState<City[]>([]);

    useEffect(() => {
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
            {filteredCities.length > 0 &&
            <div id='add-city-results'>
                {filteredCities.map((city, index) => (
                    <div className='result' key={index}>
                        {city.name}
                    </div>
                ))}
            </div>}
        </div>
    );
}
