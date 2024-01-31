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
    public static $_activated_blocks_option_name = XYNITY_BLOCKS_TEXT_DOMAIN . "_activated_blocks";
    public static $_deactivated_blocks_option_name = XYNITY_BLOCKS_TEXT_DOMAIN . "_deactivated_blocks";

    /**
     * Blocks list to be activated by default
     * @var array
     */
    public static $_blocks_to_register_by_default = ["slider", "slider-child"];

    /**
     * Blocks to register 
     * @var array
     */
    protected $_blocks_to_register = [];

    /**
     * Constructor
     * 
     * @since 0.2.6
     * @access public
     */
    public function __construct()
    {
        $this->get_activate_blocks_from_database();
        $this->register_blocks();

        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
    }

    /**
     * Get activated blocks from database
     * and update $this->_blocks_to_register
     * 
     * @since 0.2.7
     * @access protected
     */
    protected function get_activate_blocks_from_database()
    {
        $activated_blocks = get_option(self::$_activated_blocks_option_name, serialize([]));
        $this->_blocks_to_register = unserialize($activated_blocks);
    }

    /**
     * Activate block
     * 
     * @param string block-name
     * @return void
     * @access protected
     * @since 0.2.7
     */
    protected function activate_block(string $block_name): void
    {
        /**
         * Remove from deactivated_blocks list option
         */
        $deactivated_blocks = get_option(self::$_deactivated_blocks_option_name, serialize([]));
        unset($block_name);
        update_option(self::$_deactivated_blocks_option_name, serialize($deactivated_blocks));

        /**
         * Add to activated_blocks list option
         */
        $activated_blocks = get_option(self::$_activated_blocks_option_name, serialize([]));
        $activated_blocks[] = $block_name;
        update_option(self::$_activated_blocks_option_name, serialize($activated_blocks));
    }


    /**
     * Deactivate block
     * 
     * @param string block-name
     * @return void
     * @access protected
     * @since 0.2.7
     */
    protected function deactivate_block(string $block_name): void
    {
        /**
         * Remove from activated_blocks list option
         */
        $activated_blocks = get_option(self::$_activated_blocks_option_name, serialize([]));
        unset($block_name);
        update_option(self::$_activated_blocks_option_name, serialize($activated_blocks));

        /**
         * Add to deactivated_blocks list option
         */
        $deactivated_blocks = get_option(self::$_deactivated_blocks_option_name, serialize([]));
        $deactivated_blocks[] = $block_name;
        update_option(self::$_deactivated_blocks_option_name, serialize($deactivated_blocks));
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
