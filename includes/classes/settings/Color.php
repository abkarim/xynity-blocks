<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Color extends ThemeJSON
{
    /**
     * Get current color options
     *
     * @return array color options
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function get_current_color_options(): array
    {
        $theme_json_content = json_decode(self::get_theme_json_content(), true);

        $dataArray = $theme_json_content["settings"]["color"];

        return $dataArray;
    }

    /**
     * Update color options
     *
     * @param array data to update
     * @return bool
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function update_color_options($data): bool
    {
        $updated_data = self::merge_configuration_with_theme_json_data([
            "settings" => [
                "color" => $data,
            ],
        ]);

        /**
         * Replace current palette with old palette
         *
         * @since 0.2.0
         */
        $palette = Util::get_value_if_present_in_array($data, "palette", null);
        if (!is_null($palette)) {
            $updated_data["settings"]["color"]["palette"] = $palette;
        }

        /**
         * Replace current duotone with old duotone
         *
         * @since 0.2.5
         */
        $duotone = Util::get_value_if_present_in_array($data, "duotone", null);
        if (!is_null($palette)) {
            $updated_data["settings"]["color"]["duotone"] = $duotone;
        }

        return self::write_into_theme_json($updated_data);
    }
}
