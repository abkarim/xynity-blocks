<?php
/*
 * Plugin Name:       Xynity Blocks
 * Plugin URI:        https://github.com/abkarim/xynity-blocks
 * Description:       Extends wordpress blocks functionality to make better experience with Full Site Editing
 * Version:           0.2.0
 * Requires at least: 6.0
 * Requires PHP:      8.0
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

            // Load plugin file
            require_once __DIR__ . "/includes/plugin.php";

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
         * @return void
         */
        private function define_constants(): void
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
         * @return void
         */
        public function init(): void
        {
            // Run the plugin
            \Xynity_Blocks\Plugin::instance();
        }

        /**
         * Is compatible
         *
         * @since 0.2.0
         * @access private
         * @return void
         */
        private function is_compatible(): void
        {
            /**
             * Check php version
             */
            if (
                !version_compare(phpversion(), XYNITY_BLOCKS_REQUIRED_PHP, ">=")
            ) {
                throw new Exception(
                    "Minium php version required " .
                        XYNITY_BLOCKS_REQUIRED_PHP .
                        ", you have " .
                        phpversion()
                );
            }

            global $wp_version;

            /**
             * Check wp version
             */
            if (
                !version_compare($wp_version, XYNITY_BLOCKS_REQUIRED_WP, ">=")
            ) {
                throw new Exception(
                    "Minium WordPress version required " .
                        XYNITY_BLOCKS_REQUIRED_WP .
                        ", you have $wp_version"
                );
            }

            /**
             * This plugin is made for block theme
             * check if current theme is block based or not
             */
            if (!wp_is_block_theme()) {
                throw new Exception("Please use a block theme");
            }
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
            try {
                $this->is_compatible();

                /**
                 * Manage theme.json content
                 *
                 * @since 0.2.0
                 */
                require_once XYNITY_BLOCKS_DIR .
                    "/includes/classes/ThemeJSON.php";
                \Xynity_Blocks\ThemeJSON::replace_theme_json_file_in_theme();

                /**
                 * Manage database configuration
                 *
                 * @since 0.1.4
                 */
                require_once XYNITY_BLOCKS_DIR . "/includes/classes/DB.php";
                \Xynity_Blocks\DB::update_tables_if_necessary();
            } catch (Exception $e) {
                if (isset($_GET["activate"])) {
                    unset($_GET["activate"]);
                }

                // Deactivate the plugin
                deactivate_plugins(plugin_basename(__FILE__));

                // Display an error message
                wp_die($e->getMessage());
            }
        }
    }

    new Xynity_Blocks();
}
