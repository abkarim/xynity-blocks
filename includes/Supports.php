<?php

namespace Xynity_Blocks;

class Supports
{

    /**
     * Constructor
     * 
     * @access public
     * @since 0.2.4
     */
    public function __construct()
    {
        add_action('upload_mimes', [$this, 'modify_upload_files_type']);
    }

    /**
     * Modify upload file types
     * 
     * Called by upload_mimes hook
     * 
     * @param array mimes
     * @return array mimes
     * @access public
     * @since 0.2.4
     */
    public function modify_upload_files_type(array $mimes): array
    {

        require_once XYNITY_BLOCKS_PATH .
            "includes/classes/settings/Uploads.php";

        /**
         * Images
         */
        $imageUploadsTypes = Uploads::get_image_upload_types();

        if (in_array('svg', $imageUploadsTypes)) {
            $mimes['svg']  = 'image/svg+xml';
            $mimes['svgz'] = 'image/svg+xml';
        }


        return $mimes;
    }
}
