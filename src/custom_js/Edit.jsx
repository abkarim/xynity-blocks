import { useEffect, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";
import postData from "../util/fetch/postData.js";
import getData from "../util/fetch/getData.js";
import JavaScript from "./JavaScript.jsx";

let prevJavaScript = "";

export default function Edit({ initData, goBack }) {
    const [data, setData] = useState({
        id: parseInt(initData.id),
        name: initData.file_name,
        status: initData.file_status,
        loadOnAdminDashboard: parseInt(initData.load_on_admin),
        loadOnFrontend: parseInt(initData.load_on_frontend),
        loadInFooter: parseInt(initData.load_in_footer),
    });
    const [js, setJS] = useState(prevJavaScript);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
     * Get js content of this file
     */
    useEffect(() => {
        const get_data = async () => {
            const response = await getData({
                action: "__custom_file__content",
                queryString: "&id=" + data.id,
            });

            const response_data = (await response.json()).data;

            if (response.ok) {
                prevJavaScript = response_data;
                setJS(response_data);
            } else {
                setNotification({
                    type: "error",
                    text: response_data,
                });
            }
        };

        get_data();
    }, [initData]);

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

    return (
        <JavaScript
            data={data}
            setData={setData}
            JavaScript={js}
            setJS={setJS}
            onSave={updateJS}
            onLoading={true}
            goBack={goBack}
        />
    );
}
