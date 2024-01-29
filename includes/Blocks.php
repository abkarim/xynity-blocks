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
     * Blocks to register 
     * @var array
     */
    protected $_blocks_to_register = ["slider", "slider-child"];

    /**
     * Constructor
     * 
     * @since 0.2.6
     * @access public
     */
    public function __construct()
    {
        $this->register_blocks();

        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
    }

    /**
     * Remove disabled block from $_blocks_to_register 
     * this will prevent disabled blocks from being register 
     * 
     * @return void
     * @access protected
     * @since 0.2.7
     */
    protected function remove_disabled_block_names(): void
    {
        /**
         * Get Disabled blocks from Database
         * @var array
         */
        $disabled_blocks = [];

        /**
         * Remove disabled blocks
         */
        $this->_blocks_to_register = array_diff($this->_blocks_to_register, $disabled_blocks);
    }

    /**
     * Enqueue blocks assets
     * 
     * @access public
     * @since 0.2.6
     */
    public function enqueue_block_assets()
    {
        /**
         * Load dashicons 
         * 
         * required for: slider
         */
        wp_enqueue_style("dashicons");
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
        foreach ($this->_blocks_to_register as $block) {
            register_block_type(XYNITY_BLOCKS_DIR . 'blocks/build/' . $block);
        }
    }
}
