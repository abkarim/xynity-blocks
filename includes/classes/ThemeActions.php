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
            "layout" => $data->settings->layout,
            "spacing" => $data->settings->spacing,
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
        /**
         * TODO
         *
         * Current data should not be fetched and returned directly
         * it should contain all data that included in default data
         */

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
            "palette" => $data->settings->color->palette,
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
    public static function get_current_color_options()
    {
        /**
         * TODO
         *
         * Current data should not be fetched and returned directly
         * it should contain all data that included in default data
         */

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
     * Fetch data from database
     *
     * @since 0.1.0
     * @access private
     */
    private static function fetch_data_from_database()
    {
        self::$editors_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
            null
        );
        self::$colors_current_data = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option",
            null
        );
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
            self::$editors_current_data !== null
        ) {
            return true;
        }

        return false;
    }
}
