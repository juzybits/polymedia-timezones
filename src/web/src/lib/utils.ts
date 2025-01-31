/**
 * Miscellaneous utility functions
 */

/**
 * Get the flag emoji for a given country
 */
export function getFlagEmoji(countryCode: string): string {
    const codePoints = countryCode
        .toUpperCase()
        .split("")
        .map(char =>  127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

/**
 * Lowercase, remove accents, and transliterate. For example:
 * Łódź -> lodz
 * Miðvágur -> midvagur
 */
export function toLatinString(str: string): string {
    const clean = str
        .normalize("NFD")  // this will decompose accented characters into their components
        .replace(/[\u0300-\u036f]/g, "")  // remove decomposed characters (i.e., non-spacing or 'combining' characters)
        .toLowerCase()
        .replace("’", "'")
        .replace("‘", "'")
        .replace("ł", "l")
        .replace("ø", "o")
        .replace("æ", "ae")
        .replace("ð", "d")
        .replace("ħ", "h")
        .replace("ı", "i");
    return clean;
}
