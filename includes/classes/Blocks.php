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
     * Get block data
     * returns block data
     *
     * @param string
     * @return object
     * @since 0.1.4
     * @access public
     */
    public static function get_block_data($block_name)
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

            /**
             * Styles not exists in theme.json
             * Not every theme add styles fot every block
             * Now we had to generate our own data
             */
            if ($theme_json_data === null) {
                $data = ThemeActions::generate_block_style_settings();
            }
        }

        /**
         * Check if data contain in database
         */
        return $data;
    }

    /**
     * Get edited blocks data
     * returns all blocks data that has been edited
     *
     * @return array
     * @access public
     * @static
     * @since 0.1.4
     */
    public static function get_edited_blocks_data()
    {
        return null;
    }
}
