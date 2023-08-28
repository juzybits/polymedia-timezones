import '../css/Home.less';

export const Home: React.FC = () =>
{
    (function example()
    {
        const timezones = [
            'America/Los_Angeles',
            'Europe/London',
            'Asia/Tokyo'
        ];

        const localTime = new Date().toISOString();

        timezones.forEach(timezone => {
            // Convert the local time to the time in the specific timezone
            const timeInTimeZone = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timezone,
                hour12: false,
            }).format(new Date(localTime));

            console.log(`${timezone}: ${timeInTimeZone}`);
        });
    })();

    return (
        <div id='page' className='page-home'>
            <h1>Home.</h1>
            <div>
                Coming soon...
            </div>
        </div>
    );
}
