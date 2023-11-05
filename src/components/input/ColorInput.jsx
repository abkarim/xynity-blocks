import { ColorIndicator, ColorPicker } from "@wordpress/components";
import { useEffect, useRef, useState } from "react";

export default function ColorInput({
    value,
    onChange,
    readOnly = false,
    ...props
}) {
    const [edit, setEdit] = useState(false);
    const containerRef = useRef(null);

    /**
     * Update color value after 1 seconds of last change
     */
    let timer = null;
    function updateColor(color) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => onChange(color), 1000);
    }

    /**
     * Set edit to false when user clicked outside of color picker container
     */
    useEffect(() => {
        function manageOutsideClick(event) {
            const { target } = event;

            /**
             * Don't do anything if user clicks color to open editor
             */
            if (target.classList.contains("component-color-indicator")) return;

            /**
             * Don't do anything if user click inside container
             */
            if (containerRef.current.contains(target)) return;

            /**
             * Outside click set edit to false
             */
            setEdit(false);
        }

        if (edit) {
            document.addEventListener("click", manageOutsideClick);
        } else {
            document.removeEventListener("click", manageOutsideClick);
        }

        // Cleanup
        return () => document.removeEventListener("click", manageOutsideClick);
    }, [edit]);

    return (
        <div ref={containerRef}>
            {!edit && (
                <ColorIndicator
                    onClick={() => readOnly === false && setEdit(true)}
                    colorValue={value}
                />
            )}
            {edit && (
                <div>
                    <ColorPicker
                        enableAlpha
                        className="border shadow"
                        defaultValue={value}
                        onChange={updateColor}
                    />
                </div>
            )}
        </div>
    );
}
