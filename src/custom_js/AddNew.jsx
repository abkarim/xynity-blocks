import { useEffect, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";
import postData from "../util/fetch/postData.js";
import { flushSync } from "react-dom";
import JavaScript from "./JavaScript.jsx";

let prevJavaScript = "";

export default function AddNew({ goBack }) {
    const [data, setData] = useState({
        name: "untitled js",
        status: "draft",
        loadOnAdminDashboard: false,
        loadOnFrontend: true,
        loadInFooter: true,
    });
    const [js, setJS] = useState("");
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
    }, [data, js]);

    /**
     * Update js
     * this function is triggered every time except first save
     */
    const updateJS = async () => {
        const preparedData = { ...data };

        if (js !== prevJavaScript) {
            preparedData["content"] = js;
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
            prevJavaScript = js;
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    };

    /**
     * Add js triggered once on first save
     */
    const addJS = async () => {
        const preparedData = { ...data };
        preparedData["content"] = js;

        const response = await postData({
            action: "__add_new_js",
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
            prevJavaScript = js;
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    };

    return (
        <JavaScript
            data={data}
            setData={setData}
            JavaScript={js}
            setJS={setJS}
            onSave={shouldUpdate ? updateJS : addJS}
            onLoading={true}
            goBack={goBack}
        />
    );
}
