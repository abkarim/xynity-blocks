<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class DB
{
    /**
     * Current database management version
     * to update table in database
     * we use this version
     */
    private static $_database_version = "0.1.0";

    /**
     * Options used in this entire plugin
     * to store and manage data
     */
    private static $_options_list = [
        XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_image_upload_types",
    ];

    /**
     * Checks current database version in this code
     * with current database version in online database
     */
    private static function should_tables_need_to_update()
    {
        $current_online_database_version = get_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
            null
        );

        /**
         * Table not version not found
         * this means tables not created
         */
        if ($current_online_database_version === null) {
            return true;
        }

        /**
         * Compare local version with online version
         */
        if (self::$_database_version !== $current_online_database_version) {
            return true;
        }

        return false;
    }

    /**
     * Updates or create table if necessary
     * It should only check on update and activation
     *
     * @access public
     * @since 0.1.4
     */
    public static function update_tables_if_necessary()
    {
        if (!self::should_tables_need_to_update()) {
            return;
        }

        /**
         * Update and create tables
         */
        self::create_tables();
    }

    /**
     * Get charset collate
     *
     * @return string
     * @access private
     * @since 0.1.4
     */
    private static function get_charset_collate()
    {
        global $wpdb;
        return $wpdb->get_charset_collate();
    }

    /**
     * Create tables
     *
     * @since 0.1.14
     * @access private
     */
    private static function create_tables()
    {
        /**
         * Include essential file
         */
        require_once ABSPATH . "wp-admin/includes/upgrade.php";

        /**
         * Set database version to current version
         */
        update_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
            self::$_database_version
        );
    }

    /**
     * Delete databases
     *
     * @since 0.1.4
     * @access private
     */
    private static function delete_database_tables()
    {
        global $wpdb;
        $table_names = [];
        $sql = "DROP TABLE IF EXISTS " . join($table_names);
        // $wpdb->query($sql);
    }

    /**
     * Clear all data
     *
     * @since 0.1.4
     * @access public
     */
    public static function clear_all_data()
    {
        /**
         * Delete options
         */
        foreach (self::$_options_list as $option) {
            delete_option($option);
        }

        /**
         * Delete databases
         */
        self::delete_database_tables();
    }
}
