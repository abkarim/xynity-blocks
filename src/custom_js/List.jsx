import { useEffect, useState } from "react";
import { useNotificationUpdate } from "../context/notification.jsx";
import useHandleUnsavedChanges from "../hooks/useHandleUnsavedChanges.js";
import { flushSync } from "react-dom";
import getData from "../util/fetch/getData.js";
import deleteData from "../util/fetch/deleteData.js";
import postData from "../util/fetch/postData.js";

function RenderItem({
    item,
    moveToTrash,
    restoreFromTrash = () => {},
    delete_item,
    edit,
}) {
    const { id, file_name: name, file_status: status } = item;
    let backgroundColor = "bg-green-200";

    if (status === "trash") {
        backgroundColor = "bg-red-200";
    } else if (status === "draft") {
        backgroundColor = "bg-white";
    }

    return (
        <div
            className={`flex items-center justify-between p-2 ${backgroundColor} rounded-sm`}>
            <h2 className="text-lg">
                {name} -&nbsp;
                <span title="status" className="text-base italic">
                    {status}
                </span>
            </h2>
            <div className="space-x-2">
                {status === "trash" && (
                    <button
                        title="Restore"
                        onClick={() => restoreFromTrash(id)}>
                        <span className="inline-block w-5 h-5 text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                id="Outline"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <path d="M12,0A11.972,11.972,0,0,0,4,3.073V1A1,1,0,0,0,2,1V4A3,3,0,0,0,5,7H8A1,1,0,0,0,8,5H5a.854.854,0,0,1-.1-.021A9.987,9.987,0,1,1,2,12a1,1,0,0,0-2,0A12,12,0,1,0,12,0Z" />
                                <path d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z" />
                            </svg>
                        </span>
                    </button>
                )}
                <button
                    title={
                        status === "trash"
                            ? "delete permanently"
                            : "Move to trash"
                    }
                    onClick={() => {
                        /**
                         * Get delete confirmation
                         */
                        if (
                            !confirm(
                                `are you sure to ${
                                    status === "trash" ? "delete" : "move"
                                } ${name} ${
                                    status === "trash"
                                        ? "permanently"
                                        : "to trash"
                                }`
                            )
                        )
                            return;

                        status === "trash" ? delete_item(id) : moveToTrash(id);
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
                {status !== "trash" && (
                    <button title="Edit" onClick={() => edit(id)}>
                        {/* Edit icon */}
                        <span className="inline-block w-5 h-5 text-yellow-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor">
                                <g
                                    id="_01_align_center"
                                    data-name="01 align center">
                                    <path d="M22.94,1.06a3.626,3.626,0,0,0-5.124,0L0,18.876V24H5.124L22.94,6.184A3.627,3.627,0,0,0,22.94,1.06ZM4.3,22H2V19.7L15.31,6.4l2.3,2.3ZM21.526,4.77,19.019,7.277l-2.295-2.3L19.23,2.474a1.624,1.624,0,0,1,2.3,2.3Z" />
                                </g>
                            </svg>
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
}

let all_data = [];
let all_trash_data = null;

export default function List({ status, search = "", setEdit }) {
    const [data, setData] = useState([]);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const setNotification = useNotificationUpdate();

    useHandleUnsavedChanges(hasUnsavedChanges);

    /**
     * Fetch data from database
     */
    useEffect(() => {
        const get_data = async () => {
            const response = await getData({
                action: "__get_all_js",
            });

            const response_data = (await response.json()).data;

            if (response.ok) {
                flushSync(() => {
                    all_data = response_data;
                    setData(response_data);
                });
                handleStatus();
            } else {
                setNotification({
                    type: "error",
                    text: "something went wrong, please try again",
                });
            }
        };

        get_data();
    }, []);

    /**
     * Handle search
     */
    useEffect(() => {
        if (search === "") {
            // Get back all data
            setData(all_data);
        } else {
            setData(
                all_data.filter((item) =>
                    item.file_name.toLowerCase().startsWith(search)
                )
            );
        }
    }, [search]);

    /**
     * Handle status
     */
    function handleStatus() {
        if (status === "all") {
            setData(all_data);
        } else if (status === "trash") {
            if (all_trash_data === null) {
                const get_data = async () => {
                    const response = await getData({
                        action: "__get_all_js_trashed",
                    });

                    const response_data = (await response.json()).data;

                    if (response.ok) {
                        all_trash_data = response_data;
                        setData(response_data);
                    } else {
                        setNotification({
                            type: "error",
                            text: "something went wrong, please try again",
                        });
                    }
                };

                get_data();
            } else {
                setData(all_trash_data);
            }
        } else {
            setData(all_data.filter((item) => item.file_status == status));
        }
    }

    /**
     * Handle status
     */
    useEffect(() => {
        handleStatus();
    }, [status]);

    /**
     * Move to trash
     *
     * @param {number} id
     */
    async function moveToTrash(id) {
        flushSync(() => {
            setHasUnsavedChanges(true);
        });

        /**
         * Remove from data
         */
        const newData = data.filter((item) => item.id !== id);
        const [trashedItem] = data.filter((item) => item.id === id);
        setData(newData);
        all_data = newData;

        /**
         * Initial data is null in all_trash_data
         */
        trashedItem.file_status = "trash";
        if (all_trash_data === null) {
            all_trash_data = [trashedItem];
        } else {
            all_trash_data = [trashedItem, ...all_trash_data];
        }

        /**
         * Update in database
         */
        const response = await deleteData({
            action: "__custom_file__move_to_trash",
            queryString: "id=" + id,
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setNotification({
                type: "success",
                text: response_data,
            });

            setHasUnsavedChanges(false);
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    }

    /**
     * Restore from trash
     *
     * @param {number} id
     */
    async function restoreFromTrash(id) {
        flushSync(() => {
            setHasUnsavedChanges(true);
        });

        /**
         * Remove from data
         */
        const newData = data.filter((item) => item.id !== id);
        const [restoredItem] = data.filter((item) => item.id === id);
        setData(newData);

        restoredItem.file_status = "draft";

        all_trash_data = newData;
        all_data.push(restoredItem);

        /**
         * Update in database
         */
        const response = await postData({
            action: "__custom_file__restore_from_trash",
            queryString: "&id=" + id,
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setNotification({
                type: "success",
                text: response_data,
            });

            setHasUnsavedChanges(false);
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    }

    /**
     * Delete permanently
     *
     * @param {number} id
     */
    async function delete_item(id) {
        flushSync(() => {
            setHasUnsavedChanges(true);
        });

        /**
         * Remove from data
         */
        const newData = data.filter((item) => item.id !== id);
        setData(newData);
        all_trash_data = newData;

        /**
         * Update in database
         */
        const response = await deleteData({
            action: "__custom_file__delete",
            queryString: "id=" + id,
        });

        const response_data = (await response.json()).data;
        if (response.ok) {
            setNotification({
                type: "success",
                text: response_data,
            });

            setHasUnsavedChanges(false);
        } else {
            setNotification({
                type: "error",
                text: response_data,
            });
        }
    }

    function edit(id) {
        const [item] = data.filter((item) => item.id === id);
        setEdit({ ...item });
    }

    return (
        <section className="space-y-2">
            {data.map((item, index) => (
                <RenderItem
                    key={index}
                    moveToTrash={moveToTrash}
                    delete_item={delete_item}
                    edit={edit}
                    item={item}
                    restoreFromTrash={restoreFromTrash}
                />
            ))}
            {data.length === 0 && <p className="text-lg">No js found</p>}
        </section>
    );
}
