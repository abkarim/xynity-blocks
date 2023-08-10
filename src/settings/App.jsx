import { Suspense, lazy, useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
const Editor = lazy(() => import("./Editor.jsx"));
const Colors = lazy(() => import("./Colors.jsx"));
const Shadows = lazy(() => import("./Shadows.jsx"));
const Reset = lazy(() => import("./Reset.jsx"));

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
                <span className="inline-block w-5 h-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        data-name="Layer 1">
                        <path d="m18 9.064a3.049 3.049 0 0 0 -.9-2.164 3.139 3.139 0 0 0 -4.334 0l-11.866 11.869a3.064 3.064 0 0 0 4.33 4.331l11.87-11.869a3.047 3.047 0 0 0 .9-2.167zm-14.184 12.624a1.087 1.087 0 0 1 -1.5 0 1.062 1.062 0 0 1 0-1.5l7.769-7.77 1.505 1.505zm11.872-11.872-2.688 2.689-1.5-1.505 2.689-2.688a1.063 1.063 0 1 1 1.5 1.5zm-10.825-6.961 1.55-.442.442-1.55a1.191 1.191 0 0 1 2.29 0l.442 1.55 1.55.442a1.191 1.191 0 0 1 0 2.29l-1.55.442-.442 1.55a1.191 1.191 0 0 1 -2.29 0l-.442-1.55-1.55-.442a1.191 1.191 0 0 1 0-2.29zm18.274 14.29-1.55.442-.442 1.55a1.191 1.191 0 0 1 -2.29 0l-.442-1.55-1.55-.442a1.191 1.191 0 0 1 0-2.29l1.55-.442.442-1.55a1.191 1.191 0 0 1 2.29 0l.442 1.55 1.55.442a1.191 1.191 0 0 1 0 2.29zm-5.382-14.645 1.356-.387.389-1.358a1.042 1.042 0 0 1 2 0l.387 1.356 1.356.387a1.042 1.042 0 0 1 0 2l-1.356.387-.387 1.359a1.042 1.042 0 0 1 -2 0l-.387-1.355-1.358-.389a1.042 1.042 0 0 1 0-2z" />
                    </svg>
                </span>
                Editor Options
            </Option>
            <Option targetOption="colors">
                <span className="inline-block w-5 h-full mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M17.115,8.05A1.5,1.5,0,1,0,18.95,9.115,1.5,1.5,0,0,0,17.115,8.05Z" />
                        <path d="M12.115,5.05A1.5,1.5,0,1,0,13.95,6.115,1.5,1.5,0,0,0,12.115,5.05Z" />
                        <path d="M7.115,8.05A1.5,1.5,0,1,0,8.95,9.115,1.5,1.5,0,0,0,7.115,8.05Z" />
                        <path d="M7.115,14.05A1.5,1.5,0,1,0,8.95,15.115,1.5,1.5,0,0,0,7.115,14.05Z" />
                        <path d="M12.5.007A12,12,0,0,0,.083,12a12.014,12.014,0,0,0,12,12c.338,0,.67-.022,1-.05a1,1,0,0,0,.916-1l-.032-3.588A3.567,3.567,0,0,1,20.057,16.8l.1.1a1.912,1.912,0,0,0,1.769.521,1.888,1.888,0,0,0,1.377-1.177A11.924,11.924,0,0,0,24.08,11.7,12.155,12.155,0,0,0,12.5.007Zm8.982,15.4-.014-.014a5.567,5.567,0,0,0-9.5,3.985L11.992,22a10,10,0,0,1,.09-20c.117,0,.235,0,.353.006a10.127,10.127,0,0,1,9.645,9.743A9.892,9.892,0,0,1,21.485,15.4Z" />
                    </svg>
                </span>
                Colors
            </Option>
            <Option targetOption="shadows">
                <span className="inline-block w-5 h-full mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        x="0"
                        y="0"
                        viewBox="0 0 16 16"
                        xmlSpace="preserve">
                        <g>
                            <path
                                fill="currentColor"
                                d="M14 2V0H0v14h2v2h14V2h-2zm-1 11H1V1h12v12z"
                                data-original="currentColor"></path>
                        </g>
                    </svg>
                </span>
                Shadows
            </Option>
            <Option targetOption="reset">
                <span className="inline-block w-5 h-full mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M12,0A11.972,11.972,0,0,0,4,3.073V1A1,1,0,0,0,2,1V4A3,3,0,0,0,5,7H8A1,1,0,0,0,8,5H5a.854.854,0,0,1-.1-.021A9.987,9.987,0,1,1,2,12a1,1,0,0,0-2,0A12,12,0,1,0,12,0Z" />
                        <path d="M12,6a1,1,0,0,0-1,1v5a1,1,0,0,0,.293.707l3,3a1,1,0,0,0,1.414-1.414L13,11.586V7A1,1,0,0,0,12,6Z" />
                    </svg>
                </span>
                Reset
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
                        {option === "shadows" && <Shadows />}
                        {option === "reset" && <Reset />}
                    </Suspense>
                </figure>
            </div>
        </section>
    );
};

export default Settings;
