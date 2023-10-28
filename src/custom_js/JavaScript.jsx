import Select from "../components/input/Select.jsx";
import RadioSwitchInput from "../components/input/RadioSwitchInput.jsx";
import TextInput from "../components/input/InputText.jsx";
import SaveButton from "../components/button/Save.jsx";
import deleteData from "../util/fetch/deleteData.js";
import JavaScriptInput from "../components/input/JS.jsx";

export default function JavaScript({
    data,
    JavaScript,
    setJS,
    setData,
    onSave,
    goBack = () => {},
}) {
    /**
     * Move to trash
     *
     * @param {number} id
     */
    async function moveToTrash(id) {
        await deleteData({
            action: "__custom_file__move_to_trash",
            queryString: "id=" + id,
        });

        // Go back
        goBack();
    }

    return (
        <section className="p-5 bg-white rounded-sm">
            <div className="flex items-center justify-between gap-5 mb-5">
                <TextInput
                    value={data.name}
                    className="!text-lg !border "
                    onInput={(e) =>
                        setData((prev) => {
                            return { ...prev, name: e.target.value };
                        })
                    }
                />
                <div className="flex items-center justify-between gap-2">
                    <button
                        title="Move to trash"
                        onClick={() => {
                            /**
                             * Get delete confirmation
                             */
                            if (
                                !confirm(
                                    `are you sure to move ${data.name} to trash`
                                )
                            )
                                return;

                            moveToTrash(data.id || 0);
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
                    <SaveButton className="text-lg" onClick={onSave}>
                        Save
                    </SaveButton>
                </div>
            </div>
            <div className="relative w-full border-b">
                <section className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Status</h3>
                    <Select
                        value={data.status}
                        onChange={(e) =>
                            setData((prev) => {
                                return { ...prev, status: e.target.value };
                            })
                        }>
                        <option value="draft">Draft</option>
                        <option value="published">Publish</option>
                    </Select>
                </section>
                <section className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Load on Frontend</h3>
                    <RadioSwitchInput
                        onClick={() =>
                            setData((prev) => {
                                return {
                                    ...prev,
                                    loadOnFrontend: !prev.loadOnFrontend,
                                };
                            })
                        }
                        selected={data.loadOnFrontend}
                    />
                </section>
                <section className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Load on Admin Dashboard</h3>
                    <RadioSwitchInput
                        onClick={() =>
                            setData((prev) => {
                                return {
                                    ...prev,
                                    loadOnAdminDashboard:
                                        !prev.loadOnAdminDashboard,
                                };
                            })
                        }
                        selected={data.loadOnAdminDashboard}
                    />
                </section>
                <section className="flex items-center justify-between mb-4">
                    <h3 className="text-xl">Load in Footer</h3>
                    <RadioSwitchInput
                        onClick={() =>
                            setData((prev) => {
                                return {
                                    ...prev,
                                    loadInFooter: !prev.loadInFooter,
                                };
                            })
                        }
                        selected={data.loadInFooter}
                    />
                </section>
                <JavaScriptInput
                    defaultValue={JavaScript}
                    onChange={(value) => setJS(value)}
                />
            </div>
        </section>
    );
}
