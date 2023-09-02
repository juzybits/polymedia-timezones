import { useEffect, useRef, useState } from 'react';
import { compareTimezones, newDateInTimezone } from './lib/time';
import '../css/App.less';
import { Modal } from './Modal';
import { AddCityButton } from './AddCity';
import { SlotsPanel } from './Slots';

/*
TODO: let user select cities
TODO: load/save config from local storage
*/

// A city chosen by the user
export type City = {
    name: string;
    country: string;
    tz: string;
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

    const [cities, setCities] = useState<City[]>([
        { name: 'Osaka', tz: 'Asia/Tokyo', country: 'jp' },
        { name: 'Mumbai', tz: 'Asia/Kolkata', country: 'in' },
        { name: 'Munich', tz: 'Europe/Berlin', country: 'de' },
        { name: 'Frankfurt', tz: 'Europe/Berlin', country: 'de' },
        { name: 'Milan', tz: 'Europe/Rome', country: 'it' },
        { name: 'Naples', tz: 'Europe/Rome', country: 'it' },
        { name: 'Budapest', tz: 'Europe/Budapest', country: 'hu' },
        { name: 'Austin', tz: 'America/Chicago', country: 'us' },
        { name: 'Honolulu', tz: 'Pacific/Honolulu', country: 'us' },
        { name: 'Singapore', tz: 'Asia/Singapore', country: 'sg' },
        { name: 'Auckland', tz: 'Pacific/Auckland', country: 'nz' },
    ]);
    const [slots, setSlots] = useState<Slot[]>([]);
    useEffect(() => {
        function rebuildSlots() {
            // Deduplicate cities by name
            const cityMap: Map<string, City> = new Map();
            for (const city of cities) {
                cityMap.set(city.name, city);
            }
            const uniqueCities: City[] = [...cityMap.values()];

            // Sort cities by timezone and name
            const sortedCities = uniqueCities.sort(
                (cityA, cityB) =>{
                    const result = compareTimezones(cityA.tz, cityB.tz)
                    if (result !== 0)
                        return result;
                    return cityA.name.localeCompare(cityB.name);
                }
            );

            // Group cities into slots when they have the same time
            const sortedSlots = new Map<number, Slot>();
            const localDate = new Date();
            for (const city of sortedCities) {
                const tzDate = newDateInTimezone(localDate, city.tz);
                const colKey = tzDate.getTime();
                const slot: Slot = sortedSlots.get(colKey) || { cities: [] };
                slot.cities.push(city);
                sortedSlots.set(colKey, slot);
            }
            setSlots([...sortedSlots.values()]);
        }
        rebuildSlots();
    }, [cities]);

    function addCity(city: City): void {
        setCities([...cities, city]);
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
            <SlotsPanel slots={slots} localDate={localDate} />
            <AddCityButton openModal={openModal} addCity={addCity} />
            <Modal content={modalContent} onClose={closeModal} />
        </div>
    );
}
