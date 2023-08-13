import { useNotificationUpdate } from "../context/notification.jsx";

const ResetHandler = ({ name, title, description, update }) => {
    return (
        <div className="relative flex items-start justify-between w-full p-5 border-b">
            <div>
                <h3 className="text-xl">{title}</h3>
                <p>{description}</p>
            </div>
            <fieldset>
                <button
                    className="flex items-center gap-2 p-2 px-3 font-bold text-red-500 rounded shadow bg-slate-100 text"
                    onClick={() => {
                        if (!confirm(`are you sure want to reset "${title}"`))
                            return;
                        update(name);
                    }}>
                    Reset
                    <span className="inline-block w-5 h-full">
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
            </fieldset>
        </div>
    );
};

const Reset = () => {
    const setNotification = useNotificationUpdate();

    // Update data
    const update = async (name) => {
        const response = await fetch(
            `${plugin_info_from_backend.ajax_url}?action=${encodeURIComponent(
                "xynity_blocks_reset_option"
            )}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-WP-Nonce": plugin_info_from_backend.ajax_nonce,
                },
                credentials: "same-origin",
                body: JSON.stringify({
                    name,
                }),
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

    return (
        <section>
            <div className="flex items-center justify-between px-5 py-2 bg-slate-100">
                <h2 className="text-sm font-bold text-gray-600 uppercase">
                    Reset
                </h2>
            </div>
            <ResetHandler
                title="Editor Option"
                description="Reset editor options"
                update={update}
                name="settings"
            />
            <ResetHandler
                title="Color"
                update={update}
                name="colors"
                description="Reset color options"
            />
            <ResetHandler
                update={update}
                name="typography"
                title="Typography"
                description="Reset typography options"
            />
            <ResetHandler
                title="Shadows"
                update={update}
                name="shadows"
                description="Reset shadows option"
            />
        </section>
    );
};

export default Reset;
