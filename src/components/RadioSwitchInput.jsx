import { useState } from "react";

const RadioSwitchInput = ({
    selected = false,
    className,
    onClick = () => {},
    ...props
}) => {
    return (
        <div
            className={`relative z-0 w-10 p-2 rounded-full bg-opacity-60 ${
                selected ? "bg-green-500" : "bg-gray-400"
            }`}
            onClick={onClick}>
            <span
                className={`absolute top-0 bottom-0 transition-all inline-block w-4 h-4 rounded-full aspect-square z-[1] scale-150 ${
                    selected ? "right-0 bg-green-500" : "left-0 bg-gray-400"
                }`}></span>
        </div>
    );
};

export default RadioSwitchInput;
