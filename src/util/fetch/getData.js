/**
 * Fetch data from wordpress ajax
 *
 * @param {object} param0 - { queryString, action}
 * @returns {Promise}
 */
export default function getData({ queryString = "", action = "" }) {
    return fetch(
        `${plugin_info_from_backend.ajax_url}?action=${encodeURIComponent(
            `xynity_blocks${action}`
        )}${queryString}`,
        {
            method: "GET",
            headers: {
                "X-WP-Nonce": plugin_info_from_backend.ajax_nonce,
            },
            credentials: "same-origin",
        }
    );
}
