import { useEffect, useRef, useState } from 'react';
import { getHourDiff, compareTimezones, newDateInTimezone } from './lib/time';
import '../css/App.less';

/*
TODO: let user select cities
TODO: load/save config from local storage
*/

type City = {
    name: string;
    country_code: string;
    tz: string;
};

type Column = {
    cities: City[];
};

export const App: React.FC = () =>
{
    const [localDate, setLocalDate] = useState(new Date());
    const localDateRef = useRef(localDate); // we use a ref because setInterval() doesn't notice state changes
    useEffect(() => {
        // Repaint the columns when the minute changes
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
        { name: 'Milan', tz: 'Europe/Rome', country_code: 'it' },
        { name: 'Austin', tz: 'America/Chicago', country_code: 'us' },
    ]);
    const [columns, setColumns] = useState<Column[]>([]);
    useEffect(() => {
        function rebuildColumns() {
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

            // Group cities into columns when they have the same time
            const sortedColumns = new Map<number, Column>();
            const localDate = new Date();
            for (const city of sortedCities) {
                const tzDate = newDateInTimezone(localDate, city.tz);
                const colKey = tzDate.getTime();
                const column: Column = sortedColumns.get(colKey) || { cities: [] };
                column.cities.push(city);
                sortedColumns.set(colKey, column);
            }
            setColumns([...sortedColumns.values()]);
        }
        rebuildColumns();
    }, [cities]);

    return (
        <div id='layout'>
            <ButtonAddCity />
            <ColumnsPanel columns={columns} localDate={localDate} />
        </div>
    );
}

const ButtonAddCity: React.FC = () =>
{
    return <div id='btn-add-city'>
        <span>+</span>
    </div>;
}

/**
 * Full-screen panel with a column for each timezone
 */
const ColumnsPanel: React.FC<{
    columns: Column[];
    localDate: Date,
}> = ({
    columns,
    localDate,
}) =>
{
    const [orientation, setOrientation] = useState<string>('horizontal');

    useEffect(() => {
        function updateOrientationOnResize() {
            if (window.innerHeight > window.innerWidth) {
                setOrientation('vertical');
            } else {
                setOrientation('horizontal');
            }
        }

        updateOrientationOnResize();

        window.addEventListener('resize', updateOrientationOnResize);

        return () => { // cleanup listener on component unmount
            window.removeEventListener('resize', updateOrientationOnResize);
        }
    }, []);

    return (
        <div id='columns-panel' className={orientation}>
            {columns.map((column, index) => (
                <Column column={column} localDate={localDate} key={index} />
            ))}
        </div>
    );
}

/**
 * Colorful column showing the timezone and city info
 */
const Column: React.FC<{
    column: Column;
    localDate: Date,
}> = ({
    column,
    localDate,
}) =>
{
    // The cities in a column may be on different timezones, but it is the same time in all of them,
    // e.g. 'Europe/Paris' and 'Europe/Rome'. So we can use any of those timezones to create `tzDate`.
    const tz = column.cities[0].tz;
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

    // Depending on the hour, choose the column background and text color
    const gradients = [
        'linear-gradient(rgb(3, 12, 27), rgb(8, 9, 35))', // 00
        'linear-gradient(rgb(3, 12, 27), rgb(8, 9, 35))', // 01
        'linear-gradient(rgb(3, 12, 27), rgb(3, 12, 27))', // 02
        'linear-gradient(rgb(4, 15, 34), rgb(3, 12, 27))', // 03
        'linear-gradient(rgb(8, 28, 52), rgb(4, 15, 34))', // 04
        'linear-gradient(rgb(33, 83, 102), rgb(8, 28, 52))', // 05
        'linear-gradient(rgb(57, 138, 151), rgb(33, 83, 102))', // 06
        'linear-gradient(rgb(89, 184, 188), rgb(57, 138, 151))', // 07
        'linear-gradient(rgb(146, 205, 188), rgb(89, 184, 188))', // 08
        'linear-gradient(rgb(203, 225, 188), rgb(146, 205, 188))', // 09
        'linear-gradient(rgb(241, 237, 179), rgb(203, 225, 188))', // 10
        'linear-gradient(rgb(245, 234, 154), rgb(241, 237, 179))', // 11
        'linear-gradient(rgb(250, 231, 128), rgb(245, 234, 154))', // 12
        'linear-gradient(rgb(254, 228, 103), rgb(250, 231, 128))', // 13
        'linear-gradient(rgb(250, 201, 97), rgb(254, 228, 103))', // 14
        'linear-gradient(rgb(246, 175, 90), rgb(250, 201, 97))', // 15
        'linear-gradient(rgb(241, 149, 84), rgb(246, 175, 90))', // 16
        'linear-gradient(rgb(202, 118, 94), rgb(241, 149, 84))', // 17
        'linear-gradient(rgb(152, 87, 110), rgb(202, 118, 94))', // 18
        'linear-gradient(rgb(101, 56, 126), rgb(152, 87, 110))', // 19
        'linear-gradient(rgb(69, 36, 108), rgb(101, 56, 126))', // 20
        'linear-gradient(rgb(43, 19, 79), rgb(69, 36, 108))', // 21
        'linear-gradient(rgb(16, 2, 51), rgb(43, 19, 79))', // 22
        'linear-gradient(rgb(12, 6, 43), rgb(16, 2, 51))', // 23
    ];
    const backgroundImage = gradients[hour];
    const color = (hour >= 8 && hour <= 16) ? 'rgb(50, 50, 50)' : 'rgb(255, 255, 255)';

    return (
        <div
            className='column'
            style={{ backgroundImage, color}}
        >
            <div className='column-time'><b>{hourStr}</b> : {minuteStr}</div>
            {/* <div className='column-time'><b>{hourStr}</b> : {minuteStr} : {secondStr}</div> */}
            <div className='column-day'>{dayStr}</div>
            <div className='column-diff'>{hourDiffStr}</div>
            <div className='column-cities'>
                {column.cities.map(city => (
                <div className='city'>
                    <span className='flag'>{getFlagEmoji(city.country_code)}</span>
                    <span>{city.name}</span>
                </div>
                ))}
            </div>
        </div>
    );
}

function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}
