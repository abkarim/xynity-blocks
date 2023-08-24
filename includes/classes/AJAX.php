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

        add_action("wp_ajax_xynity_blocks_reset_option", [
            $this,
            "reset_option",
        ]);
    }

    /**
     * Get request data
     * validate and returns data
     *
     * @return array [$data, $decodedData]
     * @since 0.1.4
     * @access private
     */
    private function get_request_data()
    {
        // Get form data
        $data = file_get_contents("php://input");

        $this->block_incoming_request_if_invalid();

        if (!($decoded_data = json_decode($data))) {
            wp_send_json_error("data is not valid json", 400);
            return wp_die();
        }

        return [$data, $decoded_data];
    }

    /**
     * Send response and close request
     *
     * @param mixed data
     * @param int status-code default 200
     * @return void
     * @access private
     * @since 0.1.4
     */
    private function send_response_and_close_request($data, $status_code = 200)
    {
        wp_send_json_success($data, $status_code);
        wp_die();
    }

    /**
     * Rest option
     *
     * @since 0.1.3
     * @access public
     */
    public function reset_option()
    {
        [$data, $decoded_data] = $this->get_request_data();

        // Delete option
        delete_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_" . $decoded_data->name . "_option"
        );

        $this->send_response_and_close_request("reset successful");
    }

    /**
     * Update settings
     *
     * @since 0.1.0
     * @access public
     */
    public function update_settings()
    {
        [$data] = $this->get_request_data();

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option", $data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Update colors
     *
     * @since 0.1.0
     * @access public
     */
    public function update_colors()
    {
        [$data] = $this->get_request_data();

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option", $data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Update shadows
     *
     * @since 0.1.2
     * @access public
     */
    public function update_shadows()
    {
        [$data] = $this->get_request_data();

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_shadows_option", $data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Update typography
     *
     * @since 0.1.3
     * @access public
     */
    public function update_typography()
    {
        [$data] = $this->get_request_data();

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option", $data);

        $this->send_response_and_close_request("updated successfully");
    }
}
