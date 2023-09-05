import { useEffect, useReducer, useRef, useState } from "react";
import Select from "../components/Select.jsx";
import { useNotificationUpdate } from "../context/notification.jsx";
import RadioSwitchInput from "../components/RadioSwitchInput.jsx";
import getUnitAndValue from "../util/getUnitAndValue.js";
import Input from "../components/Input.jsx";
import UnitSelect from "../components/UnitSelect.jsx";
import TextInput from "../components/InputText.jsx";
import FontStretchInput from "../components/font/FontStretchInput.jsx";
import FontStyleInput from "../components/font/FontStyleInput.jsx";
import FontWeightInput from "../components/font/FontWeightInput.jsx";

/**
 * typography_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    ...typography_options_from_backend.default,
    ...typography_options_from_backend.current,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "size":
            const prevSize = getUnitAndValue(
                state[action.category][action.payload.index].size
            );

            if (action.payload.ref === "value") {
                state[action.category][
                    action.payload.index
                ].size = `${action.payload.data}${prevSize.unit}`;
            } else {
                state[action.category][
                    action.payload.index
                ].size = `${prevSize.value}${action.payload.data}`;
            }

            return { ...state };

        case "name":
            state[action.category][action.payload.index].name =
                action.payload.value;
            return { ...state };

        case "family":
            state.fontFamilies[action.payload.index].fontFamily =
                action.payload.data;
            return { ...state };

        case "face":
            state.fontFamilies[action.payload.index].fontFace[
                action.payload.fIndex
            ][action.payload.name] = action.payload.data;
            return { ...state };

        case "slug":
            state[action.category][action.payload.index].slug =
                action.payload.data;
            return { ...state };

        case "delete":
            const targetItem = state[action.category][action.payload.index];
            const newData = state[action.category].filter(
                (item) => item !== targetItem
            );
            return { ...state, [action.category]: newData };

        case "duplicate":
            const copiedItem = structuredClone(
                state[action.category][action.payload.index]
            );
            copiedItem.custom = true;
            copiedItem.name = copiedItem.name + " - duplicate";
            copiedItem.slug = copiedItem.slug + "2";
            state[action.category].splice(
                action.payload.index + 1,
                0,
                copiedItem
            );
            return { ...state };

        case "new":
            const newSize = {
                fluid: false,
                name: "New size",
                size: "1rem",
                slug: "new-size",
                custom: true,
            };

            const newFamily = {
                fluid: false,
                name: "New font",
                size: "",
                slug: "new-font",
                custom: true,
            };

            if (action.category === "fontSizes")
                state.fontSizes.unshift(newSize);

            if (action.category === "fontFamilies")
                state.fontFamilies.unshift(newFamily);

            return { ...state };

        case "toggleBool":
            state[action.payload.name] = !state[action.payload.name];
            return { ...state };

        case "fluidToggle":
            let data = {
                min: "0.875rem",
                max: "1rem",
            };

            if (state.fontSizes[action.payload.index].fluid !== false) {
                data = false;
            }

            state.fontSizes[action.payload.index].fluid = data;

            return { ...state };

        case "fluid":
            let minData = getUnitAndValue(
                state.fontSizes[action.payload.index].fluid.min
            );
            let maxData = getUnitAndValue(
                state.fontSizes[action.payload.index].fluid.max
            );

            const finalData = state.fontSizes[action.payload.index].fluid;

            if (action.payload.type === "min") {
                if (action.payload.ref === "value") {
                    finalData.min = `${action.payload.data}${minData.unit}`;
                }
                if (action.payload.ref === "unit") {
                    finalData.min = `${minData.value}${action.payload.data}`;
                }
            }

            if (action.payload.type === "max") {
                if (action.payload.ref === "value") {
                    finalData.max = `${action.payload.data}${maxData.unit}`;
                }
                if (action.payload.ref === "unit") {
                    finalData.max = `${maxData.value}${action.payload.data}`;
                }
            }

            state.fontSizes[action.payload.index].fluid = finalData;

            return { ...state };

        default:
            return state;
    }
};

const ToggleBoolComponent = ({ data, name, title, description, dispatch }) => {
    return (
        <div className="relative flex items-start justify-between w-full p-5 border-b">
            <div>
                <h3 className="text-xl">{title}</h3>
                <p>{description}</p>
            </div>
            <fieldset>
                <RadioSwitchInput
                    selected={data[name]}
                    onClick={() => {
                        dispatch({
                            type: "toggleBool",
                            payload: {
                                name,
                            },
                        });
                    }}
                />
            </fieldset>
        </div>
    );
};

const Typography = () => {
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
            customFontSize: data.customFontSize,
            fontStyle: data.fontStyle,
            fontWeight: data.fontWeight,
            fluid: data.fluid,
            letterSpacing: data.letterSpacing,
            lineHeight: data.lineHeight,
            textColumns: data.textColumns,
            textDecoration: data.textDecoration,
            writingMode: data.writingMode,
            textTransform: data.textTransform,
            dropCap: data.dropCap,
            fontSizes: data.fontSizes,
            fontFamilies: data.fontFamilies,
        };

        // Update data
        const update = async () => {
            const response = await fetch(
                `${
                    plugin_info_from_backend.ajax_url
                }?action=${encodeURIComponent(
                    "xynity_blocks_typography_update"
                )}`,
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
                    <option value="settings">Settings</option>
                    <option value="fontSizes">Font Sizes</option>
                    <option value="fontFamilies">Font Families</option>
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
                    <ToggleBoolComponent
                        data={data}
                        name="customFontSize"
                        title="Custom font size"
                        description="Enable custom font size"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="fontStyle"
                        title="Font Style"
                        description="Enable font style"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="fontWeight"
                        title="Font weight"
                        description="Enable font weight"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="fluid"
                        title="fluid"
                        description="Enable fluid"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="letterSpacing"
                        title="Letter Spacing"
                        description="Enable letter spacing"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="lineHeight"
                        title="Line Height"
                        description="Enable Line height"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="textColumns"
                        title="Text Columns"
                        description="Enable Text Columns"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="textDecoration"
                        title="Text Decoration"
                        description="Enable Text Decoration"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="writingMode"
                        title="Writing Mode"
                        description="Enable writing mode"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="textTransform"
                        title="Text Transform"
                        description="Enable text transform"
                        dispatch={dispatch}
                    />
                    <ToggleBoolComponent
                        data={data}
                        name="dropCap"
                        title="Drop Cap"
                        description="Enable drop cap"
                        dispatch={dispatch}
                    />
                </div>
            )}
            {/* Font Sizes */}
            {(visibleOption === "fontSizes" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-b bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Font Sizes
                        </h3>
                        <button
                            className="p-1 px-3 text-white bg-blue-600 rounded-sm"
                            onClick={() =>
                                dispatch({
                                    type: "new",
                                    category: "fontSizes",
                                })
                            }>
                            Add New
                        </button>
                    </div>
                    {data.fontSizes.map((font, i) => (
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
                                                category: "fontSizes",
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
                                        value={font.name}
                                        placeholder="Type name"
                                    />
                                    <input
                                        title={
                                            !font.custom
                                                ? "defaults sizes slug changing is not allowed to prevent style breaking"
                                                : "slug"
                                        }
                                        readOnly={!font.custom}
                                        value={font.slug}
                                        className="inline-block !bg-transparent"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            dispatch({
                                                type: "slug",
                                                category: "fontSizes",
                                                payload: {
                                                    index: i,
                                                    data: value.trim(),
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
                                    <fieldset className="flex items-stretch w-48">
                                        <Input
                                            className="!rounded-tr-none !rounded-br-none !border-r-0"
                                            value={
                                                getUnitAndValue(font.size).value
                                            }
                                            onInput={(e) =>
                                                dispatch({
                                                    type: "size",
                                                    category: "fontSizes",
                                                    payload: {
                                                        ref: "value",
                                                        index: i,
                                                        data: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                        <UnitSelect
                                            className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                            value={
                                                getUnitAndValue(font.size).unit
                                            }
                                            onChange={(e) =>
                                                dispatch({
                                                    type: "size",
                                                    category: "fontSizes",
                                                    payload: {
                                                        ref: "unit",
                                                        index: i,
                                                        data: e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </fieldset>
                                    <div className="flex items-center justify-between gap-2 mt-3">
                                        <h6 className="text-sm font-bold">
                                            Fluid
                                        </h6>
                                        <RadioSwitchInput
                                            smaller={true}
                                            selected={font.fluid !== false}
                                            onClick={() => {
                                                dispatch({
                                                    type: "fluidToggle",
                                                    payload: {
                                                        index: i,
                                                    },
                                                });
                                            }}
                                        />
                                    </div>
                                    {font.fluid !== false && (
                                        <div className="mt-2 space-y-2">
                                            <div>
                                                <h6>Minimum</h6>
                                                <fieldset className="flex items-stretch w-48">
                                                    <Input
                                                        className="!rounded-tr-none !rounded-br-none !border-r-0"
                                                        value={
                                                            getUnitAndValue(
                                                                font.fluid.min
                                                            ).value
                                                        }
                                                        onInput={(e) =>
                                                            dispatch({
                                                                type: "fluid",
                                                                payload: {
                                                                    index: i,
                                                                    ref: "value",
                                                                    type: "min",
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <UnitSelect
                                                        className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                                        value={
                                                            getUnitAndValue(
                                                                font.fluid.min
                                                            ).unit
                                                        }
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "fluid",
                                                                payload: {
                                                                    index: i,
                                                                    ref: "unit",
                                                                    type: "min",
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </fieldset>
                                            </div>
                                            <div>
                                                <h6>Maximum</h6>
                                                <fieldset className="flex items-stretch w-48">
                                                    <Input
                                                        className="!rounded-tr-none !rounded-br-none !border-r-0"
                                                        value={
                                                            getUnitAndValue(
                                                                font.fluid.max
                                                            ).value
                                                        }
                                                        onInput={(e) =>
                                                            dispatch({
                                                                type: "fluid",
                                                                payload: {
                                                                    index: i,
                                                                    ref: "value",
                                                                    type: "max",
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                    <UnitSelect
                                                        className="!py-[2.5px] !rounded-tl-none !rounded-bl-none"
                                                        value={
                                                            getUnitAndValue(
                                                                font.fluid.max
                                                            ).unit
                                                        }
                                                        onChange={(e) =>
                                                            dispatch({
                                                                type: "fluid",
                                                                payload: {
                                                                    index: i,
                                                                    ref: "unit",
                                                                    type: "max",
                                                                    data: e
                                                                        .target
                                                                        .value,
                                                                },
                                                            })
                                                        }
                                                    />
                                                </fieldset>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        title="Duplicate"
                                        onClick={() =>
                                            dispatch({
                                                type: "duplicate",
                                                category: "fontSizes",
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
                                    {font.custom && (
                                        <button
                                            title="Delete"
                                            onClick={() => {
                                                /**
                                                 * Get delete confirmation
                                                 */
                                                if (
                                                    !confirm(
                                                        "are you sure want to delete this font ?"
                                                    )
                                                )
                                                    return;

                                                dispatch({
                                                    type: "delete",
                                                    category: "fontSizes",
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
            {/* Font families */}
            {(visibleOption === "fontFamilies" || visibleOption === "*") && (
                <div>
                    <div className="flex items-center justify-between px-5 py-1 border-b bg-gray-50">
                        <h3 className="text-sm font-bold text-gray-600 uppercase ">
                            Font Families
                        </h3>
                        {/* TODO  */}
                        {/* <button
                            className="p-1 px-3 text-white bg-blue-600 rounded-sm"
                            onClick={() =>
                                dispatch({
                                    type: "new",
                                    category: "fontFamilies",
                                })
                            }>
                            Add New
                        </button> */}
                    </div>
                    {data.fontFamilies.map((font, i) => (
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
                                                category: "fontFamilies",
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
                                        value={font.name}
                                        placeholder="Type name"
                                    />
                                    <input
                                        title={
                                            !font.custom
                                                ? "defaults sizes slug changing is not allowed to prevent style breaking"
                                                : "slug"
                                        }
                                        readOnly={!font.custom}
                                        value={font.slug}
                                        className="inline-block !bg-transparent"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            dispatch({
                                                type: "slug",
                                                category: "fontFamilies",
                                                payload: {
                                                    index: i,
                                                    data: value.trim(),
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
                                    <br />
                                    <input
                                        title={"font family"}
                                        value={font.fontFamily}
                                        className="inline-block !bg-transparent"
                                        onInput={(e) => {
                                            const value = e.target.value;
                                            dispatch({
                                                type: "family",
                                                payload: {
                                                    index: i,
                                                    data: value,
                                                },
                                            });

                                            if (value.trim() === "") {
                                                errorFound.current = true;
                                                return setNotification({
                                                    type: "error",
                                                    text: "family cannot be empty, please enter a slug",
                                                });
                                            } else {
                                                errorFound.current = false;
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-5">
                                <div className="space-y-2">
                                    <h2 className="font-bold">Font faces</h2>
                                    <div className="flex items-center justify-between gap-2">
                                        <h6>Stretch</h6>
                                        <h6>Style</h6>
                                        <h6>Weight</h6>
                                    </div>
                                    {font.fontFace?.map((face, index) => (
                                        <div key={index}>
                                            <FontStretchInput
                                                value={face.fontStretch}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "face",
                                                        payload: {
                                                            index: i,
                                                            fIndex: index,
                                                            name: "fontStretch",
                                                            data: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FontStyleInput
                                                value={face.fontStyle}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "face",
                                                        payload: {
                                                            index: i,
                                                            fIndex: index,
                                                            name: "fontStyle",
                                                            data: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                            <FontWeightInput
                                                value={face.fontWeight}
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: "face",
                                                        payload: {
                                                            index: i,
                                                            fIndex: index,
                                                            name: "fontWeight",
                                                            data: e.target
                                                                .value,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button
                                        title="Duplicate"
                                        onClick={() =>
                                            dispatch({
                                                type: "duplicate",
                                                category: "fontFamilies",
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
                                    {font.custom && (
                                        <button
                                            title="Delete"
                                            onClick={() => {
                                                /**
                                                 * Get delete confirmation
                                                 */
                                                if (
                                                    !confirm(
                                                        "are you sure want to delete this font ?"
                                                    )
                                                )
                                                    return;

                                                dispatch({
                                                    type: "delete",
                                                    category: "fontFamilies",
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

export default Typography;
