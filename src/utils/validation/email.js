/**
 * Validates email.
 * @param {string} email 
 * @returns Boolean
 */

 export function VerifyEmail(email){
    const match = email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (match && match.length > 0) return true;
    else return false;
}