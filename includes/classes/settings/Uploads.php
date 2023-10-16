<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Uploads
{
    /**
     * Get current image upload types 
     *
     * @return array upload types
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function get_image_upload_types(): array
    {
        $upload_types = get_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_image_upload_types", []);
        return $upload_types;
    }

    /**
     * Update image upload types
     *
     * @param array data to replace
     * @return bool
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function update_image_upload_types($data): bool
    {
        $is_updated = update_option(XYNITY_BLOCKS_TEXT_DOMAIN . "_image_upload_types", $data);
        return $is_updated;
    }
}
