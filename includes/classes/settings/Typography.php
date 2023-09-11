<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Typography extends ThemeJSON
{
    /**
     * Get current typography options
     *
     * @return array typography options
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function get_current_typography_options(): array
    {
        $theme_json_content = json_decode(self::get_theme_json_content(), true);

        $dataArray = $theme_json_content["settings"]["typography"];

        return $dataArray;
    }

    /**
     * Update typography options
     *
     * @param array data to update
     * @return bool
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function update_typography_options($data): bool
    {
        $updated_data = self::merge_configuration_with_theme_json_data([
            "settings" => [
                "typography" => $data,
            ],
        ]);

        /**
         * Replace current font sizes with old font sizes
         *
         * @since 0.2.0
         */
        $font_sizes = Util::get_value_if_present_in_array(
            $data,
            "fontSizes",
            null
        );
        if (!is_null($font_sizes)) {
            $updated_data["settings"]["typography"]["fontSizes"] = $font_sizes;
        }

        /**
         * Replace current font families with old font families
         *
         * @since 0.2.0
         */
        $font_families = Util::get_value_if_present_in_array(
            $data,
            "fontFamilies",
            null
        );
        if (!is_null($font_families)) {
            $updated_data["settings"]["typography"][
                "fontFamilies"
            ] = $font_families;
        }

        return self::write_into_theme_json($updated_data);
    }
}
