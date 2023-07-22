<?php
/*
 * Plugin Name:       Xynity Blocks
 * Plugin URI:        https://github.com/abkarim/xynity-blocks
 * Description:       Extends wordpress blocks functionality to make better experience with Full Site Editing
 * Version:           0.1.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Karim
 * Author URI:        https://github.com/abkarim
 * License:           GPL-3.0 license
 * License URI:       https://www.gnu.org/licenses/gpl-3.0.en.html
 * Update URI:
 * Text Domain:       xynity-blocks
 * Domain Path:       /languages
 */

/**
 * !Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

if (!function_exists("xynity_blocks_init")) {
    /**
     * Initialize plugin
     */
    function xynity_blocks_init()
    {
        /**
         * Get plugin data defined in header
         */
        if (!function_exists("get_plugin_data")) {
            require_once ABSPATH . "wp-admin/includes/plugin.php";
        }
        $plugin_data = get_plugin_data(__FILE__);

        /**
         * Define essentials constant
         */
        define("XYNITY_BLOCKS_REQUIRED_PHP", $plugin_data["RequiresPHP"]);
        define("XYNITY_BLOCKS_REQUIRED_WP", $plugin_data["RequiresWP"]);
        define("XYNITY_BLOCKS_VERSION", $plugin_data["Version"]);
        define("XYNITY_BLOCKS_TEXT_DOMAIN", $plugin_data["TextDomain"]);
        define("XYNITY_BLOCKS_NAME", $plugin_data["Name"]);
        define("XYNITY_BLOCKS_PATH", plugin_dir_path(__FILE__));
        define("XYNITY_BLOCKS_URL", plugin_dir_url(__FILE__));

        // Load plugin file
        require_once __DIR__ . "/includes/plugin.php";

        // Run the plugin
        \Xynity_Blocks\Plugin::instance();
    }

    add_action("plugins_loaded", "xynity_blocks_init");
}
