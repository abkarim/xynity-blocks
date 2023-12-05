import { useEffect, useRef, useState } from "react";
import ColorPicker from "react-best-gradient-color-picker";

export default function GradientInput({ gradient = "", onChange }) {
    const [edit, setEdit] = useState(false);
    const containerRef = useRef(null);

    const [data, setData] = useState(gradient);

    /**
     * Set edit to false when user clicked outside of color picker container
     */
    useEffect(() => {
        function manageOutsideClick(event) {
            const { target } = event;

            /**
             * Don't do anything if user clicks color to open editor
             */
            if (target.classList.contains("gradient-preview")) return;

            /**
             * Don't do anything if user click inside container
             */
            if (containerRef.current.contains(target)) return;

            /**
             * Outside click set edit to false
             */
            setEdit(false);

            /**
             * Update data
             */
            if (data !== gradient) {
                onChange(data);
            }
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
        <div ref={containerRef} className="relative">
            {!edit && (
                <div
                    className="border cursor-pointer w-14 h-14 gradient-preview"
                    onClick={() => setEdit((prev) => !prev)}
                    style={{ background: gradient }}></div>
            )}
            {edit && (
                <div className="absolute top-0 right-0 z-50">
                    <ColorPicker
                        value={data}
                        hideColorTypeBtns={true}
                        className="bg-white border shadow-md"
                        onChange={(data) => setData(data)}
                    />
                </div>
            )}
        </div>
    );
}
