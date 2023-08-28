import { useEffect, useState } from 'react';
import '../css/App.less';

/*
TODO: let user select timezones
TODO: load/save config from local storage

TODO: show day below each time
TODO: show timezone name below each time
TODO: show hour difference vs local
TODO: color time columns
*/

export const App: React.FC = () =>
{
    const [timezones, _setTimezones] = useState<string[]>([
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo'
    ]);
    const [times, setTimes]= useState<string[]>([]);

    useEffect(() => {
        const now = new Date();
        const timeStrings = timezones.map(tz => dateToString(now, tz));
        setTimes(timeStrings);
    }, [timezones]);

    return <div id='layout'>
        <TimesWrap times={times} />
    </div>;
}

// Display each time in one vertical column
const TimesWrap: React.FC<{
    times: string[],
}> = ({
    times,
}) =>
{
    return <div id='times-wrap'>
    {
        times.map((time, index) => (
            <div key={index} className='times-column'>
                <span>{time}</span>
            </div>
        ))
    }
    </div>;
}

// Convert a `Date` to "HH:mm" in the specific timezone
function dateToString(date: Date, tz: string): string {
    const timeInTimeZone = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: tz,
        hour12: false,
    }).format(date);
    return timeInTimeZone;
}
