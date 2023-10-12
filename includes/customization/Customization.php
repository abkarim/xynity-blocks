<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Customization
{
    /**
     * Get current site Icon
     *
     * @return string site Icon
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function get_current_site_icon_url(): string
    {
        $icon_url = get_site_icon_url();
        return $icon_url;
    }

    /**
     * Update current site icon
     * 
     * @param int id attachment id of image
     * @return bool is_updated
     * @since 0.2.4
     * @static
     */
    public static function update_site_icon(int $id): bool
    {
        $is_updated = update_option('site_icon', $id);
        return $is_updated;
    }

    /**
     * Get current site logo
     *
     * @return string site logo
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function get_current_site_logo_url(): string
    {
        $logo_id = get_option('site_logo', null);

        /**
         * Return empty string if no id found
         */
        if (is_null($logo_id)) {
            return "";
        }

        $logo_url = wp_get_attachment_image_url($logo_id);
        return $logo_url;
    }

    /**
     * Update current site logo
     * 
     * @param int id attachment id of image
     * @return bool is_updated
     * @since 0.2.4
     * @static
     */
    public static function update_site_logo(int $id): bool
    {
        $is_updated = update_option('site_logo', $id);
        return $is_updated;
    }
}
