import { Suspense, lazy, useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
const Editor = lazy(() => import("./Editor.jsx"));
const Colors = lazy(() => import("./Colors.jsx"));

console.log({
    editor_options_from_backend,
    plugin_info_from_backend,
    colors_options_from_backend,
});

const SideBar = ({ currentOption, setOption }) => {
    const Option = ({ targetOption, children }) => {
        return (
            <button
                onClick={() => setOption(targetOption)}
                className={`px-4 text-base border-l-4 border-[rgba(0,0,0,0)] hover:border-gray-300  ${
                    targetOption === currentOption &&
                    "border-blue-400 hover:!border-blue-400 text-blue-600"
                } py-2 transition-all duration-200 w-80 text-left flex items-center gap-2`}>
                {children}
            </button>
        );
    };

    return (
        <aside className="flex flex-col items-start gap-2 py-4 border-r">
            <Option targetOption="editor">
                <i className="inline-block mt-1 fi fi-rr-magic-wand"></i> Editor
                Options
            </Option>
            <Option targetOption="colors">
                <i className="inline-block mt-1 fi fi-rr-palette"></i>Colors
            </Option>
        </aside>
    );
};

const Settings = () => {
    const [option, setOption] = useState(getSearchParam("setting") || "editor");

    const handleOption = (option) => {
        appendSearchParam("setting", option);
        setOption(option);
    };

    return (
        <section>
            <h1 className="text-2xl font-bold">Settings</h1>
            <div className="flex justify-start mt-5 bg-white rounded-md shadow-md">
                <SideBar currentOption={option} setOption={handleOption} />
                <figure className="w-full">
                    <Suspense fallback={<h1>Loading...</h1>}>
                        {option === "editor" && <Editor />}
                        {option === "colors" && <Colors />}
                    </Suspense>
                </figure>
            </div>
        </section>
    );
};

export default Settings;
