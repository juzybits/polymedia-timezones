import { useEffect, useRef, useState } from 'react';
import { getHourDiff, compareTimezones, newDateInTimezone } from './lib/time';
import '../css/App.less';
import { Modal } from './Modal';

/*
TODO: let user select cities
TODO: load/save config from local storage
*/

// A city chosen by the user
type City = {
    name: string;
    country_code: string;
    tz: string;
};

// A colorful column/row (in landscape/portrait) showing the time, day, city names...
type Slot = {
    cities: City[];
};

export const App: React.FC = () =>
{
    const [localDate, setLocalDate] = useState(new Date());
    const localDateRef = useRef(localDate); // we use a ref because setInterval() doesn't notice state changes
    useEffect(() => {
        // Repaint the slots when the minute changes
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

    const [cities, _setCities] = useState<City[]>([
        { name: 'Osaka', tz: 'Asia/Tokyo', country_code: 'jp' },
        { name: 'Mumbai', tz: 'Asia/Kolkata', country_code: 'in' },
        { name: 'Munich', tz: 'Europe/Berlin', country_code: 'de' },
        { name: 'Munich', tz: 'Europe/Berlin', country_code: 'de' },
        { name: 'Frankfurt', tz: 'Europe/Berlin', country_code: 'de' },
        { name: 'Milan', tz: 'Europe/Rome', country_code: 'it' },
        { name: 'Naples', tz: 'Europe/Rome', country_code: 'it' },
        { name: 'Budapest', tz: 'Europe/Budapest', country_code: 'hu' },
        { name: 'Austin', tz: 'America/Chicago', country_code: 'us' },
        { name: 'Honolulu', tz: 'Pacific/Honolulu', country_code: 'us' },
        { name: 'Singapore', tz: 'Asia/Singapore', country_code: 'sg' },
        { name: 'Auckland', tz: 'Pacific/Auckland', country_code: 'nz' },
    ]);
    const [slot, setSlots] = useState<Slot[]>([]);
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

    const [modalContent, setModalContent] = useState<React.ReactNode | null>(null);
    const openModal = (content: React.ReactNode) => {
        setModalContent(content);
    };
    const closeModal = () => {
        setModalContent(null);
    };


    return (
        <div id='layout'>
            <SlotsPanel slots={slot} localDate={localDate} />
            <ButtonAddCity openModal={openModal} />
            <Modal content={modalContent} onClose={closeModal} />
        </div>
    );
}

const ButtonAddCity: React.FC<{
    openModal: (content: React.ReactNode) => void;
}> = ({
    openModal,
}) =>
{
    return <div id='btn-add-city' onClick={() => openModal(<div>Hello from the modal!</div>)}>
        <span>+</span>
    </div>;
}

/**
 * Full-screen panel with a column/row for each timezone
 */
const SlotsPanel: React.FC<{
    slots: Slot[];
    localDate: Date,
}> = ({
    slots,
    localDate,
}) =>
{
    const [orientation, setOrientation] = useState<string>('horizontal');
    const [narrow, setNarrow] = useState<boolean>(false);

    useEffect(() => {
        // Update `orientation` and `narrow`
        function onResize() {
            const orientation = (window.innerHeight > window.innerWidth) ? 'vertical' : 'horizontal';
            setOrientation(orientation);
            const firstSlot = document.querySelector('#slots-panel > .slot:first-child');
            setNarrow(!!firstSlot && firstSlot.clientWidth < 168);
        }

        onResize();

        window.addEventListener('resize', onResize);

        return () => { // cleanup listener on component unmount
            window.removeEventListener('resize', onResize);
        }
    }, []);

    return (
        <div id='slots-panel' className={orientation}>
            {slots.map((slot, index) => (
                <Slot slot={slot} localDate={localDate} orientation={orientation} narrow={narrow} key={index} />
            ))}
        </div>
    );
}

/**
 * Colorful slot showing the timezone and city info
 */
const Slot: React.FC<{
    slot: Slot;
    localDate: Date,
    orientation: string,
    narrow: boolean,
}> = ({
    slot,
    localDate,
    orientation,
    narrow,
}) =>
{
    // The cities in a slot may be on different timezones, but it is the same time in all of them,
    // e.g. 'Europe/Paris' and 'Europe/Rome'. So we can use any of those timezones to create `tzDate`.
    const tz = slot.cities[0].tz;
    const tzDate = newDateInTimezone(localDate, tz);

    // Format the day as 'Mon 28', 'Fri 1', etc
    const dayStr = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
    }).format(tzDate);

    // Format hours and minutes as 2-digit strings
    const hourAndMinutes = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hourCycle: 'h23',

    }).format(tzDate).split(':');;
    const hourStr = hourAndMinutes[0];
    const minuteStr = hourAndMinutes[1];
    // const secondStr = hourAndMinutes[2];

    // Format the hour difference vs local time as '-8', '+5.5', '0', etc
    const hourDiff = getHourDiff(localDate, tzDate);
    const hourDiffStr = (hourDiff >= 0 ? '+' : '') + hourDiff;

    // Get the hour as a number between 0 and 23
    const hour = tzDate.getHours();

    // Depending on the hour, choose the slot background and text color
    const direction = orientation === 'horizontal' ? 'to bottom,' : 'to right,';
    const backgroundImage = `linear-gradient(${direction} ${gradients[hour]})`;
    const color = (hour >= 8 && hour <= 17) ? 'rgb(50, 50, 50)' : 'rgb(255, 255, 255)';

    return (
        <div
            className='slot'
            style={{ backgroundImage, color}}
        >
            <div className='slot-top-filler'></div>
            <div className='slot-main'>
                <div className='slot-time'>
                    <b>{hourStr}</b>{narrow ? <br/> : <span> : </span>}{minuteStr}
                </div>
                {/* <div className='slot-time'><b>{hourStr}</b> : {minuteStr} : {secondStr}</div> */}
                <div className='slot-day'>{dayStr}</div>
                <div className='slot-diff'>{hourDiffStr}</div>
            </div>
            <div className='slot-cities'>
                {slot.cities.map((city, index) => (
                <div className='city' key={index}>
                    <span className='flag'>{getFlagEmoji(city.country_code)}</span>
                    <span className='name'>{city.name}</span>
                </div>
                ))}
            </div>
        </div>
    );
}

