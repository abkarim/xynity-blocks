import { useEffect, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";
import CSS from "./CSS.jsx";
import postData from "../util/fetch/postData.js";
import { flushSync } from "react-dom";

let prevCSS = "";

export default function AddNew({ goBack }) {
    const [data, setData] = useState({
        name: "untitled css",
        status: "draft",
        loadOnAdminDashboard: false,
        loadOnFrontend: true,
    });
    const [css, setCss] = useState("");
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [shouldUpdate, setShouldUpdate] = useState(false);

    const initialLoad = useRef(null);

    useHandleUnsavedChanges(hasUnsavedChanges);

    const setNotification = useNotificationUpdate();

    /**
     * Handle unsaved changes
     */
    useEffect(() => {
        if (initialLoad.current === null) {
            initialLoad.current = false;
            return;
        }

        setHasUnsavedChanges(true);
    }, [data, css]);

    /**
     * Update css
     * this function is triggered every time except first save
     */
    const updateCSS = async () => {
        const preparedData = { ...data };

        if (css !== prevCSS) {
            preparedData["content"] = css;
        }

        const response = await postData({
            action: "__update",
            data: preparedData,
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setNotification({
                type: "success",
                text: response_data,
            });

            setHasUnsavedChanges(false);
            prevCSS = css;
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    };

    /**
     * Add css triggered once on first save
     */
    const addCSS = async () => {
        const preparedData = { ...data };
        preparedData["content"] = css;

        const response = await postData({
            action: "__add_new_css",
            data: preparedData,
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setNotification({
                type: "success",
                text: "added successfully",
            });
            setData((prev) => {
                return { ...prev, id: response_data };
            });
            setShouldUpdate(true);
            flushSync(() => {
                setHasUnsavedChanges(false);
            });
            prevCSS = css;
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    };

    return (
        <CSS
            data={data}
            setData={setData}
            CSS={css}
            setCSS={setCss}
            onSave={shouldUpdate ? updateCSS : addCSS}
            onLoading={true}
            goBack={goBack}
        />
    );
}
