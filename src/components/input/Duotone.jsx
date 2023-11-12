import { useState } from "react";
import ColorInput from "./ColorInput.jsx";

export default function Duotone({ values, onChange }) {
    const [colors, setColors] = useState({
        first: values[0],
        second: values[1],
    });

    /**
     * Update color
     *
     * triggers onChange function
     *
     * @param {string} name
     * @param {string} color
     */
    function updateColor(name, color) {
        setColors((prev) => {
            const newColors = { ...prev, [name]: color };
            onChange([newColors.first, newColors.second]);
            return newColors;
        });
    }

    return (
        <div className="flex flex-col gap-0">
            <span className="-mb-[6px]">
                <ColorInput
                    value={colors.first}
                    onChange={(color) => updateColor("first", color)}
                />
            </span>
            <ColorInput
                value={colors.second}
                onChange={(color) => updateColor("second", color)}
            />
        </div>
    );
}
