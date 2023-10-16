import { useEffect, useReducer, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import Select from "../components/input/Select.jsx";
import postData from "../util/fetch/postData.js";
import RadioSwitchInput from "../components/input/RadioSwitchInput.jsx";

const initialState = {
    imageUploads: upload_options_from_backend.imageUploads,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "add":
            return {
                ...state,
                [action.name]: [...state[action.name], action.payload.data],
            };
        case "remove":
            return {
                ...state,
                [action.name]: state[action.name].filter(
                    (item) => item !== action.payload.data
                ),
            };
        default:
            return state;
    }
};

export default function Uploads() {
    const initialLoad = useRef(null);
    const errorFound = useRef(null);

    const [data, dispatch] = useReducer(reducer, initialState);

    const [visibleOption, setVisibleOption] = useState("*");

    const setNotification = useNotificationUpdate();

    console.log({ data });

    useEffect(() => {
        if (initialLoad.current === null) {
            initialLoad.current = false;
            return;
        }

        // Update data
        const update = async () => {
            const response = await postData({
                action: "__image_upload_options_update",
                data: data.imageUploads,
            });
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
    }, [data.imageUploads]);

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
                    <option value="image">Image</option>
                </Select>
            </div>
            {/* Image */}
            {(visibleOption === "image" || visibleOption === "*") && (
                <div>
                    <h3 className="py-1 pl-5 text-sm font-bold text-gray-600 uppercase border-b bg-gray-50">
                        Image
                    </h3>
                    <div className="relative flex items-start justify-between w-full p-5 border-b">
                        <div>
                            <h3 className="text-xl">SVG</h3>
                            <p>Enable svg upload</p>
                        </div>
                        <fieldset>
                            <RadioSwitchInput
                                selected={data.imageUploads.includes("svg")}
                                onClick={() => {
                                    dispatch({
                                        name: "imageUploads",
                                        type: data.imageUploads.includes("svg")
                                            ? "remove"
                                            : "add",
                                        payload: {
                                            data: "svg",
                                        },
                                    });
                                }}
                            />
                        </fieldset>
                    </div>
                </div>
            )}
        </section>
    );
}
