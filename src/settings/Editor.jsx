import { useEffect, useReducer, useRef, useState } from "react";
import Input from "../components/Input.jsx";
import UnitSelect from "../components/UnitSelect.jsx";
import getUnitAndValue from "../util/getUnitAndValue.js";
import { useNotificationUpdate } from "../context/notification.jsx";
import unit from "../util/unit.js";
import Select from "../components/Select.jsx";
import isArrayEqual from "../util/isArrayEqual.js";
import RadioSwitchInput from "../components/RadioSwitchInput.jsx";

/**
 * editor_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    ...editor_options_from_backend.current,
    layout: {
        contentSize: getUnitAndValue(
            editor_options_from_backend.current.layout.contentSize
        ),
        wideSize: getUnitAndValue(
            editor_options_from_backend.current.layout.wideSize
        ),
    },
};

const reducer = (state, action) => {
    switch (action.type) {
        case "value":
            return {
                ...state,
                [action.category]: {
                    ...state[action.category],
                    [action.payload.name]: {
                        ...state[action.category][action.payload.name],
                        value: action.payload.value * 1,
                    },
                },
            };

        case "unit":
            return {
                ...state,
                [action.category]: {
                    ...state[action.category],
                    [action.payload.name]: {
                        ...state[action.category][action.payload.name],
                        unit: action.payload.value,
                    },
                },
            };

        case "raw":
            return {
                ...state,
                [action.category]: {
                    ...state[action.category],
                    [action.payload.name]: action.payload.data,
                },
            };

        default:
            return state;
    }
};

const ChangeIndicator = ({ defaultValue }) => {
    return (
        <>
            <div className="absolute inline-block w-3 h-3 p-1 bg-yellow-300 rounded-full cursor-pointer peer top-2 right-1 aspect-square"></div>
            <i className="absolute hidden text-3xl text-orange-500 pointer-events-none peer-hover:inline-block -right-1 -top-3 fi fi-rr-caret-down"></i>
            <p className="absolute hidden p-2 text-white bg-orange-500 rounded-sm pointer-events-none peer-hover:block -right-3 -top-8">
                (Edited) Default value was&nbsp;
                <span className="font-bold">{defaultValue}</span>
            </p>
        </>
    );
};

const Option = ({
    title,
    description,
    data,
    category,
    dispatch,
    inputName,
}) => {
    const defaultData =
        editor_options_from_backend.default[category][inputName];
    const currentData = `${data[category][inputName].value}${data[category][inputName].unit}`;

    return (
        <div className="relative flex items-start justify-between w-full p-5 border-b">
            <div>
                <h3 className="text-xl">{title}</h3>
                <p>{description}</p>
            </div>
            <fieldset className="flex items-center w-48">
                <Input
                    className="rounded-tl-none rounded-bl-none"
                    value={data[category][inputName].value}
                    name={inputName}
                    onInput={(e) =>
                        dispatch({
                            type: "value",
                            category: category,
                            payload: {
                                name: e.target.name,
                                value: e.target.value,
                            },
                        })
                    }
                />
                <UnitSelect
                    value={data[category][inputName].unit}
                    name={inputName}
                    onChange={(e) =>
                        dispatch({
                            type: "unit",
                            category: category,
                            payload: {
                                name: e.target.name,
                                value: e.target.value,
                            },
                        })
                    }
                />
            </fieldset>
            {currentData !== defaultData && (
                <ChangeIndicator defaultValue={defaultData} />
            )}
        </div>
    );
};

const Editor = () => {
    const initialLoad = useRef(null);
    const [data, dispatch] = useReducer(reducer, initialState);

    const [visibleOption, setVisibleOption] = useState("*");

    console.log({ data });

    const setNotification = useNotificationUpdate();

    useEffect(() => {
        if (initialLoad.current === null) {
            initialLoad.current = false;
            return;
        }

        const requestData = {
            ...data,
            layout: {
                contentSize: `${data.layout.contentSize.value}${data.layout.contentSize.unit}`,
                wideSize: `${data.layout.wideSize.value}${data.layout.wideSize.unit}`,
            },
        };

        // Update data
        const update = async () => {
            const response = await fetch(
                `${
                    plugin_info_from_backend.ajax_url
                }?action=${encodeURIComponent(
                    "xynity_blocks_settings_update"
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
                    <option value="layout">Layout</option>
                    <option value="spacing">Spacing</option>
                </Select>
            </div>
            {/* Layout */}
            {(visibleOption === "layout" || visibleOption === "*") && (
                <div>
                    <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-y bg-gray-50">
                        Layout
                    </h3>
                    <Option
                        title="Default Content Width"
                        description="Container Block's default Content Width"
                        dispatch={dispatch}
                        data={data}
                        category="layout"
                        inputName="contentSize"
                    />
                    <Option
                        title="Default Wide Size"
                        description="Default width size for wide blocks"
                        dispatch={dispatch}
                        data={data}
                        category="layout"
                        inputName="wideSize"
                    />
                </div>
            )}
            {/* Spacing */}
            {(visibleOption === "spacing" || visibleOption === "*") && (
                <div>
                    <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-b bg-gray-50">
                        Spacing
                    </h3>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Spacing Scale</h3>
                            <p>
                                Scaling space used in slider increment or
                                decrement of sizes
                            </p>
                        </div>
                        <fieldset className="flex items-center w-48">
                            <Input
                                className="rounded-tl-none rounded-bl-none"
                                value={data.spacing.spacingScale.steps}
                                name="spacingScale"
                                onInput={(e) =>
                                    dispatch({
                                        type: "raw",
                                        category: "spacing",
                                        payload: {
                                            name: e.target.name,
                                            data: {
                                                steps: e.target.value * 1,
                                            },
                                        },
                                    })
                                }
                            />
                        </fieldset>
                        {data.spacing.spacingScale.steps !==
                            editor_options_from_backend.default.spacing
                                .spacingScale.steps && (
                            <ChangeIndicator
                                defaultValue={
                                    editor_options_from_backend.default.spacing
                                        .spacingScale.steps
                                }
                            />
                        )}
                    </div>
                    <div className="relative w-full p-5 border-b">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-xl">Units</h3>
                                <p>Available spacing units in editor</p>
                            </div>
                            <fieldset className="flex items-center justify-end w-48">
                                {/**
                                 * Add selected value in units
                                 * placeholder value is ""
                                 * validate it
                                 */}
                                <Select
                                    value=""
                                    onChange={(e) => {
                                        const currentValue = e.target.value;
                                        if (currentValue) {
                                            dispatch({
                                                type: "raw",
                                                category: "spacing",
                                                payload: {
                                                    name: "units",
                                                    data: [
                                                        ...data.spacing.units,
                                                        currentValue,
                                                    ],
                                                },
                                            });
                                        }
                                    }}>
                                    <option value="">add new</option>
                                    {/**
                                     * Get all units from unit() function
                                     * don't add that unit that's already included in
                                     * data.spacing.units
                                     */}
                                    {unit()
                                        .filter(
                                            (item) =>
                                                !data.spacing.units.includes(
                                                    item.value
                                                )
                                        )
                                        .map((item, i) => {
                                            return (
                                                <option
                                                    key={i}
                                                    value={item.value}>
                                                    {item.name}
                                                </option>
                                            );
                                        })}
                                </Select>
                            </fieldset>
                        </div>
                        <div className="flex items-center justify-start gap-4 mt-3">
                            {data.spacing.units.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="relative overflow-hidden rounded">
                                        <span
                                            className="inline-block p-2 px-3 rounded cursor-pointer bg-slate-200 peer"
                                            onClick={() => {
                                                /**
                                                 * If current option is the last option
                                                 * option should not be deleted
                                                 * it will cause problem in editor
                                                 */
                                                if (
                                                    data.spacing.units
                                                        .length === 1
                                                ) {
                                                    setNotification({
                                                        type: "error",
                                                        text: "this is the last unit left, and it cannot be removed",
                                                    });
                                                    return;
                                                }

                                                /**
                                                 * Remove current value
                                                 */
                                                dispatch({
                                                    type: "raw",
                                                    category: "spacing",
                                                    payload: {
                                                        name: "units",
                                                        data: data.spacing.units.filter(
                                                            (i) => i !== item
                                                        ),
                                                    },
                                                });
                                            }}>
                                            {item.toUpperCase()}
                                        </span>
                                        <button className="hidden peer-hover:absolute peer-hover:inline-flex z-[1] inset-0 bg-red-500 text-white pointer-events-none items-center justify-center">
                                            {/* Remove icon */}
                                            <span className="inline-block w-5 h-5 ">
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
                                    </div>
                                );
                            })}
                        </div>
                        {!isArrayEqual(
                            data.spacing.units,
                            editor_options_from_backend.default.spacing.units
                        ) && (
                            <ChangeIndicator
                                defaultValue={editor_options_from_backend.default.spacing.units.join(
                                    ", "
                                )}
                            />
                        )}
                    </div>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">Custom size</h3>
                            <p>Enable or disable custom size input</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.spacing.customSpacingSize}
                                onClick={() => {
                                    dispatch({
                                        type: "raw",
                                        category: "spacing",
                                        payload: {
                                            name: "customSpacingSize",
                                            data: !data.spacing
                                                .customSpacingSize,
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                        {data.spacing.customSpacingSize !==
                            editor_options_from_backend.default.spacing
                                .customSpacingSize && (
                            <ChangeIndicator
                                defaultValue={`${
                                    editor_options_from_backend.default.spacing
                                        .customSpacingSize
                                        ? "On"
                                        : "Off"
                                }`}
                            />
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default Editor;
