import { Suspense, lazy, useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
const Editor = lazy(() => import("./Editor.jsx"));
const Colors = lazy(() => import("./Colors.jsx"));
const Shadows = lazy(() => import("./Shadows.jsx"));
const Typography = lazy(() => import("./Typography.jsx"));
const Uploads = lazy(() => import("./Uploads.jsx"));

console.log({
    editor_options_from_backend,
    plugin_info_from_backend,
    colors_options_from_backend,
    shadows_options_from_backend,
    typography_options_from_backend,
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
            <Option targetOption="typography">
                <span className="inline-block w-5 h-full mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        data-name="Layer 1">
                        <path d="m19 0h-14a5.006 5.006 0 0 0 -5 5v14a5.006 5.006 0 0 0 5 5h14a5.006 5.006 0 0 0 5-5v-14a5.006 5.006 0 0 0 -5-5zm3 19a3 3 0 0 1 -3 3h-14a3 3 0 0 1 -3-3v-14a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3zm-4-10a1 1 0 0 1 -2 0 1 1 0 0 0 -1-1h-2v8h1a1 1 0 0 1 0 2h-4a1 1 0 0 1 0-2h1v-8h-2a1 1 0 0 0 -1 1 1 1 0 0 1 -2 0 3 3 0 0 1 3-3h6a3 3 0 0 1 3 3z" />
                    </svg>
                </span>
                Typography
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
            <Option targetOption="uploads">
                <span className="inline-block w-5 h-full mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        data-name="Layer 1"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <path d="M17.974,7.146c-.331-.066-.602-.273-.742-.569-1.55-3.271-5.143-5.1-8.734-4.438-3.272,.6-5.837,3.212-6.384,6.501-.162,.971-.15,1.943,.033,2.89,.06,.309-.073,.653-.346,.901-1.145,1.041-1.801,2.524-1.801,4.07,0,3.032,2.467,5.5,5.5,5.5h11c4.136,0,7.5-3.364,7.5-7.5,0-3.565-2.534-6.658-6.026-7.354Zm-1.474,12.854H5.5c-1.93,0-3.5-1.57-3.5-3.5,0-.983,.418-1.928,1.146-2.59,.786-.715,1.155-1.773,.963-2.763-.138-.712-.146-1.445-.024-2.181,.403-2.422,2.365-4.421,4.771-4.862,.385-.07,.768-.104,1.146-.104,2.312,0,4.405,1.289,5.422,3.434,.413,.872,1.2,1.482,2.158,1.673,2.56,.511,4.417,2.779,4.417,5.394,0,3.032-2.468,5.5-5.5,5.5Zm-1.379-7.707c.391,.391,.391,1.023,0,1.414-.195,.195-.451,.293-.707,.293s-.512-.098-.707-.293l-1.707-1.707v5c0,.553-.448,1-1,1s-1-.447-1-1v-5l-1.707,1.707c-.391,.391-1.023,.391-1.414,0s-.391-1.023,0-1.414l2.707-2.707c.386-.386,.893-.58,1.4-.583l.014-.003,.014,.003c.508,.003,1.014,.197,1.4,.583l2.707,2.707Z" />
                    </svg>
                </span>
                Uploads
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
                        {option === "typography" && <Typography />}
                        {option === "uploads" && <Uploads />}
                    </Suspense>
                </figure>
            </div>
        </section>
    );
};

export default Settings;
