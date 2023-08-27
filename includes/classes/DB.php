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
        XYNITY_BLOCKS_TEXT_DOMAIN . "_typography_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_shadows_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_colors_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_settings_option",
        XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
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

        self::create_blocks_settings_table();

        /**
         * Set database version to current version
         */
        update_option(
            XYNITY_BLOCKS_TEXT_DOMAIN . "_database_version",
            self::$_database_version
        );
    }

    /**
     * Get blocks settings table name
     * Returns blocks settings table name with prefix
     *
     * @return string
     * @access private
     * @since 0.1.4
     */
    private static function get_blocks_settings_table_name()
    {
        global $wpdb;
        $table_name = "xynity_blocks__blocks_settings";
        return $wpdb->prefix . $table_name;
    }

    /**
     * Create blocks settings table in database
     * manage blocks default options
     * in this table
     *
     * @since 0.1.4
     * @access private
     */
    private static function create_blocks_settings_table()
    {
        $table_name = self::get_blocks_settings_table_name();
        $charset_collate = self::get_charset_collate();

        /**
         * Create table sql
         */
        $sql = "CREATE TABLE $table_name (
                id  mediumint(9) NOT NULL AUTO_INCREMENT,
                updated_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                block_name VARCHAR(500) NOT NULL UNIQUE,
                block_settings LONGTEXT NULL,
                PRIMARY KEY (id)
            ) $charset_collate";

        /**
         * Execute sql
         */
        dbDelta($sql);
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
        $table_names = [self::get_blocks_settings_table_name()];
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

    /**
     * Get block settings
     *
     * @param string block_name eg: core/paragraph
     * @return mixed available data or null
     * @access public
     * @since 0.1.4
     */
    public static function get_block_settings($name)
    {
        global $wpdb;
        $table_name = self::get_blocks_settings_table_name();

        $sql = "SELECT block_settings FROM $table_name WHERE block_name=%s";

        // Execute query
        $data = $wpdb->get_row($wpdb->prepare($sql, $name));

        if ($data) {
            return $data->block_settings;
        }

        return null;
    }

    /**
     * Get all block settings
     *
     * @param string block_name eg: core/paragraph
     * @return mixed available data or null
     * @access public
     * @since 0.1.4
     */
    public static function get_all_block_settings()
    {
        global $wpdb;
        $table_name = self::get_blocks_settings_table_name();

        $sql = "SELECT block_settings, block_name FROM $table_name";

        // Execute query
        $data = $wpdb->get_results($sql, ARRAY_A);

        if (count($data) !== 0) {
            return $data;
        }

        return null;
    }

    /**
     * Update block settings
     *
     * @param string block_name eg: core/paragraph
     * @param array block_settings
     * @return bool is_updated
     * @access public
     * @since 0.1.4
     */
    public static function update_block_settings($name, $data)
    {
        global $wpdb;
        $table_name = self::get_blocks_settings_table_name();

        $updated = $wpdb->update(
            $table_name,
            [
                "block_settings" => json_encode($data),
            ],
            [
                "block_name" => $name,
            ]
        );

        return $updated;
    }

    /**
     * Insert block settings
     *
     * @param string block_name eg: core/paragraph
     * @param array block_settings
     * @return int insert_id
     * @access public
     * @since 0.1.4
     */
    public static function insert_block_settings($name, $data)
    {
        global $wpdb;
        $table_name = self::get_blocks_settings_table_name();

        $id = $wpdb->insert($table_name, [
            "block_name" => $name,
            "block_settings" => json_encode($data),
        ]);

        return $id;
    }
}
