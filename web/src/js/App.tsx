import { useEffect, useRef, useState } from 'react';
import { dateToTime, dateToDay, dateToHours, getHourDiff, compareTimezones } from './lib/time';
import '../css/App.less';

/*
TODO: let user select timezones.
    select from city -> tz map
    sort them by time
TODO: load/save config from local storage
*/

type City = {
    name: string;
    tz: string;
};

type Column = {
    cities: string[];
    tz: string;
    time: string[];
    day: string;
    diff: string;
    hour: number;
};

export const App: React.FC = () =>
{
    const [cities, _setCities] = useState<City[]>([
        { name: 'Osaka', tz: 'Asia/Tokyo' },
        { name: 'Mumbai', tz: 'Asia/Kolkata' },
        { name: 'Munich', tz: 'Europe/Berlin' },
        // { name: 'Munich', tz: 'Europe/Berlin' },
        // { name: 'Milan', tz: 'Europe/Rome' },
        { name: 'Austin', tz: 'America/Chicago' },
    ]);

    const [columns, setColumns] = useState<Column[]>([]);

    useEffect(() => {
        const sortedCities = cities.sort((a, b) => compareTimezones(a.tz, b.tz));

        const now = new Date();
        const sortedColumns: Column[] = sortedCities.map(city => ({
            cities: [city.name],
            tz: city.tz,
            time: dateToTime(now, city.tz),
            day: dateToDay(now, city.tz),
            diff: getHourDiff(now, city.tz),
            hour: dateToHours(now, city.tz),
        }));
        setColumns(sortedColumns);
    }, [cities]);

    return (
        <div id='layout'>
            <ButtonAddCity />
            <ColumnsPanel columns={columns} />
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
}> = ({
    columns,
}) =>
{
    const [now, setNow] = useState(new Date());
    const nowRef = useRef(now); // we need a ref because setInterval() doesn't notice state changes

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newDate = new Date();
            // Only repaint the UI if the minute has changed
            if (newDate.getMinutes() !== nowRef.current.getMinutes()) {
                nowRef.current = newDate;
                setNow(newDate);
            }
        }, 1_000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div id='columns-panel'>
            {columns.map(column => (
                <Column column={column} key={column.tz} />
            ))}
        </div>
    );
}

/**
 * Colorful column showing the timezone and city info
 */
const Column: React.FC<{
    column: Column;
}> = ({
    column,
}) =>
{
    const backgroundImage = gradients[column.hour];
    const color = (column.hour >= 8 && column.hour <= 16) ? 'rgb(67, 67, 67)' : 'rgb(255, 255, 255)';
    return (
        <div
            className='column'
            style={{ backgroundImage, color}}
        >
            <div className='column-time'><b>{column.time[0]}</b> : {column.time[1]}</div>
            <div className='column-day'>{column.day}</div>
            <div className='column-tz'>{column.tz}</div>
            <div className='column-diff'>{column.diff}</div>
        </div>
    );
}

/**
 * Column backgrounds for each of the 24 hours of the day
 */
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

/*
const AllColumns: React.FC = () => {
    return (
        <div id='columns-panel'>
        {gradients.map((gradient, index) => (
            <div
                key={index}
                className='column'
                style={{
                    backgroundImage: gradient,
                    color: (index >= 8 && index <= 16) ? 'rgb(67, 67, 67)' : 'rgb(255, 255, 255)',
                }}
            >
                {index}:00
            </div>
        ))}
        </div>
    );
}
*/
