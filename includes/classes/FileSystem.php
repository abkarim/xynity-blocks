<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class FileSystem
{

    /**
     * Plugin's content directory name
     * this directory will store
     * backup data, config data
     *
     * @var string
     * @static
     * @access protected
     * @since 0.2.4
     */
    private static $_xynity_blocks_content_folder_name = "xynity-blocks-content";

    /**
     * Create folder inside wp_content if not exists
     *
     * @param string folder_name
     * @param int permission - default 0755
     * @return bool
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function create_folder_inside_wp_content_is_not_exists(
        string $folder_name,
        int $permission = 0755
    ): bool {
        $new_folder_path = trailingslashit(WP_CONTENT_DIR) . $folder_name;

        /**
         * Is directory already exists
         */
        if (is_dir($new_folder_path)) {
            return true;
        }

        /**
         * Create new folder
         */
        $is_created = wp_mkdir_p($new_folder_path, $permission);

        return $is_created;
    }

    /**
     * Write into xynity's folder
     * 
     * @param string filename
     * @param string content
     * @return bool is_written
     * @access public
     * @static
     * @since 0.2.4
     */
    public static function write_into_xynity_folder(string $filename, string $content): bool
    {
        $file_path = trailingslashit(WP_CONTENT_DIR) . self::$_xynity_blocks_content_folder_name . '/' . $filename;

        /**
         * Validate directory
         */
        self::create_directory_if_not_exists(dirname($filename));

        /**
         * Create & Open file to write
         */
        $file = fopen($file_path, "w");
        if ($file === false) {
            return false;
        }

        /**
         * Write to file
         */
        $is_write_success = fwrite($file, $content);

        // Close file
        fclose($file);

        return $is_write_success;
    }

    /**
     * Delete from xynity's folder
     * 
     * @param string filename
     * @return bool is_deleted
     * @access public
     * @static
     * @since 0.2.4
     */
    public static function delete_from_xynity_folder(string $filename): bool
    {
        $file_path = trailingslashit(WP_CONTENT_DIR) . self::$_xynity_blocks_content_folder_name . '/' . $filename;

        if (!file_exists($file_path)) {
            return true;
        }

        return unlink($file_path);
    }

    /**
     * Write into file inside wp_content directory
     *
     * @param string file_name
     * @param string content
     * @return bool
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function write_into_file_inside_wp_content(
        string $file_name,
        string $content
    ): bool {
        $file_path = trailingslashit(WP_CONTENT_DIR) . $file_name;

        /**
         * Create & Open theme.json file to write
         */
        $file = @fopen($file_path, "w");
        if ($file === false) {
            return false;
        }

        /**
         * Write to file
         */
        $is_write_success = @fwrite($file, $content);
        if ($is_write_success === false) {
            // Undo changes
            fclose($file);
            return false;
        }

        // Close file
        fclose($file);
        return true;
    }

    /**
     * Get xynity blocks folder's url
     * 
     * @return string
     * @since 0.2.4
     * @access public
     * @static
     */
    public static function get_xynity_blocks_folder_url(): string
    {
        $path = content_url(self::$_xynity_blocks_content_folder_name);
        return $path;
    }

    /**
     * Create directory if not exists in xynity's content folder
     * 
     * @param string dirname
     * @return bool 
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function create_directory_if_not_exists(string $dirname): bool
    {
        $path = trailingslashit(WP_CONTENT_DIR) . self::$_xynity_blocks_content_folder_name . '/' . $dirname;

        /**
         * Clear cache
         */
        clearstatcache();

        if (file_exists($path)) {
            return true;
        }

        return mkdir($path, 0777, true);
    }

    /**
     * Read file
     * 
     * @param string path - file path to read
     * @return string content - empty string if path doesn't exists
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function read_file(string $path): string
    {
        $path = trailingslashit(WP_CONTENT_DIR) . self::$_xynity_blocks_content_folder_name . '/' . $path;

        /**
         * Clear cache
         */
        clearstatcache();

        if (!file_exists($path)) {
            return "";
        }

        $file_stream = fopen($path, 'r');

        $content = fread($file_stream, filesize($path));

        fclose($file_stream);

        return $content;
    }

    /**
     * Is file exists inside wp_content directory
     *
     * @param string file_name
     * @return bool
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function is_file_exists_inside_wp_content(
        string $file_name
    ): bool {
        $file_path = trailingslashit(WP_CONTENT_DIR) . $file_name;
        $is_exists = file_exists($file_path);
        return $is_exists;
    }

    /**
     * Read file inside wp_content directory
     *
     * @param string file_name
     * @return string|false
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function get_file_content_inside_wp_content(
        string $file_name
    ): string|false {
        $file_path = trailingslashit(WP_CONTENT_DIR) . $file_name;
        $is_exists = file_exists($file_path);
        if (!$is_exists) {
            return false;
        }

        $file_content = file_get_contents($file_path);
        return $file_content;
    }

    /**
     * Delete folder recursively in wp_content
     *
     * @param string folder_path folder to delete
     * @return bool is_deleted
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function delete_folder_inside_wp_content_recursive(
        string $folder_name
    ): bool {
        $folder_path = trailingslashit(WP_CONTENT_DIR) . $folder_name;
        if (is_dir($folder_path)) {
            $files = glob($folder_path . "/*");
            foreach ($files as $file) {
                if (is_dir($file)) {
                    // Recursively delete subdirectories and their contents.
                    self::delete_folder_inside_wp_content_recursive($file);
                } else {
                    // Delete files.
                    unlink($file);
                }
            }
            // Delete the empty folder.
            return rmdir($folder_path);
        }
        return false;
    }
}
