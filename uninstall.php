<?php

// if uninstall.php is not called by WordPress, die
if (!defined("WP_UNINSTALL_PLUGIN")) {
    die();
}

/**
 * Define necessary constants
 */

/**
 * Plugin textdomain
 * @var string
 */
define("XYNITY_BLOCKS_TEXT_DOMAIN", "xynity-blocks");

/**
 * Delete content folder
 */
require_once trailingslashit(plugin_dir_path(__FILE__)) .
    "includes/classes/FileSystem.php";
\Xynity_Blocks\FileSystem::delete_folder_inside_wp_content_recursive(
    "xynity-blocks-content"
);

/**
 * Clear all database properties
 * and caching configuration
 *
 * If user want to uninstall plugin with it's all data
 */
require_once trailingslashit(plugin_dir_path(__FILE__)) .
    "includes/classes/DB.php";

\Xynity_Blocks\DB::clear_all_data();