// A gradient for every hour of the day
const gradients = [
    'rgb(3, 12, 27), rgb(8, 9, 35)', // 00
    'rgb(3, 12, 27), rgb(8, 9, 35)', // 01
    'rgb(3, 12, 27), rgb(3, 12, 27)', // 02
    'rgb(4, 15, 34), rgb(3, 12, 27)', // 03
    'rgb(8, 28, 52), rgb(4, 15, 34)', // 04
    'rgb(33, 83, 102), rgb(8, 28, 52)', // 05
    'rgb(57, 138, 151), rgb(33, 83, 102)', // 06
    'rgb(89, 184, 188), rgb(57, 138, 151)', // 07
    'rgb(146, 205, 188), rgb(89, 184, 188)', // 08
    'rgb(203, 225, 188), rgb(146, 205, 188)', // 09
    'rgb(241, 237, 179), rgb(203, 225, 188)', // 10
    'rgb(245, 234, 154), rgb(241, 237, 179)', // 11
    'rgb(250, 231, 128), rgb(245, 234, 154)', // 12
    'rgb(254, 228, 103), rgb(250, 231, 128)', // 13
    'rgb(250, 201, 97), rgb(254, 228, 103)', // 14
    'rgb(246, 175, 90), rgb(250, 201, 97)', // 15
    'rgb(241, 149, 84), rgb(246, 175, 90)', // 16
    'rgb(202, 118, 94), rgb(241, 149, 84)', // 17
    'rgb(152, 87, 110), rgb(202, 118, 94)', // 18
    'rgb(101, 56, 126), rgb(152, 87, 110)', // 19
    'rgb(69, 36, 108), rgb(101, 56, 126)', // 20
    'rgb(43, 19, 79), rgb(69, 36, 108)', // 21
    'rgb(16, 2, 51), rgb(43, 19, 79)', // 22
    'rgb(12, 6, 43), rgb(16, 2, 51)', // 23
];

function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
