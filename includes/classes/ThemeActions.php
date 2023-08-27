<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class ThemeActions
{
    static $theme_json_data = null;
    private static $editors_current_data = null;
    private static $colors_current_data = null;
    private static $shadows_current_data = null;
    private static $typography_current_data = null;
    private static $blocks_edited_data = null;

    /**
     * Constructor
     *
     * @since 0.1.0
     */
    public function __construct()
    {
        $this->fetch_data_from_database();

        if ($this->should_update_theme_json_data()) {
            add_filter("wp_theme_json_data_theme", [
                $this,
                "update_theme_json_data",
            ]);
        }
    }

    /**
     * Get Theme.json data
     *
     * Called by filter hook
     *
     * @since 0.1.0
     * @access public
     */
    public static function update_theme_json_data($theme_json)
    {
        $modifiedData = [
            "version" => 2,
            "settings" => [],
            "styles" => [
                "blocks" => [],
            ],
        ];

        // Update editor settings data
        if (self::$editors_current_data !== null) {
            $decodedData = json_decode(self::$editors_current_data, true);
            $editor_settings = [
                "layout" => $decodedData["layout"],
                "spacing" => $decodedData["spacing"],
            ];

            $modifiedData["settings"] = array_merge_recursive(
                $modifiedData["settings"],
                $editor_settings
            );
        }

        // Update colors data
        if (self::$colors_current_data !== null) {
            $colors = [
                "color" => json_decode(self::$colors_current_data, true),
            ];

            $modifiedData["settings"] = array_merge_recursive(
                $modifiedData["settings"],
                $colors
            );
        }

        // Update shadows data
        if (self::$shadows_current_data !== null) {
            $shadows = [
                "shadow" => json_decode(self::$shadows_current_data, true),
            ];

            $modifiedData["settings"] = array_merge_recursive(
                $modifiedData["settings"],
                $shadows
            );
        }

        // Update typography data
        if (self::$typography_current_data !== null) {
            $typography = [
                "typography" => json_decode(
                    self::$typography_current_data,
                    true
                ),
            ];

            $modifiedData["settings"] = array_merge_recursive(
                $modifiedData["settings"],
                $typography
            );
        }

        /**
         * Update blocks style data
         *
         * @since 0.1.4
         */
        if (self::$blocks_edited_data !== null) {
            $modifiedData["styles"]["blocks"] = self::$blocks_edited_data;
        }

        return $theme_json->update_with($modifiedData);
    }

    /**
     * Load active theme's theme.json file
     * and returns it
     *
     * @return object
     * @since 0.1.0
     * @access public
     */
    public static function get_theme_json_file_data()
    {
        if (self::$theme_json_data !== null) {
            return self::$theme_json_data;
        }

        // Get the path to the active theme's directory
        $theme_directory = get_stylesheet_directory();

        $file_path = $theme_directory . "/theme.json";

        // Check if the file exists
        if (file_exists($file_path)) {
            // Read the file contents
            $file_contents = file_get_contents($file_path);

            self::$theme_json_data = json_decode($file_contents);
            return self::$theme_json_data;
        }
    }

    /**
     * Get editor options from Theme.json data
     * Returns array with editor options theme.json data
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_default_editor_options()
    {
        $data = self::get_theme_json_file_data();
        $dataArray = [
            "appearanceTools" => Util::get_value_if_present_in_stdClass(
                $data->settings,
                "appearanceTools",
                true
            ),
            "layout" => [
                "wideSize" => $data->settings->layout->wideSize,
                "contentSize" => $data->settings->layout->contentSize,
                "allowEditing" => Util::get_value_if_present_in_stdClass(
                    $data->settings->layout,
                    "allowEditing",
                    true
                ),
            ],
            "spacing" => [
                "spacingScale" => $data->settings->spacing->spacingScale,
                "units" => $data->settings->spacing->units,
                "spacingSizes" => $data->settings->spacing->spacingSizes,
                "customSpacingSize" => Util::get_value_if_present_in_stdClass(
                    $data->settings->spacing,
                    "customSpacingSize",
                    true
                ),
                "margin" => Util::get_value_if_present_in_stdClass(
                    $data->settings->spacing,
                    "margin",
                    true
                ),
                "padding" => Util::get_value_if_present_in_stdClass(
                    $data->settings->spacing,
                    "padding",
                    true
                ),
            ],
        ];

        return $dataArray;
    }

    /**
     * Get current editor options from Theme.json data
     * Returns array with editor options from database
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_current_editor_options()
    {
        self::fetch_data_from_database();

        if (
            self::$editors_current_data !== null &&
            !empty(self::$editors_current_data)
        ) {
            return json_decode(self::$editors_current_data);
        }

        return self::get_default_editor_options();
    }

    /**
     * Get color options from Theme.json data
     * Returns array with color options theme.json data
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_default_color_options()
    {
        $data = self::get_theme_json_file_data();
        $dataArray = [
            "background" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "background",
                true
            ),
            "link" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "link",
                true
            ),
            "text" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "text",
                true
            ),
            "palette" => $data->settings->color->palette,
            "custom" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "custom",
                true
            ),
            "customGradient" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "customGradient",
                true
            ),
            "customDuotone" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "customDuotone",
                true
            ),
            "defaultGradients" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "defaultGradients",
                true
            ),
            "defaultPalette" => Util::get_value_if_present_in_stdClass(
                $data->settings->color,
                "defaultPalette",
                true
            ),
        ];

        return $dataArray;
    }

    /**
     * Get current color options from Theme.json data
     * Returns array with color options from database
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_current_color_options()
    {
        self::fetch_data_from_database();

        if (
            self::$colors_current_data !== null &&
            !empty(self::$colors_current_data)
        ) {
            return json_decode(self::$colors_current_data);
        }

        return self::get_default_color_options();
    }

    /**
     * Get typography options from Theme.json data
     * Returns array with typography options theme.json data
     *
     * @return array
     * @since 0.1.3
     * @access public
     */
    public static function get_default_typography_options()
    {
        $data = self::get_theme_json_file_data();
        $dataArray = [
            "customFontSize" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "customFontSize",
                true
            ),
            "fontStyle" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "fontStyle",
                true
            ),
            "fontWeight" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "fontWeight",
                true
            ),
            "fluid" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "fluid",
                false
            ),
            "letterSpacing" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "letterSpacing",
                true
            ),
            "lineHeight" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "lineHeight",
                false
            ),
            "textColumns" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "textColumns",
                false
            ),
            "textDecoration" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "textDecoration",
                true
            ),
            "writingMode" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "writingMode",
                false
            ),
            "textTransform" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "textTransform",
                true
            ),
            "dropCap" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "dropCap",
                true
            ),
            "fontSizes" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "fontSizes",
                []
            ),
            "fontFamilies" => Util::get_value_if_present_in_stdClass(
                $data->settings->typography,
                "fontFamilies",
                []
            ),
        ];

        return $dataArray;
    }

    /**
     * Get current typography options from Theme.json data
     * Returns array with typography options from database
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_current_typography_options()
    {
        self::fetch_data_from_database();

        if (
            self::$typography_current_data !== null &&
            !empty(self::$typography_current_data)
        ) {
            return json_decode(self::$typography_current_data);
        }

        return self::get_default_typography_options();
    }

    /**
     * Get shadow options from Theme.json data
     * Returns array with shadow options theme.json data
     *
     * @return array
     * @since 0.1.2
     * @access public
     */
    public static function get_default_shadow_options()
    {
        $data = self::get_theme_json_file_data();
        $dataArray = [
            "defaultPresets" => true,
            "presets" => [],
        ];

        if (isset($data->settings->shadow)) {
            $dataArray[
                "defaultPresets"
            ] = Util::get_value_if_present_in_stdClass(
                $data->settings->shadow,
                "defaultPresets",
                true
            );

            $dataArray["presets"] = Util::get_value_if_present_in_stdClass(
                $data->settings->shadow,
                "presets",
                []
            );
        }

        return $dataArray;
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
        self::fetch_data_from_database();

        if (
            self::$shadows_current_data !== null &&
            !empty(self::$shadows_current_data)
        ) {
            return json_decode(self::$shadows_current_data);
        }

        return self::get_default_shadow_options();
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

    /**
     * Fetch data from database
     *
     * @since 0.1.0
     * @access private
     */
    private static function fetch_data_from_database()
    {
        /**
         * Settings
         */
        self::$editors_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
            null
        );
        self::$colors_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option",
            null
        );
        self::$shadows_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_shadows_option",
            null
        );
        self::$typography_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option",
            null
        );

        /**
         * Block settings
         */
        self::$blocks_edited_data = Blocks::get_edited_blocks_data();
    }

    /**
     * Should update theme.json data
     *
     * Returns true if user did any changes
     * in default theme.json data
     *
     * @return bool
     * @since 0.1.0
     * @access private
     */
    private function should_update_theme_json_data()
    {
        if (
            self::$colors_current_data !== null ||
            self::$shadows_current_data !== null ||
            self::$typography_current_data !== null ||
            self::$editors_current_data !== null ||
            self::$blocks_edited_data !== null
        ) {
            return true;
        }

        return false;
    }
}
