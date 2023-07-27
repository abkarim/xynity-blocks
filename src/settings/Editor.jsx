import { useEffect, useReducer, useRef, useState } from "react";
import Input from "../components/Input.jsx";
import UnitSelect from "../components/UnitSelect.jsx";
import getUnitAndValue from "../util/getUnitAndValue.js";
import { useNotificationUpdate } from "../context/notification.jsx";

console.log({ editor_options_from_backend, plugin_info_from_backend });
console.log(getUnitAndValue(editor_options_from_backend.current.contentSize));

/**
 * editor_options_from_backend is localized by WordPress
 * from: Dashboard->load_javascript()
 */
const initialState = {
    contentSize: getUnitAndValue(
        editor_options_from_backend.current.contentSize
    ),
    wideSize: getUnitAndValue(editor_options_from_backend.current.wideSize),
};

const reducer = (state, action) => {
    switch (action.type) {
        case "value":
            return {
                ...state,
                [action.payload.name]: {
                    ...state[action.payload.name],
                    value: action.payload.value * 1,
                },
            };

        case "unit":
            return {
                ...state,
                [action.payload.name]: {
                    ...state[action.payload.name],
                    unit: action.payload.value,
                },
            };

        default:
            return state;
    }
};

const Option = ({ title, description, data, dispatch, inputName }) => {
    const defaultData = editor_options_from_backend.default[inputName];
    const currentData = `${data[inputName].value}${data[inputName].unit}`;

    return (
        <div className="relative flex items-start justify-between w-full p-5 border-b">
            <div>
                <h3 className="text-xl">{title}</h3>
                <p>{description}</p>
            </div>
            <fieldset className="flex items-center w-48">
                <Input
                    className="rounded-tl-none rounded-bl-none"
                    value={data[inputName].value}
                    name={inputName}
                    onInput={(e) =>
                        dispatch({
                            type: "value",
                            payload: {
                                name: e.target.name,
                                value: e.target.value,
                            },
                        })
                    }
                />
                <UnitSelect
                    value={data[inputName].unit}
                    name={inputName}
                    onChange={(e) =>
                        dispatch({
                            type: "unit",
                            payload: {
                                name: e.target.name,
                                value: e.target.value,
                            },
                        })
                    }
                />
            </fieldset>
            {currentData !== defaultData && (
                <>
                    <div className="absolute inline-block w-3 h-3 bg-yellow-300 rounded-full cursor-pointer peer top-2 right-1 aspect-square"></div>
                    <i className="absolute hidden text-3xl text-orange-500 peer-hover:inline-block -right-1 -top-3 fi fi-rr-caret-down"></i>
                    <p className="absolute hidden p-2 text-white bg-orange-500 rounded-sm peer-hover:block -right-3 -top-8">
                        (Edited) Default value was
                        <span className="font-bold">{defaultData}</span>
                    </p>
                </>
            )}
        </div>
    );
};

const Editor = () => {
    const initialLoad = useRef(null);
    const [data, dispatch] = useReducer(reducer, initialState);

    const setNotification = useNotificationUpdate();

    useEffect(() => {
        if (initialLoad.current === null) {
            initialLoad.current = false;
            return;
        }

        const requestData = {
            contentSize: `${data.contentSize.value}${data.contentSize.unit}`,
            wideSize: `${data.wideSize.value}${data.wideSize.unit}`,
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
            <div>
                <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-b">
                    Layout
                </h3>
                <Option
                    title="Default Content Width"
                    description="Container Block's default Content Width"
                    dispatch={dispatch}
                    data={data}
                    inputName="contentSize"
                />
                <Option
                    title="Default Wide Size"
                    description="Default width size for wide blocks"
                    dispatch={dispatch}
                    data={data}
                    inputName="wideSize"
                />
            </div>
        </section>
    );
};

export default Editor;
