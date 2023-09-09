<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Editor extends ThemeJSON
{
    /**
     * Get current editor options
     *
     * @return array editor options
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function get_current_editor_options(): array
    {
        $theme_json_content = json_decode(self::get_theme_json_content(), true);

        $dataArray = [
            "appearanceTools" =>
                $theme_json_content["settings"]["appearanceTools"],
            "layout" => $theme_json_content["settings"]["layout"],
            "spacing" => $theme_json_content["settings"]["spacing"],
        ];

        return $dataArray;
    }

    /**
     * Update editor options
     *
     * @param array data to update
     * @return bool
     * @access public
     * @since 0.2.0
     * @static
     */
    public static function update_editor_options($data): bool
    {
        $updated_data = self::merge_configuration_with_theme_json_data([
            "settings" => $data,
        ]);
        return self::write_into_theme_json($updated_data);
    }
}
