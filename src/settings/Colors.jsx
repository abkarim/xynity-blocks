import { useEffect, useReducer, useRef, useState } from "react";
import Select from "../components/Select.jsx";
import { useNotificationUpdate } from "../context/notification.jsx";
import ColorInput from "../components/ColorInput.jsx";

/**
 * colors_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    palette: colors_options_from_backend.current.palette,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "color":
            state.palette[action.payload.index].color = action.payload.value;
            return { ...state };

        case "name":
            state.palette[action.payload.index].name = action.payload.value;
            return { ...state };

        case "slug":
            state.palette[action.payload.index].slug = action.payload.value;
            return { ...state };

        default:
            return state;
    }
};

const Colors = () => {
    const initialLoad = useRef(null);
    const errorFound = useRef(null);

    const [visibleOption, setVisibleOption] = useState("*");
    const setNotification = useNotificationUpdate();

    const [data, dispatch] = useReducer(reducer, initialState);

    console.log({ data });

    useEffect(() => {
        if (initialLoad.current === null) {
            initialLoad.current = false;
            return;
        }

        if (errorFound.current === true) return;

        const requestData = {
            palette: data.palette,
        };

        // Update data
        const update = async () => {
            const response = await fetch(
                `${
                    plugin_info_from_backend.ajax_url
                }?action=${encodeURIComponent("xynity_blocks_colors_update")}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": plugin_info_from_backend.ajax_nonce,
                    },
                    credentials: "same-origin",
                    body: JSON.stringify(requestData),
                }
            );

            const response_data = (await response.json()).data;

            if (response.ok) {
                setNotification({
                    text: response_data,
                    type: "success",
                });
            } else {
                setNotification({
                    text: response_data,
                    type: "error",
                });
            }
        };

        /**
         * Request should be sent after 1 second
         * of last edit
         */
        const timer = setTimeout(() => {
            update();
        }, [1000]);

        return () => clearTimeout(timer);
    }, [data]);

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
                    <option value="global">Global</option>
                </Select>
            </div>
            {/* Palette */}
            {(visibleOption === "global" || visibleOption === "*") && (
                <div>
                    <div>
                        <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-y bg-gray-50">
                            Global
                        </h3>
                    </div>
                    {data.palette.map((color, i) => (
                        <div
                            key={i}
                            className="relative flex items-start justify-between w-full p-5 border-b">
                            <div>
                                <div className="space-y-1">
                                    <input
                                        type="text"
                                        className="block w-full text-xl !border-none !outline-none !px-0"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            dispatch({
                                                type: "name",
                                                category: "global",
                                                payload: {
                                                    index: i,
                                                    value,
                                                },
                                            });
                                            if (value.trim() === "") {
                                                errorFound.current = true;
                                                return setNotification({
                                                    type: "error",
                                                    text: "name cannot be empty, please enter a name",
                                                });
                                            } else {
                                                errorFound.current = false;
                                            }
                                        }}
                                        title="name"
                                        value={color.name}
                                    />
                                    <input
                                        title="slug"
                                        value={color.slug}
                                        className="inline-block "
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            dispatch({
                                                type: "slug",
                                                category: "global",
                                                payload: {
                                                    index: i,
                                                    value: value.trim(),
                                                },
                                            });

                                            if (value.trim() === "") {
                                                errorFound.current = true;
                                                return setNotification({
                                                    type: "error",
                                                    text: "slug cannot be empty, please enter a slug",
                                                });
                                            } else {
                                                errorFound.current = false;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <ColorInput
                                    onChange={(e) => {
                                        const color = e.target.value;
                                        dispatch({
                                            type: "color",
                                            category: "global",
                                            payload: {
                                                index: i,
                                                value: color,
                                            },
                                        });
                                    }}
                                    value={color.color}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Colors;
