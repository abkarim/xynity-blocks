/**
 * Set cookie
 *
 * @param {string} name
 * @param {*} value
 * @param {number} days - default 500
 */
export default function setCookie(name, value = "", days = 500) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value};${expires}; path=/; samesite=strict`;
}
