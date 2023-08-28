import { useState } from 'react';
import '../css/App.less';

/*
TODO: let user select timezones
TODO: load/save config from local storage
TODO: color time columns
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
    return (
        <div key={tz} className='column'>
            <div className='column-time'>{time}</div>
            <div className='column-day'>{day}</div>
            <div className='column-tz'>{tz}</div>
            <div className='column-diff'>{diff}</div>
        </div>
    );
}

// Convert a `Date` to "HH:mm" in the specific timezone
function dateToTimeStr(date: Date, tz: string): string {
    const timeStr = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: tz,
        hour12: false,
    }).format(date);
    return timeStr;
}

// Convert a `Date` to "Mon 28", "Fri 1", etc. in the specific timezone
function dateToDayStr(date: Date, tz: string): string {
    const dayStr = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        day: 'numeric',
        timeZone: tz
    }).format(date);
    return dayStr;
}

// Get the hour difference vs local time as "-8", "+5.5", "0", etc.
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
