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
        // Add menu
        add_action("admin_menu", [$this, "add_menu"]);

        // Load JavaScripts
        add_action("admin_enqueue_scripts", [$this, "load_javascript"]);
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
        }
    }
}
