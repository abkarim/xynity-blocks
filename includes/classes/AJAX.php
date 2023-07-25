<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class AJAX
{
    /**
     * Validate request
     *
     * @return bool
     * @since 0.1.0
     * @access private
     */
    private function is_valid_request()
    {
        if (
            check_ajax_referer(XYNITY_BLOCKS_NONCE, "_ajax_nonce", false) !==
                false &&
            current_user_can("manage_options")
        ) {
            return true;
        }
        return false;
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action("wp_ajax_xynity_blocks_settings_update", [
            $this,
            "update_settings",
        ]);
    }

    /**
     * Update settings
     *
     * @since 0.1.0
     * @access public
     */
    public function update_settings()
    {
        if ($this->is_valid_request() === false) {
            wp_send_json_error("unauthorized request", 403);
            return wp_die();
        }

        // Get form data
        $json_data = isset($_POST["data"]) ? $_POST["data"] : null;

        // Decode and verify json data
        $data = json_decode($json_data, true);

        if ($data === false || $data === null) {
            wp_send_json_error("invalid json", 400);
            return wp_die();
        }

        // Update data
        update_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
            serialize($data)
        );

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }
}
