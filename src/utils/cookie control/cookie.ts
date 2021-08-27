/**
 * Checks if the cookie is set.
 * If it is, returns it.
 * @param {string} name
 * @returns string
 */
export function getCookie(name: string): string {
  const matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : "";
}

/**
 * Sets new cookie.
 * @param {string} name
 * @param {string} value
 */
export function setCookie(name: string, value: string): void {
  document.cookie = name + "=" + value;
}

/**
 * Deletes cookie.
 * @param {string} name
 */
export function delCookie(name: string): void {
  document.cookie = name + "=''; max-age=0";
}
