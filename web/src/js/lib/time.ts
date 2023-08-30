/**
 * Utility functions for converting and comparing time and date values across different time zones.
 */

/**
 * Convert a `Date` to ['HH', 'mm'] in the specific timezone
 */
export function dateToTime(date: Date, tz: string): string[] {
    const timeStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23',

    }).format(date);
    return timeStr.split(':');
}

/**
 * Convert a `Date` to 'Mon 28', 'Fri 1', etc. in the specific timezone
 */
export function dateToDay(date: Date, tz: string): string {
    const dayStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: tz,
        weekday: 'short',
        day: 'numeric',
    }).format(date);
    return dayStr;
}

/**
 * Get the hour as a number between 0 and 23
 */
export function dateToHours(date: Date, tz: string): number {
    const dateStr = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        hour: '2-digit',
        hourCycle: 'h23',
    }).format(date);

    return parseInt(dateStr);
}

/**
 * Get the hour difference vs local time as '-8', '+5.5', '0', etc.
 */
export function getHourDiff(date: Date, tz: string): string {
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

/**
 * Sort timezones from earliest local time to latest local time (New York < Paris < Tokyo).
 *
 * Return a negative value if the first argument is less than the second argument,
 * zero if they're equal, and a positive value otherwise.
 */
export function compareTimezones(a: string, b: string): number
{
    const now = new Date();
    const dateA = new Date(now.toLocaleString('en-US', { timeZone: a }));
    const dateB = new Date(now.toLocaleString('en-US', { timeZone: b }));
    return dateA.getTime() - dateB.getTime(); // sort in ascending order
}
