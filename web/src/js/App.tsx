import { useEffect, useRef, useState } from 'react';
import { AboutButton } from './About';
import { AddCityButton } from './AddCity';
import { Modal } from './Modal';
import { SlotsPanel } from './Slots';
import { loadCitiesFromStorage, saveCitiesToStorage } from './lib/storage';
import { compareTimezones, newDateInTimezone } from './lib/time';
import '../css/App.less';

// A city chosen by the user
export type City = {
    name: string;
    country: string;
    tz: string;
    key: string;
};

// A colorful column/row (in landscape/portrait) showing the time, day, city names...
export type Slot = {
    cities: City[];
};

export const App: React.FC = () =>
{
    /* Update localDate every minute, which will repaint the slots */

    const [localDate, setLocalDate] = useState(new Date());
    const localDateRef = useRef(localDate); // use a ref because setInterval() doesn't notice state changes
    useEffect(() => {
        function updateLocalDateEveryMinute() {
            const newDate = new Date();
            if (newDate.getMinutes() !== localDateRef.current.getMinutes()) {
            // if (newDate.getSeconds() !== localDateRef.current.getSeconds()) {
                localDateRef.current = newDate;
                setLocalDate(newDate);
            }
        }
        const intervalId = setInterval(updateLocalDateEveryMinute, 1_000); // try every second
        return () => clearInterval(intervalId);
    }, []);

    /* Rebuild the slots when the user adds or removes a city */

    const [cities, setCities] = useState<Map<string, City>>(loadCitiesFromStorage());
    const [slots, setSlots] = useState<Slot[]>([]);
    useEffect(() => {
        /* Sort cities by timezone, country, and name */
        const sortedCities = [...cities.values()].sort(
            (cityA, cityB) =>{
                const cityDiff = compareTimezones(cityA.tz, cityB.tz)
                if (cityDiff !== 0) {
                    return cityDiff;
                }
                const countryDiff = cityA.country.localeCompare(cityB.country);
                if (countryDiff !== 0) {
                    return countryDiff;
                }
                return cityA.name.localeCompare(cityB.name);
            }
        );

        /* Update local storage */
        saveCitiesToStorage(sortedCities);

        /* Rebuild slots. Cities with the same time are grouped into one slot. */
        const newSlots = new Map<number, Slot>();
        const localDate = new Date();
        for (const city of sortedCities) {
            const tzDate = newDateInTimezone(localDate, city.tz);
            const colKey = tzDate.getTime();
            const slot: Slot = newSlots.get(colKey) || { cities: [] };
            slot.cities.push(city);
            newSlots.set(colKey, slot);
        }
        setSlots([...newSlots.values()]);
    }, [cities]);

    function hasCity(city: City): boolean {
        return cities.has(city.key);
    }

    function addCity(city: City): void {
        setCities(new Map(cities.set(city.key, city)))
    }

    function delCity(city: City): void {
        cities.delete(city.key);
        setCities(new Map(cities));
    }

    /* Modal menu */

    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
    };
    const closeModal = () => {
        setModalContent(null);
    };

    /* Render */

    return (
        <div id='layout'>
            <SlotsPanel slots={slots} localDate={localDate} delCity={delCity} />
            <AddCityButton openModal={openModal} hasCity={hasCity} addCity={addCity} closeModal={closeModal} />
            <AboutButton openModal={openModal} />
            <Modal content={modalContent} onClose={closeModal} />
        </div>
    );
}
