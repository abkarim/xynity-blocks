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
         * Add default css properties page
         * Read CSS property from theme.json and display it as editable
         * Apply changes
         *
         * @since 0.1.0
         */
        add_submenu_page(
            "xynity-blocks",
            "Default properties",
            "Default properties",
            "manage_options",
            "default-css-properties",
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
            XYNITY_BLOCKS_VERSION,
            true
        );

        wp_enqueue_script("xynity-blocks-admin-main");
    }
}
