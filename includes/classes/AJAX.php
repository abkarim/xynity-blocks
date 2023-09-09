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
     * Constructor
     */
    public function __construct()
    {
        add_action("wp_ajax_xynity_blocks__editor_options_update", [
            $this,
            "update_editor_options",
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

        /**
         * Blocks settings
         *
         * @since 0.1.4
         */
        add_action("wp_ajax_xynity_blocks__get_block_data", [
            $this,
            "get_block_data",
        ]);
        add_action("wp_ajax_xynity_blocks__update_block_data", [
            $this,
            "update_block_data",
        ]);
    }

    /**
     * Validate request
     *
     * @param string request_type
     * @since 0.1.0
     * @access private
     */
    private function block_incoming_request_if_invalid($request_type)
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

        if ($request_type === "POST") {
            if ($_SERVER["REQUEST_METHOD"] !== "POST") {
                wp_send_json_error("method not allowed", 405);
                wp_die();
            }

            if (
                !isset($_SERVER["CONTENT_TYPE"]) ||
                $_SERVER["CONTENT_TYPE"] != "application/json"
            ) {
                wp_send_json_error(
                    "content type must be application/json",
                    400
                );
                wp_die();
            }
        }

        if ($request_type === "GET") {
            if ($_SERVER["REQUEST_METHOD"] !== "GET") {
                wp_send_json_error("method not allowed", 405);
                wp_die();
            }
        }
    }

    /**
     * Get URL parameter
     *
     * @return array - action excluded
     * @since 0.1.4
     * @access private
     */
    private function get_url_parameter()
    {
        // Get all parameter
        $data = $_GET;

        // Remove action parameter
        unset($data["action"]);

        return $data;
    }

    /**
     * Get request data
     * validate and returns data
     *
     * @param string request_type Default GET
     * @return array [$data, $decodedData]
     * @since 0.1.4
     * @access private
     */
    private function get_request_data($request_type = "GET")
    {
        $this->block_incoming_request_if_invalid($request_type);

        $data = null;
        $decoded_data = null;

        if ($request_type === "GET") {
            $data = $this->get_url_parameter();
        } elseif ($request_type === "POST") {
            /**
             * Get data
             * @var string
             */
            $data = file_get_contents("php://input");

            /**
             * @var array
             */
            if (!($decoded_data = json_decode($data, true))) {
                wp_send_json_error("data is not valid json", 400);
                return wp_die();
            }
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
        [$data, $decoded_data] = $this->get_request_data("POST");

        // Delete option
        delete_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_" . $decoded_data->name . "_option"
        );

        $this->send_response_and_close_request("reset successful");
    }

    /**
     * Update settings
     *
     * @return void
     * @since 0.2.0
     * @access public
     */
    public function update_editor_options(): void
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        /**
         * Is updated successfully
         * @var bool
         */
        $is_updated = Editor::update_editor_options($decoded_data);

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
        [$data] = $this->get_request_data("POST");

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
        [$data] = $this->get_request_data("POST");

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
        [$data] = $this->get_request_data("POST");

        // Update data
        update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option", $data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Get block data
     *
     * @access public
     * @since 0.1.4
     */
    public function get_block_data()
    {
        [$data] = $this->get_request_data();

        $block_data = Blocks::get_block_data_for_editor($data);

        $this->send_response_and_close_request($block_data);
    }

    /**
     * Get block data
     *
     * @access public
     * @since 0.1.4
     */
    public function update_block_data()
    {
        [$data, $decodedData] = $this->get_request_data("POST");

        $url_parameters = $this->get_url_parameter();

        $update_type = Util::get_value_if_present_in_array(
            $url_parameters,
            "update_type",
            null
        );

        $block_name = Util::get_value_if_present_in_array(
            $url_parameters,
            "block_name",
            null
        );

        /**
         * Check required data
         */
        if (is_null($update_type) || is_null($block_name)) {
            $this->send_response_and_close_request(
                "type & block_name is required",
                400
            );
        }

        $is_updated = Blocks::update_block_colors($block_name, $decodedData);

        if (!$is_updated) {
            $this->send_response_and_close_request(
                "something went wrong, please try again later!",
                500
            );
        }

        $this->send_response_and_close_request("updated successfully");
    }
}
