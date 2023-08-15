<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Blocks
{
    /**
     * Get all blocks
     *
     * @access public
     * @since 0.1.4
     * @static
     * @return array
     */
    public static function get_all_blocks()
    {
        $blocks_list = \WP_Block_Type_Registry::get_instance()->get_all_registered();

        return $blocks_list;
    }
}
