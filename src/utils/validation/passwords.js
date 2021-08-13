import { VerifyLength } from "./length";
/**
 * Checks if passwords lenght is more that 4 and less than 31, 
 * also checks if passwords are identical
 * @param {string} password 
 * @param {string} passwordRepeat 
 * @returns Boolean
 */
export function VerifyPasswords(password, passwordRepeat){
    return (VerifyLength(password) && password === passwordRepeat);
}