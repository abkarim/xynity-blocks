<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class DB
{
    private static $options_list = [
        XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_shadows_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
    ];

    /**
     * Remove all options
     *
     * @since 0.1.3
     * @access public
     */
    public static function remove_all_options()
    {
        foreach (self::$options_list as $option) {
            delete_option($option);
        }
    }
}
