<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Blocks
{
    /**
     * Get block data for editor
     * returns block data with polyfill data
     *
     * @param string
     * @return object
     * @since 0.1.4
     * @access public
     */
    public static function get_block_data_for_editor($block_name)
    {
        $data = DB::get_block_settings($block_name);

        /**
         * Data not found in database
         */
        if ($data === null) {
            /**
             * Get data from theme.json
             */
            $theme_json_data = ThemeActions::get_block_style_settings(
                $block_name
            );
            $data = $theme_json_data;

            if ($theme_json_data === null) {
                $data = [];
            }
        } else {
            $data = json_decode($data, true);
        }

        return $data;
    }

    /**
     * Get block data from database
     * returns block data with
     *
     * @param string block_name
     * @return mixed array||null
     * @since 0.1.4
     * @access public
     */
    public static function get_block_data_from_database($block_name)
    {
        $data = DB::get_block_settings($block_name);
        if ($data !== null) {
            $data = json_decode($data, true);
        }
        return $data;
    }

    /**
     * Get edited blocks data
     * returns all blocks data that has been edited
     *
     * @return mixed array||null
     * @access public
     * @static
     * @since 0.1.4
     */
    public static function get_edited_blocks_data()
    {
        $data = DB::get_all_block_settings();

        if (is_null($data)) {
            return null;
        }
        $formattedData = [];

        foreach ($data as $value) {
            $formattedData[$value["block_name"]] = json_decode(
                $value["block_settings"],
                true
            );
        }

        return $formattedData;
    }

    /**
     * Update block colors
     *
     * @param string block_name
     * @param object colors
     * @return bool is updated
     * @static
     * @access public
     * @since 0.1.4
     */
    public static function update_block_colors($block_name, $colorsObject)
    {
        $colors = [];
        /**
         * Color has 3 elements
         * [text, background, link]
         *
         * we have to include only valid (non empty) data in settings
         */
        $text = Util::get_value_if_present_in_stdClass(
            $colorsObject,
            "text",
            null
        );
        $background = Util::get_value_if_present_in_stdClass(
            $colorsObject,
            "background",
            null
        );
        $link = Util::get_value_if_present_in_stdClass(
            $colorsObject,
            "link",
            null
        );

        /**
         * Include valid colors
         */
        if ($text !== null && trim($text) !== "") {
            $colors["text"] = $text;
        }
        if ($background !== null && trim($background) !== "") {
            $colors["background"] = $background;
        }
        if ($link !== null && trim($link) !== "") {
            $colors["link"] = $link;
        }

        /**
         * No valid colors found
         */
        if (count($colors) === 0) {
            return true;
        }

        /**
         * Get previous data from database
         */
        $previous_settings_array = self::get_block_data_from_database(
            $block_name
        );
        $result = false;

        if ($previous_settings_array === null) {
            $data = [
                "color" => $colors,
            ];
            $result = DB::insert_block_settings($block_name, $data);
        } else {
            $previous_settings_array["color"] = $colors;
            $result = DB::update_block_settings(
                $block_name,
                $previous_settings_array
            );
        }

        return filter_var($result, FILTER_VALIDATE_BOOLEAN);
    }
}
