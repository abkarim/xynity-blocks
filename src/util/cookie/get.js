/**
 * Get cookie
 *
 * @param {string} name
 * @returns {string | undefined} value
 */
export default function getCookie(name) {
    let cookie = {};
    document.cookie.split(";").forEach(function (el) {
        let [key, value] = el.split("=");
        cookie[key.trim()] = value;
    });
    return cookie[name];
}
