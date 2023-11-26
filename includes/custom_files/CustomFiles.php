<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class CustomFiles extends AJAX
{

    /**
     * Admin Dashboard custom files 
     * @var array
     */
    private static $_admin_dashboard_custom_files = [];

    /**
     * Frontend custom files 
     * @var array
     */
    private static $_frontend_custom_files = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action("wp_ajax_xynity_blocks__get_all_css", function () {
            $this->get_all('css');
        });
        add_action("wp_ajax_xynity_blocks__get_all_js", function () {
            $this->get_all('js');
        });


        add_action("wp_ajax_xynity_blocks__get_all_css_trashed", function () {
            $this->get_all_trashed('css');
        });
        add_action("wp_ajax_xynity_blocks__get_all_js_trashed", function () {
            $this->get_all_trashed('js');
        });


        add_action("wp_ajax_xynity_blocks__add_new_css", function () {
            $this->add_new('css');
        });
        add_action("wp_ajax_xynity_blocks__add_new_js", function () {
            $this->add_new('js');
        });



        add_action("wp_ajax_xynity_blocks__update", [$this, 'update_metadata']);
        add_action("wp_ajax_xynity_blocks__custom_file__move_to_trash", [$this, 'move_to_trash']);
        add_action("wp_ajax_xynity_blocks__custom_file__restore_from_trash", [$this, 'restore_from_trash']);
        add_action("wp_ajax_xynity_blocks__custom_file__delete", [$this, 'delete']);
        add_action("wp_ajax_xynity_blocks__custom_file__content", [$this, 'get_content']);
    }

    /**
     * Load custom files
     * 
     * @access public
     * @since 0.2.4
     * @static
     */
    public static function load_custom_files()
    {
        /**
         * Get all published files
         * 
         * @var array
         */
        $table_name = DB::get_custom_files_table_name();
        $published_custom_files = DB::get_all_results($table_name, [
            'file_status' => 'published'
        ]);

        /**
         * Update properties
         */
        foreach ($published_custom_files as $file) {
            if (intval($file->load_on_admin) === 1) {
                array_push(self::$_admin_dashboard_custom_files, $file);
            }

            if (intval($file->load_on_frontend) === 1) {
                array_push(self::$_frontend_custom_files, $file);
            }
        }

        if (count(self::$_admin_dashboard_custom_files) !== 0) {
            add_action('admin_enqueue_scripts', function () {
                self::load_admin_custom_files();
            });
        }
        if (count(self::$_frontend_custom_files) !== 0) {
            add_action('wp_enqueue_scripts', function () {
                self::load_frontend_custom_files();
            });
        }
    }

    /**
     * Load admin custom files
     *
     * @since 0.2.4
     * @access public
     */
    public static function load_admin_custom_files()
    {
        require_once XYNITY_BLOCKS_DIR . "includes/classes/FileSystem.php";

        $dir_src = FileSystem::get_xynity_blocks_folder_url();

        foreach (self::$_admin_dashboard_custom_files as $file) {
            if ($file->file_type === 'css') {
                wp_enqueue_style("xynity-blocks-custom-file-{$file->file_slug}", "$dir_src/css/{$file->file_slug}.css", [], "{$file->file_version}", 'all');
            } elseif ($file->file_type === "js") {
                wp_enqueue_script("xynity-blocks-custom-file-{$file->file_slug}", "$dir_src/js/{$file->file_slug}.js", [], "{$file->file_version}", intval($file->load_in_footer));
            }
        }
    }

    /**
     * Load frontend custom files
     *       
     * @since 0.2.4
     * @access public
     */
    public static function load_frontend_custom_files()
    {
        require_once XYNITY_BLOCKS_DIR . "includes/classes/FileSystem.php";

        $dir_src = FileSystem::get_xynity_blocks_folder_url();

        foreach (self::$_frontend_custom_files as $file) {
            if ($file->file_type === 'css') {
                wp_enqueue_style("xynity-blocks-custom-file-{$file->file_slug}", "$dir_src/css/{$file->file_slug}.css", [], "{$file->file_version}", 'all');
            } elseif ($file->file_type === "js") {
                wp_enqueue_script("xynity-blocks-custom-file-{$file->file_slug}", "$dir_src/js/{$file->file_slug}.js", [], "{$file->file_version}", intval($file->load_in_footer));
            }
        }
    }

    /**
     * Add new file
     * 
     * @param string file_type
     * @since 0.2.4
     * @access public
     */
    public function add_new(string $file_type)
    {
        [$data, $decoded_Data] = $this->get_request_data("POST");

        /**
         * Validate input
         */
        $name = Util::get_value_if_present_in_array($decoded_Data, 'name', "");
        if (trim($name) === "") {
            $this->send_response_and_close_request("name is required", 400);
        }

        $file_slug = Util::generate_random_string(20);

        /**
         * Prepare data 
         */
        $prepared_data = [
            'file_name' => trim($decoded_Data['name']),
            'file_slug' => $file_slug,
            'file_type' => $file_type,
        ];

        $status = Util::get_value_if_present_in_array($decoded_Data, 'status', null);
        if (!is_null($status)) {
            $prepared_data['file_status'] = $status;
        }
        $load_on_frontend = Util::get_value_if_present_in_array($decoded_Data, 'loadOnFrontend', null);
        if (!is_null($load_on_frontend)) {
            $prepared_data['load_on_frontend'] = $load_on_frontend;
        }
        $load_on_admin = Util::get_value_if_present_in_array($decoded_Data, 'loadOnAdminDashboard', null);
        if (!is_null($load_on_admin)) {
            $prepared_data['load_on_admin'] = $load_on_admin;
        }
        $load_in_footer = Util::get_value_if_present_in_array($decoded_Data, 'loadInFooter', null);
        if (!is_null($load_in_footer)) {
            $prepared_data['load_in_footer'] = $load_in_footer;
        }

        global $wpdb;
        $table_name = DB::get_custom_files_table_name();
        $is_inserted = $wpdb->insert(
            $table_name,
            $prepared_data
        );

        $content = Util::get_value_if_present_in_array($decoded_Data, 'content', "");

        if ($is_inserted) {

            /**
             * Save file content
             */
            if (!empty($content)) {
                $this->update_file_content($file_slug, $content, $file_type);
            }

            $this->send_response_and_close_request($wpdb->insert_id);
        } else {
            $this->send_response_and_close_request("something went wrong please try again later", 400);
        }
    }

    /**
     * Update metadata
     * 
     * @param string file_type
     * @since 0.2.4
     * @access public
     */
    public function update_metadata()
    {
        [$data, $decoded_Data] = $this->get_request_data("POST");

        /**
         * Get id
         * 
         * @var int
         */
        $id = Util::get_value_if_present_in_array($decoded_Data, 'id', 0);
        if ($id === 0) {
            $this->send_response_and_close_request("id is required", 400);
        }

        $updated_value = [
            'file_name' => $decoded_Data['name'],
        ];

        /**
         * Get input
         */
        $name = Util::get_value_if_present_in_array($decoded_Data, 'name', "");
        if (trim($name) === "") {
            $this->send_response_and_close_request("name is required", 400);
        }
        $status = Util::get_value_if_present_in_array($decoded_Data, 'status', null);
        if (!is_null($status)) {
            $updated_value['file_status'] = $status;
        }
        $load_on_frontend = Util::get_value_if_present_in_array($decoded_Data, 'loadOnFrontend', null);
        if (!is_null($load_on_frontend)) {
            $updated_value['load_on_frontend'] = $load_on_frontend;
        }
        $load_on_admin = Util::get_value_if_present_in_array($decoded_Data, 'loadOnAdminDashboard', null);
        if (!is_null($load_on_admin)) {
            $updated_value['load_on_admin'] = $load_on_admin;
        }
        $load_in_footer = Util::get_value_if_present_in_array($decoded_Data, 'loadInFooter', null);
        if (!is_null($load_in_footer)) {
            $updated_value['load_in_footer'] = $load_in_footer;
        }

        global $wpdb;
        $table_name = DB::get_custom_files_table_name();

        $file_metadata = DB::get_result($table_name, [
            'id' => $id
        ]);
        if (count($file_metadata) === 0) {
            $this->send_response_and_close_request("custom file doesn't exists", 400);
        }

        /**
         * Update version
         */
        $updated_value['file_version'] = intval($file_metadata['file_version']) + 1;

        $is_updated = $wpdb->update(
            $table_name,
            $updated_value,
            [
                'id' => $id,
            ]
        );

        $content = Util::get_value_if_present_in_array($decoded_Data, 'content', "");

        /**
         * Update file content
         */
        if (!empty($content)) {
            $this->update_file_content($file_metadata['file_slug'], $content, $file_metadata['file_type']);
        }

        $this->send_response_and_close_request("updated successfully");
    }

    /**
     * Move to trash
     * 
     * @since 0.2.4
     * @access public
     */
    public function move_to_trash()
    {
        $this->block_incoming_request_if_invalid("DELETE");
        /**
         * @var array
         */
        $data = $this->get_url_parameter();

        /**
         * Validate id
         */
        $id = Util::get_value_if_present_in_array($data, 'id', 0);
        if ($id === 0) {
            $this->send_response_and_close_request("id is required", 400);
        } else {
            if (preg_match("/^[0-9]+$/", $id)) {
                $id = intval($id);
            } else {
                $this->send_response_and_close_request("id is invalid", 400);
            }
        }

        /**
         * Set item status to trash
         */
        global $wpdb;
        $table_name = DB::get_custom_files_table_name();
        $is_updated = $wpdb->update($table_name, [
            'file_status' => 'trash'
        ], [
            'id' => $id
        ]);


        $this->send_response_and_close_request("moved to trash successfully");
    }

    /**
     * Restore from trash
     * 
     * @since 0.2.4
     * @access public
     */
    public function restore_from_trash()
    {
        $this->block_incoming_request_if_invalid("POST");

        /**
         * @var array
         */
        $data = $this->get_url_parameter();

        /**
         * Validate id
         */
        $id = Util::get_value_if_present_in_array($data, 'id', 0);
        if ($id === 0) {
            $this->send_response_and_close_request("id is required", 400);
        } else {
            if (preg_match("/^[0-9]+$/", $id)) {
                $id = intval($id);
            } else {
                $this->send_response_and_close_request("id is invalid", 400);
            }
        }

        /**
         * Set item status to draft
         */
        global $wpdb;
        $table_name = DB::get_custom_files_table_name();
        $is_updated = $wpdb->update($table_name, [
            'file_status' => 'draft'
        ], [
            'id' => $id
        ]);

        $this->send_response_and_close_request("moved to draft successfully");
    }

    /**
     * Delete permanently
     * 
     * @since 0.2.4
     * @access public
     */
    public function delete()
    {
        $this->block_incoming_request_if_invalid("DELETE");
        /**
         * @var array
         */
        $data = $this->get_url_parameter();

        /**
         * Validate id
         */
        $id = Util::get_value_if_present_in_array($data, 'id', 0);
        if ($id === 0) {
            $this->send_response_and_close_request("id is required", 400);
        } else {
            if (preg_match("/^[0-9]+$/", $id)) {
                $id = intval($id);
            } else {
                $this->send_response_and_close_request("id is invalid", 400);
            }
        }

        global $wpdb;
        $table_name = DB::get_custom_files_table_name();

        /**
         * Get file metadata
         */
        $file_metadata = DB::get_result($table_name, [
            'id' => $id
        ]);

        /**
         * Is metadata exists
         */
        if (count($file_metadata) === 0) {
            $this->send_response_and_close_request("deleted successfully");
        }

        /**
         * Delete metadata from database
         */
        $is_deleted = $wpdb->delete($table_name, [
            'id' => $id,
            'file_status' => 'trash',
        ]);

        /**
         * Delete file if exists
         */
        $this->delete_file($file_metadata['file_slug'], $file_metadata['file_type']);

        $this->send_response_and_close_request("deleted successfully");
    }

    /**
     * Get all files without trashed
     *      
     * @param string filetype
     * @since 0.2.4
     * @access public
     */
    public function get_all(string $filetype)
    {
        $this->block_incoming_request_if_invalid('GET');

        global $wpdb;
        $table_name = DB::get_custom_files_table_name();
        $results = $wpdb->get_results(
            "SELECT * FROM $table_name WHERE file_type = '$filetype' AND file_status != 'trash' ORDER BY id DESC"
        );

        $this->send_response_and_close_request($results);
    }

    /**
     * Get all trashed
     * 
     * @param string type
     * @since 0.2.4
     * @access public
     */
    public function get_all_trashed(string $filetype)
    {
        $this->block_incoming_request_if_invalid('GET');

        $table_name = DB::get_custom_files_table_name();
        $results = DB::get_all_results($table_name, [
            'file_type' => "$filetype",
            'file_status' => 'trash'
        ]);

        $this->send_response_and_close_request($results);
    }

    /**
     * Get file content
     * 
     * @access public 
     * @since 0.2.4
     */
    public function get_content()
    {
        $this->block_incoming_request_if_invalid("GET");

        /**
         * @var array
         */
        $data = $this->get_url_parameter();

        /**
         * Validate id
         */
        $id = Util::get_value_if_present_in_array($data, 'id', 0);
        if ($id === 0) {
            $this->send_response_and_close_request("id is required", 400);
        } else {
            if (preg_match("/^[0-9]+$/", $id)) {
                $id = intval($id);
            } else {
                $this->send_response_and_close_request("id is invalid", 400);
            }
        }

        global $wpdb;
        $table_name = DB::get_custom_files_table_name();

        /**
         * Get file metadata
         */
        $file_metadata = DB::get_result($table_name, [
            'id' => $id
        ]);

        /**
         * Is metadata exists
         */
        if (count($file_metadata) === 0) {
            $this->send_response_and_close_request("data not found");
        }

        /**
         * Get file content
         * 
         * @var string
         */
        $content = $this->get_file_content($file_metadata['file_slug'], $file_metadata['file_type']);

        $this->send_response_and_close_request($content);
    }

    /**
     * Update file content
     * 
     * @param string filename
     * @param string content
     * @param string filetype
     * @return bool is_updated
     * @access private
     * @since 0.2.4
     */
    private function update_file_content(string $filename, string $content, string $filetype): bool
    {
        // Include FileSystem object
        require_once XYNITY_BLOCKS_PATH .
            "includes/classes/FileSystem.php";

        $path = "$filetype/$filename.$filetype";

        return FileSystem::write_into_xynity_folder($path, $content);
    }

    /**
     * Get file content
     * 
     * @param string filename
     * @param string filetype
     * @return string content
     * @access private
     * @since 0.2.4
     */
    private function get_file_content(string $filename, string $filetype): string
    {
        // Include FileSystem object
        require_once XYNITY_BLOCKS_PATH .
            "includes/classes/FileSystem.php";

        $path = "$filetype/$filename.$filetype";

        return FileSystem::read_file($path);
    }



    /**
     * Delete file
     * 
     * @param string filename
     * @param string filetype
     * @return bool is_updated
     * @access private
     * @since 0.2.4
     */
    private function delete_file(string $filename, string $filetype): bool
    {
        // Include FileSystem object
        require_once XYNITY_BLOCKS_PATH .
            "includes/classes/FileSystem.php";

        $path = "$filetype/$filename.$filetype";

        return FileSystem::delete_from_xynity_folder($path);
    }
}
