import { Suspense, lazy, useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
const Icon = lazy(() => import("./Icon.jsx"));
const Navigation = lazy(() => import("./Navigation.jsx"));

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
            <Option targetOption="navigation">
                <span className="inline-block w-5 h-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        fill="currentColor"
                        viewBox="0 0 512 512">
                        <g>
                            <path d="M480,224H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,224,480,224z" />
                            <path d="M32,138.667h448c17.673,0,32-14.327,32-32s-14.327-32-32-32H32c-17.673,0-32,14.327-32,32S14.327,138.667,32,138.667z" />
                            <path d="M480,373.333H32c-17.673,0-32,14.327-32,32s14.327,32,32,32h448c17.673,0,32-14.327,32-32S497.673,373.333,480,373.333z" />
                        </g>
                    </svg>
                </span>
                Navigation
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
                        {option === "navigation" && <Navigation />}
                    </Suspense>
                </figure>
            </div>
        </section>
    );
};

export default Customization;
