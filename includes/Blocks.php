<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}


class Blocks extends AJAX
{
    /**
     * Activated blocks option name
     * @var string
     * @access public
     * @static
     */
    public static $_activated_blocks_option_name = XYNITY_BLOCKS_TEXT_DOMAIN . "_activated_blocks";

    /**
     * Deactivated blocks option name
     * @var string
     * @access public
     * @static
     */
    public static $_deactivated_blocks_option_name = XYNITY_BLOCKS_TEXT_DOMAIN . "_deactivated_blocks";

    /**
     * Block prefix
     * @var string
     * @access protected
     */
    protected $_blocks_prefix = "xynity-blocks";

    /**
     * Blocks list
     * @var array
     */
    public $_blocks_list = [
        [
            "title" => "Slider",
            "name" => "slider",
            "from" => "xynity-blocks",
            "category" => "media",
            "iconElement" => '<path d="M6 8C6 5.17157 6 3.75736 6.87868 2.87868C7.75736 2 9.17157 2 12 2C14.8284 2 16.2426 2 17.1213 2.87868C18 3.75736 18 5.17157 18 8V16C18 18.8284 18 20.2426 17.1213 21.1213C16.2426 22 14.8284 22 12 22C9.17157 22 7.75736 22 6.87868 21.1213C6 20.2426 6 18.8284 6 16L6 8Z" />
                            <g opacity="0.5">
                            <path d="M6.14114 4.5C6 5.34287 6 6.46249 6 8V16C6 17.5375 6 18.6571 6.14114 19.5H6C4.59987 19.5 3.8998 19.5 3.36502 19.2275C2.89462 18.9878 2.51217 18.6054 2.27248 18.135C2 17.6002 2 16.9001 2 15.5V8.5C2 7.09987 2 6.3998 2.27248 5.86502C2.51217 5.39462 2.89462 5.01217 3.36502 4.77248C3.8998 4.5 4.59987 4.5 6 4.5H6.14114Z" />
                            <path d="M17.8589 4.5C18 5.34287 18 6.46248 18 7.99998V16C18 17.5375 18 18.6571 17.8589 19.5H18C19.4001 19.5 20.1002 19.5 20.635 19.2275C21.1054 18.9878 21.4878 18.6054 21.7275 18.135C22 17.6002 22 16.9001 22 15.5V8.5C22 7.09987 22 6.3998 21.7275 5.86502C21.4878 5.39462 21.1054 5.01217 20.635 4.77248C20.1002 4.5 19.4001 4.5 18 4.5H17.8589Z" />
                            </g>',
            "child" => [
                "slider-child"
            ],
            "keywords" => [
                "slider",
                "xynity",
                "blocks",
                "gallery"
            ],
        ]
    ];

    /**
     * Blocks list to be activated by default
     * @var array
     */
    protected $_blocks_to_be_activated_by_default = ["slider"];

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
         */
        if (defined('XYNITY_BLOCKS_PLUGIN_UPDATED')) {
            $this->update_default_activated_blocks_list();
        }

        $this->update_activated_blocks_list();
        $this->update_deactivated_blocks_list();

        $this->register_blocks();

        add_action('enqueue_block_assets', [$this, 'enqueue_block_assets']);


        /**
         * Handle ajax request
         */
        add_action("wp_ajax_xynity_blocks__get_all_registered_xynity_blocks__blocks_list", function () {
            $this->get_all_registered_xynity_blocks__blocks_list();
        });
    }

    /**
     * Get all registered blocks
     * this function will update $this-_all_registered_xynity_blocks__blocks_list
     * 
     * @return void
     * @since 0.2.7
     */
    protected function get_all_registered_xynity_blocks__blocks_list(): void
    {
        $this->block_incoming_request_if_invalid("GET");

        $blocks = $this->_blocks_list;

        /**
         * Append is_activated key to every blocks to 
         * detect whether the block is activated or deactivated
         */
        foreach ($blocks as $index => $block) {
            $is_activated = false;

            // Does this block contains in the activated_blocks list
            if (in_array($block["name"], $this->_activated_blocks_list)) {
                $is_activated = true;
            }

            $blocks[$index]["is_activated"] = $is_activated;
        }

        $this->send_response_and_close_request($blocks);
    }

    /**
     * Get block name and child names
     * 
     * @param string $block_name
     * @return array [block_names] 
     * @since 0.2.7
     */
    protected function get_block_name_and_child_names(string $block_name): array
    {
        $names = [$block_name];

        /**
         * Get block from blocks list
         * @var array
         */
        $block = Util::get_array_from_array_by_key_and_value($this->_blocks_list, "name", $block_name);

        if (count($block) !== 0) {
            $child_list = $block['child'];
            if ($child_list) {
                $names = array_merge($names, $child_list);
            }
        }

        return $names;
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
     * Activate block including child blocks
     * 
     * @param string $block_name
     * @return void
     * @access protected
     * @since 0.2.7
     */
    protected function activate_block(string $block_name): void
    {
        /**
         * Get block names including child blocks
         * @var array
         */
        $block_names = $this->get_block_name_and_child_names($block_name);

        /**
         * Remove from deactivated_blocks list option
         */
        foreach ($block_names as $block) {
            unset($this->_deactivated_blocks_list[$block]);
        }
        update_option(self::$_deactivated_blocks_option_name, serialize($this->_deactivated_blocks_list));

        /**
         * Add to activated_blocks list option
         */
        foreach ($block_names as $block) {
            $this->_activated_blocks_list[] = $block;
        }
        update_option(self::$_activated_blocks_option_name, serialize($this->_activated_blocks_list));
    }


    /**
     * Deactivate block including child blocks
     * 
     * @param string $block_name
     * @return void
     * @access protected
     * @since 0.2.7
     */
    protected function deactivate_block(string $block_name): void
    {
        /**
         * Get block names including child blocks
         * @var array
         */
        $block_names = $this->get_block_name_and_child_names($block_name);

        /**
         * Remove from activated_blocks list option
         */
        foreach ($block_names as $block) {
            unset($this->_activated_blocks_list[$block]);
        }
        update_option(self::$_activated_blocks_option_name, serialize($this->_activated_blocks_list));

        /**
         * Add to deactivated_blocks list option
         */
        foreach ($block_names as $block) {
            $this->_deactivated_blocks_list[] = $block;
        }
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
