import { useEffect, useRef, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";
import CSS from "./CSS.jsx";
import postData from "../util/fetch/postData.js";
import getData from "../util/fetch/getData.js";

let prevCSS = "";

export default function Edit({ initData, goBack }) {
    const [data, setData] = useState({
        id: parseInt(initData.id),
        name: initData.file_name,
        status: initData.file_status,
        loadOnAdminDashboard: parseInt(initData.load_on_admin),
        loadOnFrontend: parseInt(initData.load_on_frontend),
    });
    const [css, setCss] = useState(prevCSS);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const initialLoad = useRef(null);

    console.log({ initData });

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
     * Get css content of this file
     */
    useEffect(() => {
        const get_data = async () => {
            const response = await getData({
                action: "__custom_file__content",
                queryString: "&id=" + data.id,
            });

            const response_data = (await response.json()).data;

            if (response.ok) {
                prevCSS = response_data;
                setCss(response_data);
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
     * Update css
     * this function is triggered every time except first save
     */
    const updateCSS = async () => {
        const preparedData = { ...data };

        if (css !== prevCSS) {
            preparedData["content"] = css;
        }

        const response = await postData({
            action: "__update_css",
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

    return (
        <CSS
            data={data}
            setData={setData}
            CSS={css}
            setCSS={setCss}
            onSave={updateCSS}
            onLoading={true}
            goBack={goBack}
        />
    );
}
