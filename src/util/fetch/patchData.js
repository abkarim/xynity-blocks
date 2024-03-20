/**
 * Post data to wordpress ajax
 *
 * @param {object} param0 - {queryString, action, data}
 * @returns {Promise}
 */
export default function patchData({
	queryString = "",
	action = "",
	data = {},
}) {
	return fetch(
		`${plugin_info_from_backend.ajax_url}?action=${encodeURIComponent(
			`xynity_blocks${action}`
		)}${queryString}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				"X-WP-Nonce": plugin_info_from_backend.ajax_nonce,
			},
			credentials: "same-origin",
			body: JSON.stringify(data),
		}
	);
}
