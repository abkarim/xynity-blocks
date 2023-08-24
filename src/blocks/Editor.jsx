import { useEffect, useState } from "react";
import SideBar from "./Sidebar.jsx";
import ColorInput from "../components/ColorInput.jsx";
import Textarea from "../components/input/Textarea.jsx";
import Select from "../components/Select.jsx";

const Editor = ({ element, onClose }) => {
    /**
     * Destruct data from props
     */
    const { title, from } = element;

    const [option, setOption] = useState("colors");
    const [blockData, setBlockData] = useState({});

    /**
     * Get blocks data
     */
    useEffect(() => {
        const get_data = async (name) => {
            const response = await fetch(
                `${
                    plugin_info_from_backend.ajax_url
                }?action=${encodeURIComponent(
                    "xynity_blocks__get_block_data"
                )}&name=${from + "/" + title.toLowerCase()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-WP-Nonce": plugin_info_from_backend.ajax_nonce,
                    },
                    credentials: "same-origin",
                }
            );

            const response_data = (await response.json()).data;
            setBlockData(response_data);
        };

        get_data();
    }, [title, from]);

    console.log({ blockData });

    const handleOption = (option) => {
        setOption(option);
    };

    return (
        <section className="absolute inset-0 bg-white border rounded bg-opacity-10 backdrop-blur-md">
            <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-200">
                <h2 className="text-lg">
                    Edit <span className="font-medium">{title}</span>
                </h2>
                <button onClick={onClose} title="close">
                    <span className="inline-block w-5 h-full text-red-500">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor">
                            <path d="m16.707,8.707l-3.293,3.293,3.293,3.293-1.414,1.414-3.293-3.293-3.293,3.293-1.414-1.414,3.293-3.293-3.293-3.293,1.414-1.414,3.293,3.293,3.293-3.293,1.414,1.414Zm7.293,3.293c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
                        </svg>
                    </span>
                </button>
            </div>
            <section className="flex justify-start h-full">
                <SideBar currentOption={option} setOption={handleOption} />
                <figure className="w-full">
                    {option === "colors" && <Colors />}
                    {option === "typography" && <Typography />}
                    {option === "spacing" && <Spacing />}
                    {option === "shadows" && <Shadows />}
                    {option === "custom_css" && <CustomCSS />}
                    {option === "reset" && <Reset title={title} />}
                </figure>
            </section>
        </section>
    );
};

const Colors = () => {
    const colors = colors_options_from_backend.current.palette;
    const [textColor, setTextColor] = useState();
    const [backgroundColor, setBackgroundColor] = useState();
    const [linkColor, setLinkColor] = useState();

    return (
        <>
            <Wrapper title="Text color">
                <div className="flex items-center gap-2 mt-2">
                    {colors.map((color, index) => (
                        <button
                            onClick={() => setTextColor(color.slug)}
                            key={index}
                            title={color.name}
                            className="relative">
                            <ColorInput
                                className="pointer-events-none"
                                value={color.color}
                                readOnly={true}
                            />
                            {color.slug === textColor && (
                                <span className="absolute top-0 right-0 z-10 inline-block w-5 h-full text-green-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Wrapper>
            <Wrapper title="Background color">
                <div className="flex items-center gap-2 mt-2">
                    {colors.map((color, index) => (
                        <button
                            onClick={() => setBackgroundColor(color.slug)}
                            key={index}
                            title={color.name}
                            className="relative">
                            <ColorInput
                                className="pointer-events-none"
                                value={color.color}
                                readOnly={true}
                            />
                            {color.slug === backgroundColor && (
                                <span className="absolute top-0 right-0 z-10 inline-block w-5 h-full text-green-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Wrapper>
            <Wrapper title="Link color">
                <div className="flex items-center gap-2 mt-2">
                    {colors.map((color, index) => (
                        <button
                            onClick={() => setLinkColor(color.slug)}
                            key={index}
                            title={color.name}
                            className="relative">
                            <ColorInput
                                className="pointer-events-none"
                                value={color.color}
                                readOnly={true}
                            />
                            {color.slug === linkColor && (
                                <span className="absolute top-0 right-0 z-10 inline-block w-5 h-full text-green-500">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Wrapper>
        </>
    );
};

const Typography = () => {
    const sizes = typography_options_from_backend.current.fontSizes;
    const families = typography_options_from_backend.current.fontFamilies;
    const letterCases = [
        {
            value: "none",
            title: "-",
        },
        {
            value: "uppercase",
            title: "AB",
        },
        {
            value: "lowercase",
            title: "ab",
        },
        {
            value: "capitalize",
            title: "Ab",
        },
    ];

    const textDecorations = [
        {
            value: "none",
            title: "-",
        },
        {
            value: "underline",
            title: "Underline",
        },
        {
            value: "overline",
            title: "overline",
        },
        {
            value: "line-through",
            title: "Line through",
        },
    ];

    const [letterCase, setLetterCase] = useState();
    const [textDecoration, setTextDecoration] = useState();
    const [size, setSize] = useState("");
    const [family, setFamily] = useState("");

    return (
        <>
            <Wrapper title="Size">
                <div className="mt-3">
                    <Select
                        className="w-full"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}>
                        {sizes.map((size, index) => (
                            <option value={size.slug} key={index}>
                                {size.name || size.size}
                            </option>
                        ))}
                    </Select>
                </div>
            </Wrapper>
            <Wrapper title="Font family">
                <div className="mt-3">
                    <Select
                        className="w-full"
                        value={family}
                        onChange={(e) => setFamily(e.target.value)}>
                        {families.map((font, index) => (
                            <option value={font.slug} key={index}>
                                {font.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </Wrapper>
            <Wrapper title="Text decoration">
                <div className="flex items-center gap-4 mt-3">
                    {textDecorations.map((item, index) => (
                        <button
                            onClick={() => setTextDecoration(item.value)}
                            key={index}
                            title={item.value}
                            className="relative p-2 rounded bg-slate-100 outline-1"
                            style={{ textDecoration: item.value }}>
                            {item.title}
                            {item.value === textDecoration && (
                                <span className="absolute z-10 inline-block w-4 h-full text-green-500 -top-1 -right-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Wrapper>
            <Wrapper title="Letter case">
                <div className="flex items-center gap-4 mt-3">
                    {letterCases.map((item, index) => (
                        <button
                            onClick={() => setLetterCase(item.value)}
                            key={index}
                            title={item.value}
                            className="relative p-2 rounded bg-slate-100 outline-1">
                            {item.title}
                            {item.value === letterCase && (
                                <span className="absolute z-10 inline-block w-4 h-full text-green-500 -top-1 -right-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm-.091,15.419c-.387.387-.896.58-1.407.58s-1.025-.195-1.416-.585l-2.782-2.696,1.393-1.437,2.793,2.707,5.809-5.701,1.404,1.425-5.793,5.707Z" />
                                    </svg>
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </Wrapper>
        </>
    );
};

const Spacing = () => {
    return (
        <>
            <Wrapper title="Letter spacing"></Wrapper>
            <Wrapper title="Margin"></Wrapper>
            <Wrapper title="Padding"></Wrapper>
        </>
    );
};

const Shadows = () => {
    return (
        <>
            <Wrapper title="Box shadow"></Wrapper>
        </>
    );
};

const CustomCSS = () => {
    return (
        <div className="p-4">
            <Textarea value="" placeholder="color:red;" />
        </div>
    );
};

const Reset = ({ title }) => {
    return (
        <Wrapper title="Reset all settings">
            <button
                className="flex items-center gap-2 p-2 px-3 mt-3 font-bold text-red-500 rounded shadow bg-slate-100 text"
                onClick={() => {
                    if (
                        !confirm(
                            `are you sure want to reset "${title}" settings ?`
                        )
                    )
                        return;
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
        </Wrapper>
    );
};

const Wrapper = ({ title, children }) => {
    return (
        <section className="w-full p-5 border-b">
            <h3 className="text-xl">{title}</h3>
            <div>{children}</div>
        </section>
    );
};

export default Editor;
