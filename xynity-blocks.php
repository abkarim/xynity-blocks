<?php
/*
 * Plugin Name:       Xynity Blocks
 * Plugin URI:        https://github.com/abkarim/xynity-blocks
 * Description:       Extends wordpress blocks functionality to make better experience with Full Site Editing
 * Version:           0.2.7
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

use Xynity_Blocks\ThemeJSON;

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
             * @since 0.2.7
             */
            $this->define_constant_if_plugin_updated();

            // Load plugin file
            require_once XYNITY_BLOCKS_DIR . "includes/plugin.php";
            require_once XYNITY_BLOCKS_DIR . "includes/Blocks.php";
            require_once XYNITY_BLOCKS_DIR .
                "includes/classes/ThemeJSON.php";

            /**
             * Register plugin activation hook
             */
            register_activation_hook(XYNITY_BLOCKS_FILE, [
                $this,
                "handle_activation",
            ]);

            /**
             * Register plugin deactivation hook
             *
             * @since 0.2.1
             */
            register_deactivation_hook(XYNITY_BLOCKS_FILE, [
                $this,
                "handle_deactivation",
            ]);

            /**
             * Check compatibility and
             * manage options
             * when changing theme
             *
             * @since 0.2.0
             */
            add_action("switch_theme", [$this, "handle_theme_change"]);

            /**
             * It should be fire on theme update
             *
             * @since 0.2.0
             */
            add_action("after_switch_theme", [$this, "handle_theme_change"]);

            /**
             * Handle update 
             */
            add_action('admin_init', [$this, 'handle_update']);

            /**
             * Load plugin
             */
            add_action("plugins_loaded", [$this, "init"]);

            /**
             * Initialize plugin 
             * @since 0.2.6
             */
            add_action('init', [$this, "initialize"]);
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
             * require "get_plugin_data" function if not exists already
             */
            if (!function_exists("get_plugin_data")) {
                require_once ABSPATH . "wp-admin/includes/plugin.php";
            }

            /**
             * Get plugin data from header
             * @var array
             */
            $plugin_data = get_plugin_data(__FILE__);

            /**
             * Required php version for this plugin
             * @var string
             */
            define("XYNITY_BLOCKS_REQUIRED_PHP", $plugin_data["RequiresPHP"]);
            /**
             * Required wp version for this plugin
             * @var string
             */
            define("XYNITY_BLOCKS_REQUIRED_WP", $plugin_data["RequiresWP"]);
            /**
             * Current version
             * @var string
             */
            define("XYNITY_BLOCKS_VERSION", $plugin_data["Version"]);
            /**
             * Plugin textdomain
             * @var string
             */
            define("XYNITY_BLOCKS_TEXT_DOMAIN", $plugin_data["TextDomain"]);
            /**
             * Plugin name
             * @var string
             */
            define("XYNITY_BLOCKS_NAME", $plugin_data["Name"]);
            /**
             * Plugin's path from root
             * @var string
             */
            define(
                "XYNITY_BLOCKS_PATH",
                trailingslashit(plugin_dir_path(__FILE__))
            );
            /**
             * Plugin's url from root
             * @var string
             */
            define(
                "XYNITY_BLOCKS_URL",
                trailingslashit(plugin_dir_url(__FILE__))
            );
            /**
             * Plugin basename from root
             * @var string
             */
            define("XYNITY_BLOCKS_BASENAME", plugin_basename(__FILE__));
            /**
             * Plugin file from root
             * @var string
             */
            define("XYNITY_BLOCKS_FILE", __FILE__);
            /**
             * Plugin directory from root
             * @var string
             */
            define("XYNITY_BLOCKS_DIR", trailingslashit(__DIR__));
            /**
             * Plugin nonce
             * @var string
             */
            define(
                "XYNITY_BLOCKS_NONCE",
                "2abd9731S07S1b7e9f1DSD2f4E5912e523bc4c80255e3e"
            );
            /**
             * Plugin version option name
             * @var string
             * @since 0.2.7
             */
            define("XYNITY_BLOCKS_PLUGIN_VERSION_OPTION_NAME", XYNITY_BLOCKS_TEXT_DOMAIN . "_plugin_version");
        }

        /**
         * Detect if plugin is updated
         * and define updated constant
         * 
         * XYNITY_BLOCKS_PLUGIN_UPDATED
         * 
         * @since 0.2.7
         * @access private
         * @return void
         */
        private function define_constant_if_plugin_updated(): void
        {
            // Get plugin version from DB
            $plugin_version_on_db = get_option(XYNITY_BLOCKS_PLUGIN_VERSION_OPTION_NAME, null);

            // Add plugin version if not found
            if ($plugin_version_on_db === null) {
                update_option(XYNITY_BLOCKS_PLUGIN_VERSION_OPTION_NAME, XYNITY_BLOCKS_VERSION);

                // No version check required 
                return;
            }

            // Return if not updated
            if ($plugin_version_on_db === XYNITY_BLOCKS_VERSION) return;

            // Update plugin version on db to latest version
            update_option(XYNITY_BLOCKS_PLUGIN_VERSION_OPTION_NAME,  XYNITY_BLOCKS_VERSION);

            define("XYNITY_BLOCKS_PLUGIN_UPDATED", true);
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
         * Init 
         * 
         * called by init hook
         * 
         * @access public 
         * @since 0.2.6
         * @return void
         */
        public function initialize(): void
        {
            // Initiate blocks
            new \Xynity_Blocks\Blocks();
        }

        /**
         * Handle update
         * 
         * @access public
         * @since 0.2.5
         * @return void
         */
        public function handle_update(): void
        {
            /**
             * Is config required
             */
            if (!ThemeJSON::is_backup_content_theme_version_and_current_theme_version_same()) {
                $this->handle_activation();
            }
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
                \Xynity_Blocks\ThemeJSON::replace_theme_json_file_in_theme();

                /**
                 * Manage database configuration
                 *
                 * @since 0.1.4
                 */
                require_once XYNITY_BLOCKS_DIR . "includes/classes/DB.php";
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

        /**
         * Handle deactivation
         * Performs necessary operation on plugin deactivation
         *
         * @return void
         * @access public
         * @since 0.2.1
         */
        public function handle_deactivation(): void
        {
            /**
             * Manage theme.json content
             * remove xynity's theme.json
             * and rename default.theme.json to theme.json
             */
            require_once XYNITY_BLOCKS_DIR . "includes/classes/ThemeJSON.php";
            \Xynity_Blocks\ThemeJSON::migrate_to_default_theme_json();
        }

        /**
         * Handle theme switch
         *
         * Called by switch_theme hook
         *
         * @param string new_theme
         * @return void
         * @access public
         * @since 0.2.0
         */
        public function handle_theme_change(string $new_theme): void
        {
            try {
                $this->is_compatible();

                /**
                 * Manage theme.json content
                 *
                 * @since 0.2.0
                 */
                require_once XYNITY_BLOCKS_DIR .
                    "includes/classes/ThemeJSON.php";
                \Xynity_Blocks\ThemeJSON::replace_theme_json_file_in_theme();
            } catch (Exception $e) {
                \Xynity_Blocks\Plugin::show_admin_error_message(
                    $e->getMessage()
                );
            }
        }
    }

    new Xynity_Blocks();
}
