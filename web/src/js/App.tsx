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
    const [localDate, setLocalDate] = useState(new Date());
    const [timeOffset, setTimeOffset] = useState(0); // milliseconds offset from current time
    const localDateRef = useRef(localDate); // use a ref because setInterval() doesn't notice state changes
    const touchStartXRef = useRef<number | null>(null);
    const scrollAccumulatorRef = useRef(0);

    // handle scroll and touch events
    useEffect(() =>
    {
        // desktop
        function handleScroll(event: WheelEvent) {
            const isLandscape = window.innerWidth > window.innerHeight;
            // use deltaY for landscape, deltaX for portrait
            const delta = isLandscape ? event.deltaY : event.deltaX;

            if (isLandscape) {
                // accumulate scroll delta until threshold
                scrollAccumulatorRef.current += delta;
                const threshold = 30; // adjust this value to change sensitivity

                if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
                    const direction = Math.sign(scrollAccumulatorRef.current);
                    setTimeOffset(prev => prev - direction);
                    scrollAccumulatorRef.current = 0; // reset accumulator
                }
            } else {
                // keep portrait mode (horizontal scroll) as is
                const direction = Math.sign(delta);
                setTimeOffset(prev => prev - direction);
            }
        }

        // mobile
        function handleTouchStart(event: TouchEvent) {
            touchStartXRef.current = event.touches[0].clientX;
        }
        function handleTouchEnd(event: TouchEvent) {
            if (touchStartXRef.current === null) return;

            const touchEnd = event.changedTouches[0].clientX;
            const deltaX = touchEnd - touchStartXRef.current;

            // only trigger if the swipe is significant enough (30px)
            if (Math.abs(deltaX) > 30) {
                const direction = Math.sign(deltaX);
                setTimeOffset(prev => prev + direction); // swipe right increases time, left decreases
            }

            touchStartXRef.current = null;
        }

        window.addEventListener('wheel', handleScroll, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    // Update time every minute, but include the offset
    useEffect(() => {
        function updateLocalDateEveryMinute() {
            const newDate = new Date();
            if (newDate.getMinutes() !== localDateRef.current.getMinutes()) {
                localDateRef.current = newDate;
                setLocalDate(newDate);
            }
        }
        const intervalId = setInterval(updateLocalDateEveryMinute, 1_000); // try every second
        return () => clearInterval(intervalId);
    }, []);

    // Apply the time offset to the displayed date
    const displayDate = new Date(localDate.getTime() + timeOffset * 60 * 60 * 1000);

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
            <SlotsPanel slots={slots} localDate={displayDate} delCity={delCity} />
            <AddCityButton openModal={openModal} hasCity={hasCity} addCity={addCity} closeModal={closeModal} />
            <AboutButton openModal={openModal} />
            <Modal content={modalContent} onClose={closeModal} />
        </div>
    );
}
