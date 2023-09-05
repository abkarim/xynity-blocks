<?php
/*
 * Plugin Name:       Xynity Blocks
 * Plugin URI:        https://github.com/abkarim/xynity-blocks
 * Description:       Extends wordpress blocks functionality to make better experience with Full Site Editing
 * Version:           0.2.0
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

if (!class_exists("Xynity_Blocks")) {
    class Xynity_Blocks
    {
        /**
         * Constructor
         */
        public function __construct()
        {
            $this->define_constants();

            /**
             * Register plugin activation hook
             */
            register_activation_hook(XYNITY_BLOCKS_FILE, [
                $this,
                "handle_activation",
            ]);

            /**
             * Load plugin
             */
            add_action("plugins_loaded", [$this, "init"]);
        }

        /**
         * Define constant
         * required in plugin
         *
         * @access private
         * @since 0.1.4
         */
        private function define_constants()
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
            define("XYNITY_BLOCKS_PATH", rtrim(plugin_dir_path(__FILE__), "/"));
            define("XYNITY_BLOCKS_URL", rtrim(plugin_dir_url(__FILE__), "/"));
            define("XYNITY_BLOCKS_BASENAME", plugin_basename(__FILE__));
            define("XYNITY_BLOCKS_FILE", __FILE__);
            define("XYNITY_BLOCKS_DIR", __DIR__);
            define(
                "XYNITY_BLOCKS_NONCE",
                "2abd9731S07S1b7e9f1DSD2f4E5912e523bc4c80255e3e"
            );
        }

        /**
         * Initialize plugin
         *
         * Called by plugins_loaded hook
         *
         * @access public
         * @since 0.1.4
         */
        public function init()
        {
            // Load plugin file
            require_once XYNITY_BLOCKS_DIR . "/includes/plugin.php";

            // Run the plugin
            \Xynity_Blocks\Plugin::instance();
        }

        /**
         * Activation configure
         * Performs necessary operation to configure files on activation
         *
         * Called by activation hook
         *
         * @since 0.1.4
         * @access public
         */
        public function handle_activation()
        {
            // Include database class file
            require_once XYNITY_BLOCKS_DIR . "/includes/classes/DB.php";

            /**
             * Manage database configuration
             *
             * @since 0.1.4
             */
            \Xynity_Blocks\DB::update_tables_if_necessary();
        }
    }

    new Xynity_Blocks();
}
