<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class ThemeJSON
{
    private static $theme_json_data = null;
    private static $editors_current_data = null;
    private static $colors_current_data = null;
    private static $shadows_current_data = null;
    private static $typography_current_data = null;
    private static $blocks_edited_data = null;

    /**
     * Rename theme.json to default.theme.json
     *
     * @static
     * @access protected
     * @return bool is_renamed
     * @since 0.2.0
     */
    protected static function rename_themejson_file_to_defaultthemejson_in_theme(): bool
    {
        // Get the path to the active theme's directory
        $current_theme_directory = get_stylesheet_directory();

        /**
         * Rename current theme.json json file
         * to default.theme.json
         */
        $is_rename_success = @rename(
            "$current_theme_directory/theme.json",
            "$current_theme_directory/default.theme.json"
        );

        return $is_rename_success;
    }

    /**
     * Rename default.theme.json to theme.json
     *
     * @static
     * @access protected
     * @return bool is_renamed
     * @since 0.2.0
     */
    protected static function rename_defaultthemejson_file_to_themejson_in_theme(): bool
    {
        // Get the path to the active theme's directory
        $current_theme_directory = get_stylesheet_directory();

        /**
         * Rename current theme.json json file
         * to default.theme.json
         */
        $is_rename_success = @rename(
            "$current_theme_directory/default.theme.json",
            "$current_theme_directory/theme.json"
        );

        return $is_rename_success;
    }

    /**
     * Write into theme.json
     *
     * @param string content
     * @return bool is_write_success
     * @static
     * @access protected
     * @since 0.2.0
     */
    protected static function write_into_theme_json(string $content): bool
    {
        $current_theme_directory = get_stylesheet_directory();

        /**
         * Create & Open theme.json file to write
         */
        $new_theme_json_file = @fopen(
            "$current_theme_directory/theme.json",
            "w"
        );
        if ($new_theme_json_file === false) {
            return false;
        }

        /**
         * Write to file
         */
        $is_write_success = @fwrite($new_theme_json_file, $content);
        if ($is_write_success === false) {
            // Undo changes
            fclose($new_theme_json_file);
            return false;
        }

        // Close file
        fclose($new_theme_json_file);
        return true;
    }

    /**
     * Replace theme.json file in theme
     * with our theme.json
     *
     * Copies the theme.json file then and
     * adds necessary configuration
     *
     * It should call when plugin activated and
     * when current theme changed
     *
     * @static
     * @return void
     * @access public
     * @since 0.2.0
     */
    public static function replace_theme_json_file_in_theme(): void
    {
        // Get the path to the active theme's directory
        $current_theme_directory = get_stylesheet_directory();
        $theme_json_file_content = file_get_contents(
            "$current_theme_directory/theme.json"
        );

        /**
         *! Read file and see if we already did it
         * ex scenario: when will call this function twice
         * it shouldn't do this again
         *
         * We should have "using_theme_json_from_xynity: true" in newly created theme.json
         */
        $current_theme_json_file_data = json_decode(
            $theme_json_file_content,
            true
        );
        $is_using_theme_json_from_xynity = Util::get_value_if_present_in_array(
            $current_theme_json_file_data,
            "using_theme_json_from_xynity",
            false
        );
        if ($is_using_theme_json_from_xynity === true) {
            return;
        }

        $is_rename_success = self::rename_themejson_file_to_defaultthemejson_in_theme();
        if (!$is_rename_success) {
            return;
        }

        /**
         * Add using_theme_json_from_xynity in content
         * to detect file
         */
        $current_theme_json_file_data["using_theme_json_from_xynity"] = true;

        /**
         ** Append configuration data
         */

        /**
         * Encode array data to json
         */
        $content_to_write_in_theme_json_file = json_encode(
            $current_theme_json_file_data
        );

        /**
         * Write to file
         */
        $is_write_success = self::write_into_theme_json(
            $content_to_write_in_theme_json_file
        );

        if ($is_write_success === false) {
            // Undo changes
            self::rename_defaultthemejson_file_to_themejson_in_theme();
            return;
        }
    }

    /**
     * Get current editor options from Theme.json data
     *
     * @return array
     * @since 0.2.0
     * @access public
     * @static
     */
    public static function get_current_editor_options()
    {
    }

    /**
     * Get current color options from Theme.json data
     * Returns array with color options from database
     *
     * @return array
     * @since 0.2.0
     * @access public
     */
    public static function get_current_color_options()
    {
    }

    /**
     * Get current typography options from Theme.json data
     * Returns array with typography options from database
     *
     * @return array
     * @since 0.2.0
     * @access public
     */
    public static function get_current_typography_options()
    {
    }

    /**
     * Get current shadow options from Theme.json data
     * Returns array with shadow options from database
     *
     * @return array
     * @since 0.1.2
     * @access public
     */
    public static function get_current_shadow_options()
    {
    }

    /**
     * Get block settings from theme.json
     *
     * @param string block_name
     * @return mixed
     * @access public
     * @static
     * @since 0.1.4
     */
    public static function get_block_style_settings($block_name)
    {
        $theme_json_data = self::get_theme_json_file_data();

        /**
         * Blocks configuration live in
         * theme.json->styles->blocks->$block_name
         *
         * we had to go step by step with checking
         * cause not every theme include this
         */

        // Get styles data
        $styles_data = Util::get_value_if_present_in_stdClass(
            $theme_json_data,
            "styles",
            null
        );

        // Return null styles data not found
        if ($styles_data === null) {
            return null;
        }

        // Get blocks data from settings
        $blocks_data = Util::get_value_if_present_in_stdClass(
            $styles_data,
            "blocks",
            null
        );

        /**
         * check blocks data
         * return null if doesn't exits
         */
        if ($blocks_data === null) {
            return null;
        }

        // Get targeted block data
        $targeted_block_data = Util::get_value_if_present_in_stdClass(
            $blocks_data,
            $block_name,
            null
        );

        /**
         * Null will be returned if no data found
         */
        return $targeted_block_data;
    }
}
