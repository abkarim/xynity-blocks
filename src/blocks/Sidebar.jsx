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
            <Option targetOption="spacing">
                <span className="inline-block w-5 h-full mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="Layer_1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        data-name="Layer 1">
                        <path d="M21,24c-.55,0-1-.45-1-1V1c0-.55,.45-1,1-1s1,.45,1,1V23c0,.55-.45,1-1,1Zm-17-1V1c0-.55-.45-1-1-1s-1,.45-1,1V23c0,.55,.45,1,1,1s1-.45,1-1Zm13-6.5V7.5c0-1.93-1.57-3.5-3.5-3.5h-3c-1.93,0-3.5,1.57-3.5,3.5v9c0,1.93,1.57,3.5,3.5,3.5h3c1.93,0,3.5-1.57,3.5-3.5Z" />
                    </svg>
                </span>
                Spacing
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
            <Option targetOption="custom_css">
                <span className="inline-block w-5 h-full mt-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 24 24"
                        fill="currentColor">
                        <polygon points="6.972,14.935 7.274,18.316 11.994,19.59 11.998,19.589 11.998,19.589 16.725,18.313 17.217,12.816 2.528,12.816   2.149,8.578 17.584,8.578 17.97,4.238 1.771,4.238 1.385,0 22.615,0 20.686,21.59 12.013,23.994 12.013,23.995 11.993,24   3.312,21.59 2.718,14.935 " />
                    </svg>
                </span>
                Custom CSS
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

export default SideBar;
