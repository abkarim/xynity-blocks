<?php
namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class ThemeActions
{
    /**
     * Constructor
     *
     * @since 0.1.0
     */
    public function __construct()
    {
        if ($this->should_update_theme_json_data()) {
            add_filter("wp_theme_json_data_theme", [
                $this,
                "update_theme_json_data",
            ]);
        }
    }

    /**
     * Get Theme.json data
     * Returns array with editable and extendable theme.json data
     *
     * @return array
     * @since 0.1.0
     * @access public
     */
    public static function get_theme_json_data()
    {
        return [
            "color" => [
                "text" => true,
                "palette" => [
                    [
                        "slug" => "base",
                        "color" => "white",
                        "name" => __("Base k", "theme-domain"),
                    ],
                    [
                        "slug" => "contrast",
                        "color" => "black",
                        "name" => __("Contrast k", "theme-domain"),
                    ],
                ],
            ],
            "layout" => [
                "contentSize" => "650px",
                "wideSize" => "1200px",
            ],
        ];
    }

    /**
     * Get modified theme data
     *
     * @return array
     * @since 0.1.0
     * @access private
     */
    private function get_modified_theme_json_data()
    {
        $new_data = [
            "version" => 2,
            "settings" => [
                "color" => [
                    "text" => true,
                    "palette" => [
                        [
                            "slug" => "base",
                            "color" => "white",
                            "name" => __("Base k", "theme-domain"),
                        ],
                        [
                            "slug" => "contrast",
                            "color" => "black",
                            "name" => __("Contrast k", "theme-domain"),
                        ],
                    ],
                ],
            ],
        ];

        return $new_data;
    }

    /**
     * Update theme.json data
     *
     * Overwrites modified contents in theme.json data
     *
     ** Called by wp_theme_json_data_theme hook
     *
     * @since 0.1.0
     * @access private
     */
    public function update_theme_json_data($theme_json)
    {
        $new_data = $this->get_modified_theme_json_data();
        return $theme_json->update_with($new_data);
    }

    /**
     * Should update theme.json data
     *
     * Returns true if user did any changes
     * in default theme.json data
     *
     * @return bool
     * @since 0.1.0
     * @access private
     */
    private function should_update_theme_json_data()
    {
        return true;
    }
}
