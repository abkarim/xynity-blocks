import { useEffect, useState } from "react";

const coreBlocks = Object.keys(blocks_options_from_backend.list)
    .filter((item) => item.startsWith("core/"))
    .map((item) => blocks_options_from_backend.list[item]);

const Core = ({ search, showTitle = true }) => {
    const [data, setData] = useState(coreBlocks);

    console.log({ data });

    useEffect(() => {
        if (search === "") {
            return setData(coreBlocks);
        }

        const newData = coreBlocks.filter((item) => {
            console.log({ search, item });
            /**
             * Add if name is matching
             */
            if (item.title.toLowerCase().startsWith(search)) return item;

            /**
             * Add if keywords match or starts with search
             */
            const keywordMatched = item.keywords.filter((word) => {
                if (word.toLowerCase().startsWith(search)) return true;
            });

            if (keywordMatched.length !== 0) return item;
        });

        setData(newData);
    }, [search]);

    return (
        <>
            {showTitle && <h3 className="mb-3 text-xl font-bold">Core</h3>}
            <section className="grid grid-cols-3 gap-5">
                {data.map((item, index) => {
                    const { title, name, description } = item;
                    const titleText = title ? title : name.replace("core/", "");
                    return (
                        <div
                            key={index}
                            className="flex items-start justify-between w-full gap-2 p-5 bg-white rounded">
                            <div>
                                <h5 className="text-lg capitalize">
                                    {titleText}
                                </h5>
                                <p className="text-justify text-slate-500">
                                    {description}
                                </p>
                            </div>
                            <div className="flex flex-col">
                                <button
                                    className="p-1 cursor-pointer"
                                    title="Edit defaults">
                                    <span className="inline-block w-5 h-full text-yellow-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            id="Outline"
                                            fill="currentColor"
                                            viewBox="0 0 24 24">
                                            <path d="M22.853,1.148a3.626,3.626,0,0,0-5.124,0L1.465,17.412A4.968,4.968,0,0,0,0,20.947V23a1,1,0,0,0,1,1H3.053a4.966,4.966,0,0,0,3.535-1.464L22.853,6.271A3.626,3.626,0,0,0,22.853,1.148ZM5.174,21.122A3.022,3.022,0,0,1,3.053,22H2V20.947a2.98,2.98,0,0,1,.879-2.121L15.222,6.483l2.3,2.3ZM21.438,4.857,18.932,7.364l-2.3-2.295,2.507-2.507a1.623,1.623,0,1,1,2.295,2.3Z" />
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <h5 className="text-lg capitalize">
                        Sorry, nothing found!
                    </h5>
                )}
            </section>
        </>
    );
};

export default Core;
