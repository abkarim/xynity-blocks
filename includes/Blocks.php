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
     * Constructor
     * 
     * @since 0.2.6
     * @access public
     */
    public function __construct()
    {
        $this->register_blocks();
    }

    /**
     * Register blocks 
     * 
     * @return void
     * @access protected
     * @since 0.2.6
     */
    protected function register_blocks(): void
    {
        register_block_type(XYNITY_BLOCKS_DIR . 'blocks/build/slider');
    }
}
