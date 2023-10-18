import { Suspense, lazy, useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
const Icon = lazy(() => import("./Icon.jsx"));
const CSS = lazy(() => import("./CSS.jsx"));
const JavaScript = lazy(() => import("./JavaScript.jsx"));

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
            <Option targetOption="icon">
                <span className="inline-block w-5 h-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Outline"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M19,0H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V5A5.006,5.006,0,0,0,19,0ZM5,2H19a3,3,0,0,1,3,3V19a2.951,2.951,0,0,1-.3,1.285l-9.163-9.163a5,5,0,0,0-7.072,0L2,14.586V5A3,3,0,0,1,5,2ZM5,22a3,3,0,0,1-3-3V17.414l4.878-4.878a3,3,0,0,1,4.244,0L20.285,21.7A2.951,2.951,0,0,1,19,22Z" />
                        <path d="M16,10.5A3.5,3.5,0,1,0,12.5,7,3.5,3.5,0,0,0,16,10.5Zm0-5A1.5,1.5,0,1,1,14.5,7,1.5,1.5,0,0,1,16,5.5Z" />
                    </svg>
                </span>
                Icon
            </Option>
            <Option targetOption="css">
                <span className="inline-block w-5 h-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <polygon points="6.972,14.935 7.274,18.316 11.994,19.59 11.998,19.589 11.998,19.589 16.725,18.313 17.217,12.816 2.528,12.816   2.149,8.578 17.584,8.578 17.97,4.238 1.771,4.238 1.385,0 22.615,0 20.686,21.59 12.013,23.994 12.013,23.995 11.993,24   3.312,21.59 2.718,14.935 " />
                    </svg>
                </span>
                CSS
            </Option>
            <Option targetOption="js">
                <span className="inline-block w-5 h-full mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="js"
                        fill="currentColor"
                        viewBox="6.3 10.87 15.85 11.3">
                        <path d="M16.122,18.75a2.456,2.456,0,0,0,2.225,1.37c.934,0,1.531-.467,1.531-1.113,0-.773-.613-1.047-1.642-1.5l-.564-.242c-1.627-.693-2.708-1.562-2.708-3.4a3.014,3.014,0,0,1,3.3-2.979A3.332,3.332,0,0,1,21.474,12.7l-1.756,1.127a1.534,1.534,0,0,0-1.451-.966.982.982,0,0,0-1.08.966c0,.677.419.951,1.387,1.37l.564.241c1.916.822,3,1.66,3,3.543,0,2.031-1.595,3.143-3.737,3.143a4.333,4.333,0,0,1-4.11-2.306Zm-7.967.2c.354.628.677,1.16,1.451,1.16.741,0,1.209-.29,1.209-1.418V11.02H13.07v7.7a3.063,3.063,0,0,1-3.368,3.4,3.5,3.5,0,0,1-3.383-2.06Z"></path>{" "}
                    </svg>
                </span>
                JavaScript
            </Option>
        </aside>
    );
};

const Customization = () => {
    const [option, setOption] = useState(
        getSearchParam("customization") || "icon"
    );

    const handleOption = (option) => {
        appendSearchParam("customization", option);
        setOption(option);
    };

    return (
        <section>
            <h1 className="text-2xl font-bold">Customization</h1>
            <div className="flex justify-start mt-5 bg-white rounded-md shadow-md">
                <SideBar currentOption={option} setOption={handleOption} />
                <figure className="w-full">
                    <Suspense fallback={<h1>Loading...</h1>}>
                        {option === "icon" && <Icon />}
                        {option === "css" && <CSS />}
                        {option === "js" && <JavaScript />}
                    </Suspense>
                </figure>
            </div>
        </section>
    );
};

export default Customization;
