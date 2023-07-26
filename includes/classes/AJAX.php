<?php
namespace Xynity_Blocks;

use JsonSerializable;

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

        // TODO json decode and serialized array

        // Update data
        update_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
            $json_data
        );

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }
}
