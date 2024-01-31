<?php

namespace Xynity_Blocks;

use Xynity_Blocks;

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
    private static $_database_version = "0.1.1";

    /**
     * Options used in this entire plugin
     * to store and manage data
     */
    private static $_options_list = [
        XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_image_upload_types",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_activated_blocks",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_deactivated_blocks",
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

        self::create_custom_files_table();

        /**
         * Set database version to current version
         */
        update_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
            self::$_database_version
        );
    }

    /**
     * Get custom css & js table name
     * 
     * @return string table_name
     * @since 0.2.4
     * @access public
     * @static
     */
    public static function get_custom_files_table_name(): string
    {
        global $wpdb;
        $table_name = "xynity_blocks__custom_files";
        return $wpdb->prefix . $table_name;
    }


    /**
     * Create custom css & js table
     * 
     * @since 0.2.4
     * @access private
     * @static
     */
    private static function create_custom_files_table()
    {
        $table_name = self::get_custom_files_table_name();
        $charset_collate = self::get_charset_collate();

        /**
         * Create table sql
         */
        $sql = "CREATE TABLE $table_name (
                id MEDIUMINT(9) NOT NULL AUTO_INCREMENT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
                file_name VARCHAR(500) NOT NULL,
                file_slug VARCHAR(500) NOT NULL,
                file_type VARCHAR(10) NOT NULL,
                file_status VARCHAR(20) NOT NULL DEFAULT 'draft',
                load_on_frontend TINYINT(1) NOT NULL DEFAULT 1,
                load_on_admin TINYINT(1) NOT NULL DEFAULT 0,
                load_in_footer TINYINT(1) NOT NULL DEFAULT 1,
                file_version VARCHAR(500) NOT NULL DEFAULT 0, 
                PRIMARY KEY (id)
            ) $charset_collate";

        /**
         * Execute sql
         */
        dbDelta($sql);
    }

    /**
     * Get all results from database table
     * 
     * @param string table_name
     * @param array where [table => value]
     * @return array data
     * @since 0.2.4
     * @access public
     * @static
     */
    public static function get_all_results(string $table_name, array $where = []): array
    {
        global $wpdb;

        /**
         * Prepare condition
         * 
         * @var string
         */
        $condition = "";
        $index = 0;
        foreach ($where as $key => $value) {
            if ($index > 0) {
                $condition .= "AND ";
            }

            $condition .= "$key = '$value' ";
            $index += 1;
        }

        $sql = "SELECT * FROM {$table_name} ";
        if (!empty($condition)) {
            $sql .= " WHERE $condition ";
        }

        $results = $wpdb->get_results($sql);
        return $results;
    }

    /**
     * Get single result 
     * 
     * @param string tablename
     * @param array where [column => value]
     * @return array
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function get_result(string $tablename, array $where): array
    {
        global $wpdb;

        /**
         * Prepare condition
         * 
         * @var string
         */
        $condition = "";
        $index = 0;
        foreach ($where as $key => $value) {
            if ($index > 0) {
                $condition .= "AND ";
            }

            $condition .= "$key = $value ";
            $index += 1;
        }

        $result = $wpdb->get_row(
            "SELECT * FROM $tablename WHERE $condition"
        );

        if ($result) return json_decode(json_encode($result), true);;

        return [];
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
        $wpdb->query($sql);
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
