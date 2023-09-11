<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Shadow extends ThemeJSON
{
    /**
     * Get current shadow options
     *
     * @return array shadow options
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function get_current_shadow_options(): array
    {
        $theme_json_content = json_decode(self::get_theme_json_content(), true);

        $dataArray = $theme_json_content["settings"]["shadow"];

        return $dataArray;
    }

    /**
     * Update shadow options
     *
     * @param array data to update
     * @return bool
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function update_shadow_options($data): bool
    {
        $updated_data = self::merge_configuration_with_theme_json_data([
            "settings" => [
                "shadow" => $data,
            ],
        ]);

        /**
         * Replace current presets with old presets
         *
         * @since 0.2.0
         */
        $presets = Util::get_value_if_present_in_array($data, "presets", null);
        if (!is_null($presets)) {
            $updated_data["settings"]["shadow"]["presets"] = $presets;
        }

        return self::write_into_theme_json($updated_data);
    }
}
