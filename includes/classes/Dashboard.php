<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Dashboard
{
    /**
     * Constructor
     *
     * @since 0.1.0
     * @access public
     */
    public function __construct()
    {
        // Load files
        self::load_files();

        // Add menu
        add_action("admin_menu", [$this, "add_menu"]);

        // Load JavaScripts
        add_action("admin_enqueue_scripts", [$this, "load_javascript"]);
    }

    /**
     * Load classes file
     *
     * @return void
     * @access protected
     * @since 0.2.0
     */
    protected function load_files(): void
    {
        require_once XYNITY_BLOCKS_PATH . "includes/classes/ThemeJSON.php";
    }

    /**
     * Add menu in wordpress dashboard
     *
     * @since 0.1.0
     * @access public
     */
    public function add_menu()
    {
        /**
         * Add admin menu
         *
         * @since 0.1.0
         */
        add_menu_page(
            "Xynity Blocks",
            "Xynity Blocks",
            "manage_options",
            "xynity-blocks",
            [$this, "render_element_cb"],
            null,
            30
        );

        /**
         * Add Blocks submenu
         *
         * @since 0.1.0
         */
        add_submenu_page(
            "xynity-blocks",
            "Blocks",
            "Blocks",
            "manage_options",
            "xynity-blocks&path=blocks",
            [$this, "render_element_cb"]
        );

        /**
         * Add default css properties page
         * Read CSS property from theme.json and display it as editable
         * Apply changes
         *
         * @since 0.1.0
         */
        add_submenu_page(
            "xynity-blocks",
            "Settings",
            "Settings",
            "manage_options",
            "xynity-blocks&path=settings",
            [$this, "render_element_cb"]
        );
    }

    /**
     * Render element callback
     *
     * @since 0.1.0
     * @access public
     */
    public function render_element_cb()
    {
        ?>
            <main id="xynity-blocks-main-container"></main>
        <?php
    }

    /**
     * Load javascript
     *
     * Called by admin_enqueue_scripts from Constructor
     *
     * @since 0.1.0
     * @access public
     */
    public function load_javascript($hook)
    {
        wp_register_script(
            "xynity-blocks-admin-main",
            XYNITY_BLOCKS_URL . "/dashboard/index.js",
            ["wp-element"],
            defined("WP_DEBUG") ? false : XYNITY_BLOCKS_VERSION,
            true
        );

        /**
         * Loads when xynity's page accessed
         */
        if ("toplevel_page_xynity-blocks" === $hook) {
            wp_enqueue_script("xynity-blocks-admin-main");

            /**
             * Pass data to JavaScript to use in frontend
             *
             * @since 0.1.0
             */
            wp_localize_script(
                "xynity-blocks-admin-main",
                "plugin_info_from_backend",
                [
                    "plugin_version" => XYNITY_BLOCKS_VERSION,
                    "ajax_nonce" => wp_create_nonce(XYNITY_BLOCKS_NONCE),
                    "ajax_url" => admin_url("admin-ajax.php"),
                ]
            );
            wp_localize_script(
                "xynity-blocks-admin-main",
                "editor_options_from_backend",
                [
                    "default" => ThemeActions::get_default_editor_options(),
                    "current" => ThemeActions::get_current_editor_options(),
                ]
            );
            wp_localize_script(
                "xynity-blocks-admin-main",
                "colors_options_from_backend",
                [
                    "default" => ThemeActions::get_default_color_options(),
                    "current" => ThemeActions::get_current_color_options(),
                ]
            );
            wp_localize_script(
                "xynity-blocks-admin-main",
                "shadows_options_from_backend",
                [
                    "default" => ThemeActions::get_default_shadow_options(),
                    "current" => ThemeActions::get_current_shadow_options(),
                ]
            );
            wp_localize_script(
                "xynity-blocks-admin-main",
                "typography_options_from_backend",
                [
                    "default" => ThemeActions::get_default_typography_options(),
                    "current" => ThemeActions::get_current_typography_options(),
                ]
            );
        }
    }
}
