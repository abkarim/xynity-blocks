import { useState } from "react";
import Select from "../components/Select.jsx";
import { useNotificationUpdate } from "../context/notification.jsx";

const Colors = () => {
    const [visibleOption, setVisibleOption] = useState("*");
    const setNotification = useNotificationUpdate();

    return (
        <section>
            <div className="flex items-center justify-between px-5 py-2 bg-slate-100">
                <h2 className="text-sm font-bold text-gray-600 uppercase">
                    Visible Option
                </h2>
                <Select
                    value={visibleOption}
                    onChange={(e) => {
                        setVisibleOption(e.target.value);
                    }}>
                    <option value="*">All</option>
                    <option value="palette">Palette</option>
                </Select>
            </div>
            {/* Palette */}
            {(visibleOption === "palette" || visibleOption === "*") && (
                <div>
                    <div>
                        <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-y bg-gray-50">
                            Palette
                        </h3>
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Base</h3>
                            <div></div>
                        </div>
                        <fieldset className="flex items-center w-48"></fieldset>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Colors;
