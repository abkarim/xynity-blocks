import { useEffect, useReducer, useRef, useState } from "react";
import Select from "../components/Select.jsx";
import { useNotificationUpdate } from "../context/notification.jsx";
import ColorInput from "../components/ColorInput.jsx";
import RadioSwitchInput from "../components/RadioSwitchInput.jsx";
import ChangeIndicator from "./ChangeIndicator.jsx";

/**
 * colors_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    ...colors_options_from_backend.default,
    ...colors_options_from_backend.current,
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

        case "delete":
            const targetItem = state.palette[action.payload.index];
            const newData = state.palette.filter((item) => item !== targetItem);
            return { ...state, palette: newData };

        case "duplicate":
            const copiedItem = structuredClone(
                state.palette[action.payload.index]
            );
            copiedItem.custom = true;
            copiedItem.name = copiedItem.name + " - duplicate";
            copiedItem.slug = copiedItem.slug + "2";
            state.palette.splice(action.payload.index + 1, 0, copiedItem);
            return { ...state };

        case "new":
            const newColor = {
                color: "#000",
                name: "New color",
                slug: "new-color",
                custom: true,
                category: action.category,
            };
            state.palette.unshift(newColor);
            return { ...state };

        case "toggleBool":
            state[action.payload.name] = !state[action.payload.name];
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
            custom: data.custom,
            defaultPalette: data.defaultPalette,
            defaultGradients: data.defaultGradients,
            customGradient: data.customGradient,
            customDuotone: data.customDuotone,
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
                    <option value="settings">Settings</option>
                </Select>
            </div>
            {/* Settings */}
            {(visibleOption === "settings" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-y bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Settings
                        </h3>
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Default Palette</h3>
                            <p>Enable default palette</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.defaultPalette}
                                onClick={() => {
                                    dispatch({
                                        type: "toggleBool",
                                        payload: {
                                            name: "defaultPalette",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.defaultPalette !==
                            colors_options_from_backend.default
                                .defaultPalette && (
                            <ChangeIndicator
                                defaultValue={
                                    colors_options_from_backend.default
                                        .defaultPalette
                                        ? "On"
                                        : "Off"
                                }
                            />
                        )}
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Default Gradients</h3>
                            <p>Enable default gradients</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.defaultGradients}
                                onClick={() => {
                                    dispatch({
                                        type: "toggleBool",
                                        payload: {
                                            name: "defaultGradients",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.defaultGradients !==
                            colors_options_from_backend.default
                                .defaultGradients && (
                            <ChangeIndicator
                                defaultValue={
                                    colors_options_from_backend.default
                                        .defaultGradients
                                        ? "On"
                                        : "Off"
                                }
                            />
                        )}
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Custom Color</h3>
                            <p>Input colors thats are not in the palette</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.custom}
                                onClick={() => {
                                    dispatch({
                                        type: "toggleBool",
                                        payload: {
                                            name: "custom",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.custom !==
                            colors_options_from_backend.default.custom && (
                            <ChangeIndicator
                                defaultValue={
                                    colors_options_from_backend.default.custom
                                        ? "On"
                                        : "Off"
                                }
                            />
                        )}
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Custom Gradient</h3>
                            <p>Input gradients thats are not in the palette</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.customGradient}
                                onClick={() => {
                                    dispatch({
                                        type: "toggleBool",
                                        payload: {
                                            name: "customGradient",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.customGradient !==
                            colors_options_from_backend.default
                                .customGradient && (
                            <ChangeIndicator
                                defaultValue={
                                    colors_options_from_backend.default
                                        .customGradient
                                        ? "On"
                                        : "Off"
                                }
                            />
                        )}
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Custom Duotone</h3>
                            <p>Enable custom Duotone</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.customDuotone}
                                onClick={() => {
                                    dispatch({
                                        type: "toggleBool",
                                        payload: {
                                            name: "customDuotone",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.customDuotone !==
                            colors_options_from_backend.default
                                .customDuotone && (
                            <ChangeIndicator
                                defaultValue={
                                    colors_options_from_backend.default
                                        .customDuotone
                                        ? "On"
                                        : "Off"
                                }
                            />
                        )}
                    </div>
                </div>
            )}
            {/* Palette */}
            {(visibleOption === "global" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-b bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Global
                        </h3>
                        <button
                            className="p-1 px-3 text-white bg-blue-600 rounded-sm"
                            onClick={() =>
                                dispatch({
                                    type: "new",
                                    category: "global",
                                })
                            }>
                            Add New
                        </button>
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
                                        title={
                                            !color.custom
                                                ? "defaults palette slug changing is not allowed to prevent style breaking"
                                                : "slug"
                                        }
                                        readOnly={!color.custom}
                                        value={color.slug}
                                        className="inline-block !bg-transparent"
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
                            <div className="flex gap-5">
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
                                <div className="flex flex-col gap-1">
                                    <button
                                        title="Duplicate"
                                        onClick={() =>
                                            dispatch({
                                                type: "duplicate",
                                                payload: {
                                                    index: i,
                                                },
                                            })
                                        }>
                                        {/* Duplicate icon */}
                                        <span className="inline-block w-5 h-5 ">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="Outline"
                                                viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <path d="M21.155,3.272,18.871.913A3.02,3.02,0,0,0,16.715,0H12A5.009,5.009,0,0,0,7.1,4H7A5.006,5.006,0,0,0,2,9V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5v-.1A5.009,5.009,0,0,0,22,14V5.36A2.988,2.988,0,0,0,21.155,3.272ZM13,22H7a3,3,0,0,1-3-3V9A3,3,0,0,1,7,6v8a5.006,5.006,0,0,0,5,5h4A3,3,0,0,1,13,22Zm4-5H12a3,3,0,0,1-3-3V5a3,3,0,0,1,3-3h4V4a2,2,0,0,0,2,2h2v8A3,3,0,0,1,17,17Z" />
                                            </svg>
                                        </span>
                                    </button>
                                    {color.custom && (
                                        <button
                                            title="Delete"
                                            onClick={() => {
                                                /**
                                                 * Get delete confirmation
                                                 */
                                                if (
                                                    !confirm(
                                                        "are you sure want to delete this color ?"
                                                    )
                                                )
                                                    return;

                                                dispatch({
                                                    type: "delete",
                                                    payload: {
                                                        index: i,
                                                    },
                                                });
                                            }}>
                                            {/* Remove icon */}
                                            <span className="inline-block w-5 h-5 text-red-600">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    id="Outline"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z" />
                                                    <path d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z" />
                                                    <path d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z" />
                                                </svg>
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default Colors;
