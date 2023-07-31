import { useEffect, useReducer, useRef, useState } from "react";
import Input from "../components/Input.jsx";
import UnitSelect from "../components/UnitSelect.jsx";
import getUnitAndValue from "../util/getUnitAndValue.js";
import { useNotificationUpdate } from "../context/notification.jsx";
import unit from "../util/unit.js";
import Select from "../components/Select.jsx";
import isArrayEqual from "../util/isArrayEqual.js";

/**
 * editor_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    layout: {
        contentSize: getUnitAndValue(
            editor_options_from_backend.current.layout.contentSize
        ),
        wideSize: getUnitAndValue(
            editor_options_from_backend.current.layout.wideSize
        ),
    },
    spacing: {
        spacingScale: editor_options_from_backend.current.spacing.spacingScale,
        units: editor_options_from_backend.current.spacing.units,
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
            layout: {
                contentSize: `${data.layout.contentSize.value}${data.layout.contentSize.unit}`,
                wideSize: `${data.layout.wideSize.value}${data.layout.wideSize.unit}`,
            },
            spacing: {
                spacingScale: {
                    steps: data.spacing.spacingScale.steps,
                },
                units: data.spacing.units,
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
                                        <button className="hidden peer-hover:absolute peer-hover:inline-block z-[1] inset-0 bg-red-500 text-white pointer-events-none">
                                            <i className="fi fi-rr-trash"></i>
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
                </div>
            )}
        </section>
    );
};

export default Editor;
