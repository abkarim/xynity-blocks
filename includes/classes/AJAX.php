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
     * @param string
     * @since 0.1.0
     * @access private
     */
    private function block_incoming_request_if_invalid()
    {
        if (!isset($_SERVER["HTTP_X_WP_NONCE"])) {
            wp_send_json_error("unauthorized request", 403);
            return wp_die();
        }

        // Validate the nonce
        $nonce = $_SERVER["HTTP_X_WP_NONCE"];

        if (
            wp_verify_nonce($nonce, XYNITY_BLOCKS_NONCE) === false ||
            !current_user_can("manage_options")
        ) {
            wp_send_json_error("unauthorized request", 403);
            return wp_die();
        }

        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            wp_send_json_error("method not allowed", 405);
            wp_die();
        }

        if (
            !isset($_SERVER["CONTENT_TYPE"]) ||
            $_SERVER["CONTENT_TYPE"] != "application/json"
        ) {
            wp_send_json_error("content type must be application/json", 400);
            wp_die();
        }
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

        add_action("wp_ajax_xynity_blocks_colors_update", [
            $this,
            "update_colors",
        ]);

        add_action("wp_ajax_xynity_blocks_shadows_update", [
            $this,
            "update_shadows",
        ]);

        add_action("wp_ajax_xynity_blocks_typography_update", [
            $this,
            "update_typography",
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
        // Get form data
        $data = file_get_contents("php://input");

        $this->block_incoming_request_if_invalid();

        if (!($request_data = json_decode($data))) {
            wp_send_json_error("data is not valid json", 400);
            return wp_die();
        }

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option", $data);

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }

    /**
     * Update colors
     *
     * @since 0.1.0
     * @access public
     */
    public function update_colors()
    {
        // Get form data
        $data = file_get_contents("php://input");

        $this->block_incoming_request_if_invalid();

        if (!($request_data = json_decode($data))) {
            wp_send_json_error("data is not valid json", 400);
            return wp_die();
        }

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option", $data);

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }

    /**
     * Update shadows
     *
     * @since 0.1.2
     * @access public
     */
    public function update_shadows()
    {
        // Get form data
        $data = file_get_contents("php://input");

        $this->block_incoming_request_if_invalid();

        if (!($request_data = json_decode($data))) {
            wp_send_json_error("data is not valid json", 400);
            return wp_die();
        }

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_shadows_option", $data);

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }

    /**
     * Update typography
     *
     * @since 0.1.3
     * @access public
     */
    public function update_typography()
    {
        // Get form data
        $data = file_get_contents("php://input");

        $this->block_incoming_request_if_invalid();

        if (!($request_data = json_decode($data))) {
            wp_send_json_error("data is not valid json", 400);
            return wp_die();
        }

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option", $data);

        wp_send_json_success("updated successfully", 200);
        wp_die();
    }
}
