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
    protected $_blocks_to_be_activated_by_default = ["slider", "slider-child"];

    /**
     * Activated blocks list
     * @var array
     */
    protected $_activated_blocks_list = [];

    /**
     * Deactivated blocks list
     * @var array
     */
    protected $_deactivated_blocks_list = [];

    /**
     * Constructor
     * 
     * @since 0.2.6
     * @access public
     */
    public function __construct()
    {
        /**
         * Update default blocks when plugin is updated
         * 
         * TODO handle update constant define
         */
        if (defined('XYNITY_BLOCKS_PLUGIN_UPDATED')) {
            $this->update_default_activated_blocks_list();
        }

        $this->update_activated_blocks_list();
        $this->update_deactivated_blocks_list();

        $this->register_blocks();

        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);
    }

    /**
     * Update default activated blocks list in database
     * This method is responsible for updating default blocks in database
     * 
     * @since 0.2.7
     * @access protected 
     */
    protected function update_default_activated_blocks_list()
    {
        /**
         * Blocks are in disabled_list should not activated
         * even if the list contains "default active blocks" item
         */
        $default_activated_blocks  = array_diff($this->_blocks_to_be_activated_by_default, $this->_deactivated_blocks_list);

        /**
         * Merge default activated blocks with 
         * activated blocks from database
         */
        $updated_activated_blocks_list = array_unique(array_merge($this->_activated_blocks_list, $default_activated_blocks));

        /**
         * Update on database
         */
        update_option(self::$_activated_blocks_option_name, serialize($updated_activated_blocks_list));
    }

    /**
     * Get activated blocks from database
     * and update property
     * 
     * @since 0.2.7
     * @access protected
     */
    protected function update_activated_blocks_list()
    {
        $activated_blocks = get_option(self::$_activated_blocks_option_name, serialize([]));
        $this->_activated_blocks_list = unserialize($activated_blocks);
    }

    /**
     * Get deactivated blocks from database
     * and update property
     * 
     * @since 0.2.7
     * @access protected
     */
    protected function update_deactivated_blocks_list()
    {
        $deactivated_blocks = get_option(self::$_deactivated_blocks_option_name, serialize([]));
        $this->_deactivated_blocks_list = unserialize($deactivated_blocks);
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
        unset($this->_deactivated_blocks_list[$block_name]);
        update_option(self::$_deactivated_blocks_option_name, serialize($this->_deactivated_blocks_list));

        /**
         * Add to activated_blocks list option
         */
        $this->_activated_blocks_list[] = $block_name;
        update_option(self::$_activated_blocks_option_name, serialize($this->_activated_blocks_list));
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
        unset($this->_activated_blocks_list[$block_name]);
        update_option(self::$_activated_blocks_option_name, serialize($this->_activated_blocks_list));

        /**
         * Add to deactivated_blocks list option
         */
        $this->_deactivated_blocks_list[] = $block_name;
        update_option(self::$_deactivated_blocks_option_name, serialize($this->_deactivated_blocks_list));
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
        foreach ($this->_activated_blocks_list as $block) {
            register_block_type(XYNITY_BLOCKS_DIR . 'blocks/build/' . $block);
        }
    }
}
