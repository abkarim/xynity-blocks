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

    /**
     * Generate a random string 
     * 
     * @param int length - default 20
     * @return string generated_random_string
     * @since 0.2.4
     * @access public
     * @static
     */
    public static function generate_random_string(int $length = 20): string
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }
}
