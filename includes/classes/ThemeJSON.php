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
     * Get theme.json content
     *
     * @return string
     * @static
     * @since 0.2.0
     * @access protected
     */
    protected static function get_theme_json_content(): string
    {
        // Get the path to the active theme's directory
        $current_theme_directory = get_stylesheet_directory();
        $theme_json_file_content = file_get_contents(
            "$current_theme_directory/theme.json"
        );
        return $theme_json_file_content;
    }

    /**
     * Get initialization theme.json data
     * returns some default necessary data
     *
     * @return array
     * @access private
     * @static
     * @since 0.2.0
     */
    private static function get_initialization_theme_json_content(): array
    {
        $content = [
            "settings" => [],
            "styles" => [
                "blocks" => [],
            ],
        ];

        /**
         * Add usingThemeJsonFromXynity to
         * track xynity's content
         */
        $content["usingThemeJsonFromXynity"] = true;

        /**
         * Add a version
         */
        $content["xynityContentVersion"] = "1.0.0";

        /**
         * Enable appearance tools
         */
        $content["settings"]["appearanceTools"] = true;

        /**
         * Add layout configuration
         */
        $content["settings"]["layout"] = [
            "allowEditing" => true,
        ];

        /**
         * Add colors configuration
         */
        $content["settings"]["color"] = [
            "link" => true, // Enables link color
            "defaultGradients" => true, // Enables default gradients
            "defaultPalette" => true, // Enables default color palette
            "custom" => true, // Enables custom color add options
            "customGradient" => true, // Enables custom gradient add
            "customDuotone" => true, // Enables custom duotone add
        ];

        /**
         * Add borders configuration
         */
        $content["settings"]["border"] = [
            "color" => true, // Enable border color edit
        ];

        /**
         * Add spacing configuration
         */
        $content["settings"]["spacing"] = [
            "padding" => true, // Enable padding
            "margin" => true, // Enable margin
            "customSpacingSize" => true, // Enable custom spacing size
            "units" => ["px", "em", "rem", "vh", "vw", "%"], // Default units
            "spacingScale" => [
                "operator" => "*",
                "increment" => 1.5,
                "steps" => 7,
                "mediumStep" => 1.5,
                "unit" => "rem",
            ],
        ];

        /**
         * Add typography configuration
         */
        $content["settings"]["typography"] = [
            "dropCap" => true, // Enable dropCap
            "lineHeight" => true, // Enable line height
            "letterSpacing" => true, // Enable letter spacing
            "customFontSize" => true, // Enable custom font size
            "fontStyle" => true, // Enable font style
            "fontWeight" => true, // Enable font weight
            "textColumns" => true, // Enable text columns
            "textDecoration" => true, // Enable text decoration
            "textTransform" => true, // Enable text transform
            "writingMode" => true, // Enable writing mode
        ];

        /**
         * Add shadows configuration
         */
        $content["settings"]["shadow"] = [
            "defaultPresets" => true, // Enable default presets
        ];

        /**
         * Add positions configuration
         */
        $content["settings"]["position"] = [
            "sticky" => true, // Enable sticky position
        ];

        /**
         * Add dimensions configuration
         * @since WP-6.2
         */
        $content["settings"]["dimensions"] = [
            "minHeight" => true, // Enable minimum height
        ];

        return $content;
    }

    /**
     * Merge array1 with array2
     *
     * @param array array1
     * @param array array2
     * @return array merged array
     * @access protected
     * @since 0.2.0
     * @static
     */
    protected static function merge_array1_with_array2(
        array $array1,
        array $array2
    ): array {
        /**
         * Merge data
         */
        foreach ($array1 as $key => $value) {
            /**
             * Is current key exists in array2
             *
             * if doesn't exists
             * just add it
             */
            $current_value = Util::get_value_if_present_in_array(
                $array2,
                $key,
                null
            );
            if (is_null($current_value)) {
                $array2[$key] = $value;
                continue;
            }

            /**
             * if current value is not valid or is not an array
             * replace with replacement value
             */
            if (!boolval($current_value) || !is_array($current_value)) {
                $array2[$key] = $value;
                continue;
            }

            /**
             * Current value is array
             * so replacement value should be also an array
             * if not continue to next value
             */
            if (!is_array($value)) {
                continue;
            }

            /**
             * Repeat same steps for arrays
             */
            $array2[$key] = self::merge_array1_with_array2(
                $value,
                $current_value
            );
        }

        return $array2;
    }

    /**
     * Merge configuration with theme.json data
     *
     * @param array data_to_merge
     * @return array merged content
     * @access protected
     * @since 0.2.0
     * @static
     */
    protected static function merge_configuration_with_theme_json_data(
        array $data_to_merge
    ): array {
        $theme_json_file_content = json_decode(
            self::get_theme_json_content(),
            true
        );

        $theme_json_file_content = self::merge_array1_with_array2(
            $data_to_merge,
            $theme_json_file_content
        );

        return $theme_json_file_content;
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
        $theme_json_file_content = self::get_theme_json_content();

        /**
         *! Read file and see if we already did it
         * ex scenario: when will call this function twice
         * it shouldn't do this again
         *
         * We should have "usingThemeJsonFromXynity": true in newly created theme.json
         */
        $current_theme_json_file_data = json_decode(
            $theme_json_file_content,
            true
        );
        $is_using_theme_json_from_xynity = Util::get_value_if_present_in_array(
            $current_theme_json_file_data,
            "usingThemeJsonFromXynity",
            false
        );
        if ($is_using_theme_json_from_xynity === true) {
            return;
        }

        /**
         * Configure data
         */
        $configured_data = self::merge_configuration_with_theme_json_data(
            self::get_initialization_theme_json_content()
        );

        /**
         * Rename current theme theme.json
         */
        $is_rename_success = self::rename_themejson_file_to_defaultthemejson_in_theme();
        if (!$is_rename_success) {
            return;
        }

        /**
         * Encode array data to json
         */
        $content_to_write_in_theme_json_file = json_encode(
            $configured_data,
            JSON_PRETTY_PRINT
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
