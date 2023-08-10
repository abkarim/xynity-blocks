<?php

// if uninstall.php is not called by WordPress, die
if (!defined("WP_UNINSTALL_PLUGIN")) {
    die();
}

/**
 * Clear all database properties
 * and caching configuration
 *
 * If user want to uninstall plugin with it's all data
 */
