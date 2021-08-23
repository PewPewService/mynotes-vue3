/**
 * Validates length of a string.
 * It should be more than 4 and less than 31 symbols.
 * @param {string} field
 * @returns Boolean
 */
 export function VerifyLength(field) {
    return (field.length > 4 && field.length < 31);
}