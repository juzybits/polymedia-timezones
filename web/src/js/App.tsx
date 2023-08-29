import { useState } from 'react';
import '../css/App.less';

/*
TODO: let user select timezones.
    select from city -> tz map
    sort them by time
TODO: load/save config from local storage
TODO: auto-refresh
*/

export const App: React.FC = () =>
{
    const [timezones, _setTimezones] = useState<string[]>([
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Kolkata',
        'Asia/Tokyo'
    ]);

    return (
        <div id='layout'>
            <ColumnsPanel timezones={timezones} />
        </div>
    );
}

// Show local time in a vertical column for each timezone
const ColumnsPanel: React.FC<{
    timezones: string[];
}> = ({
    timezones,
}) =>
{
    const now = new Date();
    const columns = timezones.map(tz => (
        <Column now={now} tz={tz} />
    ));
    return (
        <div id='columns-panel'>
            {columns}
        </div>
    );
}

const Column: React.FC<{
    now: Date;
    tz: string;
}> = ({
    now,
    tz,
}) =>
{
    const time = dateToTimeStr(now, tz);
    const day = dateToDayStr(now, tz);
    const diff = getHourDiff(now, tz);
    const hour = dateToHours(now, tz);
    const backgroundImage = gradients[hour];
    const color = (hour >= 8 && hour <= 16) ? 'rgb(67, 67, 67)' : 'rgb(255, 255, 255)';
    return (
        <div
            key={tz}
            className='column'
            style={{ backgroundImage, color}}
        >
            <div className='column-time'><b>{time[0]}</b> : {time[1]}</div>
            <div className='column-day'>{day}</div>
            <div className='column-tz'>{tz}</div>
            <div className='column-diff'>{diff}</div>
        </div>
    );
}

const gradients = [
    'linear-gradient(rgb(3, 12, 27), rgb(8, 9, 35))',
    'linear-gradient(rgb(3, 12, 27), rgb(8, 9, 35))',
    'linear-gradient(rgb(3, 12, 27), rgb(3, 12, 27))',
    'linear-gradient(rgb(4, 15, 34), rgb(3, 12, 27))',
    'linear-gradient(rgb(8, 28, 52), rgb(4, 15, 34))',
    'linear-gradient(rgb(33, 83, 102), rgb(8, 28, 52))',
    'linear-gradient(rgb(57, 138, 151), rgb(33, 83, 102))',
    'linear-gradient(rgb(89, 184, 188), rgb(57, 138, 151))',
    'linear-gradient(rgb(146, 205, 188), rgb(89, 184, 188))',
    'linear-gradient(rgb(203, 225, 188), rgb(146, 205, 188))',
    'linear-gradient(rgb(241, 237, 179), rgb(203, 225, 188))',
    'linear-gradient(rgb(245, 234, 154), rgb(241, 237, 179))',
    'linear-gradient(rgb(250, 231, 128), rgb(245, 234, 154))',
    'linear-gradient(rgb(254, 228, 103), rgb(250, 231, 128))',
    'linear-gradient(rgb(250, 201, 97), rgb(254, 228, 103))',
    'linear-gradient(rgb(246, 175, 90), rgb(250, 201, 97))',
    'linear-gradient(rgb(241, 149, 84), rgb(246, 175, 90))',
    'linear-gradient(rgb(202, 118, 94), rgb(241, 149, 84))',
    'linear-gradient(rgb(152, 87, 110), rgb(202, 118, 94))',
    'linear-gradient(rgb(101, 56, 126), rgb(152, 87, 110))',
    'linear-gradient(rgb(69, 36, 108), rgb(101, 56, 126))',
    'linear-gradient(rgb(43, 19, 79), rgb(69, 36, 108))',
    'linear-gradient(rgb(16, 2, 51), rgb(43, 19, 79))',
    'linear-gradient(rgb(12, 6, 43), rgb(16, 2, 51))',
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

// Convert a `Date` to ['HH', 'mm'] in the specific timezone
function dateToTimeStr(date: Date, tz: string): string[] {
    const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',

    }).format(date);
    return timeStr.split(':');
}

// Convert a `Date` to 'Mon 28', 'Fri 1', etc. in the specific timezone
function dateToDayStr(date: Date, tz: string): string {
    const dayStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        weekday: 'short',
        day: 'numeric',
    }).format(date);
    return dayStr;
}

// Get the hour as a number between 0 and 23
function dateToHours(date: Date, tz: string): number {
    const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        hourCycle: 'h23',
    }).format(date);

    return parseInt(dateStr);
}

// Get the hour difference vs local time as '-8', '+5.5', '0', etc.
function getHourDiff(date: Date, tz: string): string {
    // Hours and minutes in local time
    const localTotalMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getTimezoneOffset();

    // Hours and minutes in target timezone
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: tz }));
    const tzTotalMinutes = tzDate.getUTCHours() * 60 + tzDate.getUTCMinutes() + tzDate.getTimezoneOffset();

    // Compute the difference in minutes
    let differenceInMinutes = tzTotalMinutes - localTotalMinutes;

    // Adjust for day overlap
    if (differenceInMinutes > 720) differenceInMinutes -= 1440; // 720 minutes = 12 hours, 1440 minutes = 24 hours
    if (differenceInMinutes < -720) differenceInMinutes += 1440;

    // Convert difference to hours with possible decimal for half-hours
    const diff = differenceInMinutes / 60;

    return (diff >= 0 ? '+' : '') + diff;
}
