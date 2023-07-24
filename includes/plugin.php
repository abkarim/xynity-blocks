<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

require_once XYNITY_BLOCKS_PATH . "includes/classes/Dashboard.php";
require_once XYNITY_BLOCKS_PATH . "includes/classes/ThemeActions.php";

final class Plugin
{
    private static $_instance = null;

    /**
     * Instance
     *
     * Ensures only one instance of the class is loaded or can be loaded.
     *
     * @since 0.1.0
     * @access public
     * @static
     * @return \Xynity_Blocks\Plugin An instance of the class.
     */
    public static function instance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self();
        }
        return self::$_instance;
    }

    /**
     * Constructor
     *
     * Perform some compatibility checks to make sure basic requirements are meet.
     * If all compatibility checks pass, initialize the functionality.
     *
     * @since 0.1.0
     * @access public
     */
    public function __construct()
    {
        if (!$this->is_compatible()) {
            /**
             * Don't activate the plugin
             */
            if (isset($_GET["activate"])) {
                unset($_GET["activate"]);
            }

            return;
        }

        $this->init();
    }

    /**
     * Compatibility Checks
     *
     * Checks whether the site meets the plugin requirement.
     *
     * @since 0.1.0
     * @access public
     */
    public function is_compatible()
    {
        //* All Ok
        return true;
    }

    /**
     * Admin error notice
     *
     * Show error on admin dashboard
     *
     * @since 0.1.0
     * @param string
     * @access public
     */
    public function show_admin_error_message($massage)
    {
        printf(
            '<div class="notice notice-warning is-dismissible"><p>%1$s</p></div>',
            $massage
        );
    }

    /**
     * Update plugin action links
     *
     * Called by filter hook from this->init function
     *
     * @param array
     * @since 0.1.0
     * @access public
     */
    public function update_plugin_action_links($links)
    {
        $url = get_admin_url() . "admin.php?page=xynity-blocks&path=settings";
        $settings_link =
            '<a href="' .
            $url .
            '">' .
            __("Settings", XYNITY_BLOCKS_TEXT_DOMAIN) .
            "</a>";
        // Add settings link as first link
        array_unshift($links, $settings_link);
        return $links;
    }

    /**
     * Initialize function
     *
     * @since 0.1.0
     * @access public
     */
    public function init()
    {
        // Update action links in plugin page
        add_filter("plugin_action_links_" . XYNITY_BLOCKS_BASENAME, [
            $this,
            "update_plugin_action_links",
        ]);

        // Handle menu options
        new Dashboard();
        // Handles Theme actions
        new ThemeActions();
    }
}
