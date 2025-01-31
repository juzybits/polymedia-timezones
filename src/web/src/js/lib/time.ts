/**
 * Utility functions for converting and comparing time and date values across different time zones.
 */

/**
 * Create a new `Date` object from a given `date`, but with a different timezone
 */
export function newDateInTimezone(date: Date, tz: string): Date {
    return new Date(
        date.toLocaleString('en-US', { timeZone: tz })
    );
}

/**
 * Sort timezones from earliest local time to latest local time (New York < Paris < Tokyo).
 *
 * Return a negative value if the first argument is less than the second argument,
 * zero if they're equal, and a positive value otherwise.
 */
export function compareTimezones(tzA: string, tzB: string): number {
    const localDate = new Date();
    const dateA = newDateInTimezone(localDate, tzA);
    const dateB = newDateInTimezone(localDate, tzB);
    return dateA.getTime() - dateB.getTime(); // sort in ascending order
}

/**
 * Get the difference in hours between two dates
 */
export function getHourDiff(dateA: Date, dateB: Date): number {
    // Hours and minutes in local time
    const minutesA = dateA.getUTCHours() * 60 + dateA.getUTCMinutes() + dateA.getTimezoneOffset();

    // Hours and minutes in target timezone
    const minutesB = dateB.getUTCHours() * 60 + dateB.getUTCMinutes() + dateB.getTimezoneOffset();

    // Compute the difference in minutes
    let diffInMinutes = minutesB - minutesA;

    // Adjust for day overlap
    if (diffInMinutes > 720) diffInMinutes -= 1440; // 720 minutes = 12 hours, 1440 minutes = 24 hours
    if (diffInMinutes < -720) diffInMinutes += 1440;

    // Convert difference to hours with possible decimal for half-hours
    const diff = diffInMinutes / 60;

    return diff;
}
