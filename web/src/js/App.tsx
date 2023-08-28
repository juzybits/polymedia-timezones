import { useEffect, useState } from 'react';
import '../css/App.less';

export const App: React.FC = () =>
{
    const [timezones, _setTimezones] = useState<string[]>([
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Tokyo'
    ]);
    const [times, setTimes]= useState<string[]>();

    useEffect(() => {
        const now = new Date();
        const timeStrings = timezones.map(tz => dateToString(now, tz));
        setTimes(timeStrings);
    }, [timezones]);

    return <div id='layout'>
        Times:
        <pre>
            {JSON.stringify(times, null, 2)}
        </pre>
    </div>;
}

// Display a `Date` as "HH:mm" in the specific timezone
function dateToString(date: Date, tz: string): string {
        const timeInTimeZone = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: tz,
            hour12: false,
        }).format(date);
        return timeInTimeZone;
}
