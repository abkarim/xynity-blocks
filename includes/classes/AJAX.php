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

        add_action("wp_ajax_xynity_blocks__color_options_update", [
            $this,
            "update_color_options",
        ]);

        add_action("wp_ajax_xynity_blocks__typography_options_update", [
            $this,
            "update_typography_options",
        ]);

        add_action("wp_ajax_xynity_blocks__shadow_options_update", [
            $this,
            "update_shadow_options",
        ]);

        add_action("wp_ajax_xynity_blocks__image_upload_options_update", [
            $this,
            "image_upload_options_update",
        ]);

        /**
         * Customization 
         * 
         * @since 0.2.4
         */
        add_action("wp_ajax_xynity_blocks__get_site_icon_url", [
            $this,
            "get_site_icon_url",
        ]);
        add_action("wp_ajax_xynity_blocks__update_site_icon", [
            $this,
            "update_site_icon",
        ]);
        add_action("wp_ajax_xynity_blocks__get_site_logo_url", [
            $this,
            "get_site_logo_url",
        ]);
        add_action("wp_ajax_xynity_blocks__update_site_logo", [
            $this,
            "update_site_logo",
        ]);
    }

    /**
     * Validate request
     *
     * @param string request_type
     * @since 0.1.0
     * @access protected
     */
    protected function block_incoming_request_if_invalid($request_type)
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
     * @access protected
     */
    protected function get_url_parameter()
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
     * @access protected
     */
    protected function get_request_data($request_type = "GET")
    {
        $this->block_incoming_request_if_invalid($request_type);

        $data = null;
        $decoded_data = null;

        if ($request_type === "GET") {
            $data = $this->get_url_parameter();
        } elseif ($request_type === "POST" || $request_type == "PATCH") {
            /**
             * Get data
             * @var string
             */
            $data = file_get_contents("php://input");

            /**
             * @var array
             */
            if (!($decoded_data = json_decode($data, true))) {

                /**
                 * If we got [] 
                 * we should return []
                 * without sending error message
                 */
                if ($data === "[]") {
                    return [$data, []];
                }

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
     * @access protected
     * @since 0.1.4
     */
    protected function send_response_and_close_request($data, $status_code = 200)
    {
        wp_send_json_success($data, $status_code);
        wp_die();
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
     * Update color options
     *
     * @return void
     * @since 0.2.0
     * @access public
     */
    public function update_color_options(): void
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        /**
         * Is updated successfully
         * @var bool
         */
        $is_updated = Color::update_color_options($decoded_data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Update typography options
     *
     * @return void
     * @since 0.2.0
     * @access public
     */
    public function update_typography_options(): void
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        /**
         * Is updated successfully
         * @var bool
         */
        $is_updated = Typography::update_typography_options($decoded_data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Update shadow options
     *
     * @return void
     * @since 0.2.0
     * @access public
     */
    public function update_shadow_options(): void
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        /**
         * Is updated successfully
         * @var bool
         */
        $is_updated = Shadow::update_shadow_options($decoded_data);

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

    /**
     * Update image upload options
     *
     * @return void
     * @since 0.2.4
     * @access public
     */
    public function image_upload_options_update(): void
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        /**
         * Is updated successfully
         * @var bool
         */
        $is_updated = Uploads::update_image_upload_types($decoded_data);

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Get site icon url
     * 
     * @access public
     * @since 0.2.4
     */
    public function get_site_icon_url()
    {
        $this->block_incoming_request_if_invalid("GET");

        $url = Customization::get_current_site_icon_url();

        $this->send_response_and_close_request($url);
    }

    /**
     * Update site icon
     * 
     * @access public
     * @since 0.2.4
     */
    public function update_site_icon()
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        $is_updated = Customization::update_site_icon($decoded_data['id']);

        $icon_url = Customization::get_current_site_icon_url();

        $this->send_response_and_close_request($icon_url);
    }

    /**
     * Get site logo url
     * 
     * @access public
     * @since 0.2.4
     */
    public function get_site_logo_url()
    {
        $this->block_incoming_request_if_invalid("GET");

        $url = Customization::get_current_site_logo_url();

        $this->send_response_and_close_request($url);
    }

    /**
     * Update site logo
     * 
     * @access public
     * @since 0.2.4
     */
    public function update_site_logo()
    {
        [$data, $decoded_data] = $this->get_request_data("POST");

        $is_updated = Customization::update_site_logo($decoded_data['id']);

        $logo_url = Customization::get_current_site_logo_url();

        $this->send_response_and_close_request($logo_url);
    }
}
