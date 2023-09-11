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
