import { useEffect, useRef, useState } from "react";
import UnitSelect from "../UnitSelect.jsx";
import Input from "./Input.jsx";
import ColorInput from "./ColorInput.jsx";
import getUnitAndValue from "../../util/getUnitAndValue.js";

const ShadowInput = ({ value, onChange }) => {
    const initialLoad = useRef(null);
    const editorRef = useRef(null);
    const colorRef = useRef(null);

    const [boxShadow, setBoxShadow] = useState(value);
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState({
        color: value.split(" ")[4],
        horizontalOffset: {
            ...getUnitAndValue(value.split(" ")[0]),
        },
        verticalOffset: {
            ...getUnitAndValue(value.split(" ")[1]),
        },
        blurRadius: {
            ...getUnitAndValue(value.split(" ")[2]),
        },
        spreadRadius: {
            ...getUnitAndValue(value.split(" ")[3]),
        },
    });

    useEffect(() => {
        if (initialLoad.current !== false) {
            initialLoad.current = false;
            return;
        }

        const {
            horizontalOffset,
            verticalOffset,
            blurRadius,
            spreadRadius,
            color,
        } = data;

        const newShadow = `${horizontalOffset.value}${horizontalOffset.unit} ${verticalOffset.value}${verticalOffset.unit} ${blurRadius.value}${blurRadius.unit} ${spreadRadius.value}${spreadRadius.unit} ${color}`;

        setBoxShadow(newShadow);
        onChange(newShadow);
    }, [data]);

    /**
     * Close editor on outside click
     */
    useEffect(() => {
        const handleOutsideClick = (e) => {
            const currentElement = e.target;
            if (
                !editorRef.current.contains(currentElement) &&
                currentElement !== colorRef.current
            ) {
                setIsEditing(false);
            }
        };

        if (isEditing) {
            document.addEventListener("click", handleOutsideClick);
        } else {
            document.removeEventListener("click", handleOutsideClick);
        }
        // Cleanup
        return () => document.removeEventListener("click", handleOutsideClick);
    }, [isEditing]);

    return (
        <div className="relative">
            {/* Preview */}
            <div
                ref={colorRef}
                className="bg-white border"
                onClick={() => setIsEditing((prev) => !prev)}>
                <div
                    className="w-20 h-20 m-10 bg-gray-500 pointer-events-none"
                    style={{
                        boxShadow,
                    }}></div>
            </div>
            {/* Editor */}
            {isEditing && (
                <div
                    ref={editorRef}
                    className="absolute right-0 z-10 p-2 mt-2 space-y-2 bg-white rounded shadow-lg top-full w-80 outline outline-1">
                    <div className="flex items-center justify-between">
                        <h5>Color</h5>
                        <fieldset className="flex items-stretch w-48">
                            <ColorInput
                                value={data.color}
                                onChange={(e) =>
                                    setData({ ...data, color: e.target.value })
                                }
                            />
                        </fieldset>
                    </div>
                    <div className="flex items-center justify-between">
                        <h5>Horizontal offset</h5>
                        <fieldset className="flex items-stretch w-48">
                            <Input
                                className="!rounded-tr-none !rounded-br-none !border-r-0"
                                value={data.horizontalOffset.value}
                                onInput={(e) =>
                                    setData({
                                        ...data,
                                        horizontalOffset: {
                                            ...data.horizontalOffset,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            <UnitSelect
                                className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                value={data.horizontalOffset.unit}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        horizontalOffset: {
                                            ...data.horizontalOffset,
                                            unit: e.target.value,
                                        },
                                    })
                                }
                            />
                        </fieldset>
                    </div>
                    <div className="flex items-center justify-between">
                        <h5>Vertical offset</h5>
                        <fieldset className="flex items-stretch w-48">
                            <Input
                                className="!rounded-tr-none !rounded-br-none !border-r-0"
                                value={data.verticalOffset.value}
                                onInput={(e) =>
                                    setData({
                                        ...data,
                                        verticalOffset: {
                                            ...data.verticalOffset,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            <UnitSelect
                                className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                value={data.verticalOffset.unit}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        verticalOffset: {
                                            ...data.verticalOffset,
                                            unit: e.target.value,
                                        },
                                    })
                                }
                            />
                        </fieldset>
                    </div>
                    <div className="flex items-center justify-between">
                        <h5>Blur radius</h5>
                        <fieldset className="flex items-stretch w-48">
                            <Input
                                className="!rounded-tr-none !rounded-br-none !border-r-0"
                                value={data.blurRadius.value}
                                onInput={(e) =>
                                    setData({
                                        ...data,
                                        blurRadius: {
                                            ...data.blurRadius,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            <UnitSelect
                                className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                value={data.blurRadius.unit}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        blurRadius: {
                                            ...data.blurRadius,
                                            unit: e.target.value,
                                        },
                                    })
                                }
                            />
                        </fieldset>
                    </div>
                    <div className="flex items-center justify-between">
                        <h5>Spread radius</h5>
                        <fieldset className="flex items-stretch w-48">
                            <Input
                                className="!rounded-tr-none !rounded-br-none !border-r-0"
                                value={data.spreadRadius.value}
                                onInput={(e) =>
                                    setData({
                                        ...data,
                                        spreadRadius: {
                                            ...data.spreadRadius,
                                            value: e.target.value,
                                        },
                                    })
                                }
                            />
                            <UnitSelect
                                className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                value={data.spreadRadius.unit}
                                onChange={(e) =>
                                    setData({
                                        ...data,
                                        spreadRadius: {
                                            ...data.spreadRadius,
                                            unit: e.target.value,
                                        },
                                    })
                                }
                            />
                        </fieldset>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShadowInput;
