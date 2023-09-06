import { City, Slot } from './App';
import { getHourDiff, newDateInTimezone } from './lib/time';
import { getFlagEmoji } from './lib/utils';

/**
 * Full-screen panel with a column/row for each timezone
 */
export const SlotsPanel: React.FC<{
    slots: Slot[];
    localDate: Date;
    delCity: (city: City) => void;
}> = ({
    slots,
    localDate,
    delCity,
}) =>
{
    return (
        <div id='slots-panel'>
            {slots.map((slot, index) => (
                <Slot
                    slot={slot}
                    localDate={localDate}
                    delCity={delCity}
                    key={index}
                />
            ))}
            {slots.length === 0 &&
            <div id='slots-empty'>
                Click the<span className='plus'>&nbsp;+&nbsp;</span>to add your first location.
            </div>}
        </div>
    );
}

/**
 * Colorful slot showing the timezone and city info
 */
const Slot: React.FC<{
    slot: Slot;
    localDate: Date;
    delCity: (city: City) => void;
}> = ({
    slot,
    localDate,
    delCity,
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
    const hourDiffStr = hourDiff === 0 ? '🏠' : (hourDiff > 0 ? '+' : '') + hourDiff;

    // Get the hour as a number between 0 and 23
    const hour = tzDate.getHours();

    // Depending on the hour, choose the slot background and text color
    const direction = (window.innerWidth > window.innerHeight) ? 'to bottom,' : 'to right,';
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
                    <b>{hourStr}</b> : {minuteStr}
                </div>
                {/* <div className='slot-time'><b>{hourStr}</b> : {minuteStr} : {secondStr}</div> */}
                <div className='slot-day'>{dayStr}</div>
                <div className='slot-diff'>{hourDiffStr}</div>
            </div>
            <div className='slot-cities'>
                {slot.cities.map((city, index) => (
                <div
                    className='city'
                    key={index}
                    onClick={() => delCity(city)}
                >
                    <span className='flag'>{getFlagEmoji(city.country)}</span>
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
