import { useEffect, useRef, useState } from "react";

import { AddCityButton } from "./AddCity";
import { HelpButton } from "./Help";
import { loadCitiesFromStorage, saveCitiesToStorage } from "./lib/storage";
import { compareTimezones, newDateInTimezone } from "./lib/time";
import { Modal } from "./Modal";
import { SlotsPanel } from "./Slots";
import "./styles/App.less";

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

const SCROLL_THRESHOLD = 30;

export const App = () =>
{
    const [localDate, setLocalDate] = useState(new Date());
    const [timeOffset, setTimeOffset] = useState(0); // milliseconds offset from current time
    const localDateRef = useRef(localDate); // use a ref because setInterval() doesn't notice state changes
    const touchStartXRef = useRef<number | null>(null);
    const touchStartYRef = useRef<number | null>(null);
    const scrollAccumulatorRef = useRef(0);

    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const modalOpenRef = useRef(false); // needed for event handlers

    // handle scroll and touch events
    useEffect(() =>
    {
        const isLandscape = () => window.innerWidth > window.innerHeight;

        // desktop
        function handleScroll(event: WheelEvent) {
            if (modalOpenRef.current) return;

            if (isLandscape()) {
                // In landscape, only respond to vertical scrolling (deltaY)
                if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;

                scrollAccumulatorRef.current += event.deltaY;
                const threshold = SCROLL_THRESHOLD;

                if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
                    const direction = Math.sign(scrollAccumulatorRef.current);
                    // Scroll up = increase time, scroll down = decrease time
                    setTimeOffset(prev => prev + direction);
                    scrollAccumulatorRef.current = 0;
                }
            } else {
                // In portrait, only respond to horizontal scrolling (deltaX)
                if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) return;

                scrollAccumulatorRef.current += event.deltaX;
                const threshold = SCROLL_THRESHOLD;

                if (Math.abs(scrollAccumulatorRef.current) >= threshold) {
                    const direction = Math.sign(scrollAccumulatorRef.current);
                    // Scroll left = decrease time, scroll right = increase time
                    setTimeOffset(prev => prev - direction);
                    scrollAccumulatorRef.current = 0;
                }
            }
        }

        // mobile
        function handleTouchStart(event: TouchEvent) {
            touchStartXRef.current = event.touches[0].clientX;
            touchStartYRef.current = event.touches[0].clientY;
        }

        function handleTouchEnd(event: TouchEvent) {
            if (modalOpenRef.current) return;

            if (touchStartXRef.current === null || touchStartYRef.current === null) return;

            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            const deltaX = touchEndX - touchStartXRef.current;
            const deltaY = touchEndY - touchStartYRef.current;

            if (isLandscape()) {
                // In landscape, only respond to vertical swipes
                if (Math.abs(deltaY) > SCROLL_THRESHOLD && Math.abs(deltaY) > Math.abs(deltaX) * 2) {
                    const direction = Math.sign(deltaY);
                    // Swipe down = increase time, swipe up = decrease time
                    setTimeOffset(prev => prev + direction);
                }
            } else {
                // In portrait, only respond to horizontal swipes
                if (Math.abs(deltaX) > SCROLL_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 2) {
                    const direction = Math.sign(deltaX);
                    // Swipe left = increase time, swipe right = decrease time
                    setTimeOffset(prev => prev - direction);
                }
            }

            touchStartXRef.current = null;
            touchStartYRef.current = null;
        }

        window.addEventListener("wheel", handleScroll, { passive: true });
        window.addEventListener("touchstart", handleTouchStart, { passive: true });
        window.addEventListener("touchend", handleTouchEnd, { passive: true });

        return () => {
            window.removeEventListener("wheel", handleScroll);
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
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
                const cityDiff = compareTimezones(cityA.tz, cityB.tz);
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
        setCities(new Map(cities.set(city.key, city)));
    }

    function delCity(city: City): void {
        cities.delete(city.key);
        setCities(new Map(cities));
    }

    /* Modal menu */

    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
        document.body.classList.add("modal-open");
        modalOpenRef.current = true;
    };

    const closeModal = () => {
        setModalContent(null);
        document.body.classList.remove("modal-open");
        modalOpenRef.current = false;
    };

    /* Render */

    return (
        <div id="layout">
            {timeOffset !== 0 && (
                <div
                    id="time-offset-indicator"
                    onClick={() => setTimeOffset(0)}
                    title="Click to reset to current time"
                >
                    <span>{timeOffset > 0 ? `+${timeOffset}` : timeOffset} hours from now</span>
                    <span className="reset-time">↺</span>
                </div>
            )}
            <SlotsPanel
                slots={slots}
                localDate={displayDate}
                delCity={delCity}
                hasOffset={timeOffset !== 0}
            />
            <AddCityButton openModal={openModal} hasCity={hasCity} addCity={addCity} closeModal={closeModal} />
            <HelpButton openModal={openModal} />
            <Modal content={modalContent} onClose={closeModal} />
        </div>
    );
};
