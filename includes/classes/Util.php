<?php

namespace Xynity_Blocks;

/**
 * Prevent direct access
 */
if (!defined("ABSPATH")) {
    exit();
}

class Util
{
    /**
     * Get value if present
     *
     * use's isset to check if the value is present or not
     * if present returns value
     *
     * defaults to default value
     *
     * @param object
     * @param mixed - default to return
     * @since 0.1.1
     * @access public
     */
    public static function get_value_if_present_in_stdClass(
        $object,
        $value,
        $default
    ) {
        if (isset($object->$value)) {
            return $object->$value;
        }

        return $default;
    }

    /**
     * Get value if present
     *
     * use's isset to check if the value is present or not
     * if present returns value
     *
     * defaults to default value
     *
     * @param array
     * @param string
     * @param mixed null - default to return
     * @since 0.1.4
     * @access public
     */
    public static function get_value_if_present_in_array(
        $array,
        $value,
        $default = null
    ) {
        if (isset($array[$value])) {
            return $array[$value];
        }

        return $default;
    }

    /**
     * Is valid value in a array
     *
     * @param array
     * @param string key
     * @return bool
     * @access public
     * @static
     * @since 0.2.0
     */
    public static function is_valid_value_in_array(
        array $array,
        string $key
    ): bool {
        $value = self::get_value_if_present_in_array($array, $key);

        return (bool) $value;
    }
}
