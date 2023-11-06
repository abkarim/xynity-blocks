import { useEffect, useState } from "react";
import ColorInput from "./ColorInput.jsx";

export default function Duotone({ values, onChange }) {
    const [edit, setEdit] = useState(false);
    const [color1, setColor1] = useState(values[0]);
    const [color2, setColor2] = useState(values[1]);

    useEffect(() => {
        onChange([color1, color2]);
    }, [color1, color2]);

    return (
        <div className="flex flex-col gap-0">
            <span className="-mb-[6px]">
                <ColorInput value={color1} onChange={setColor1} />
            </span>
            <ColorInput value={color2} onChange={setColor2} />
        </div>
    );
}
