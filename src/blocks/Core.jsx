import { useEffect, useState } from "react";
import getCoreBlocks from "../util/getCoreBlocks";

const coreBlocks = getCoreBlocks();

const Core = ({ search, showTitle = true, setEditElement }) => {
    const [data, setData] = useState(coreBlocks);

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
                    const { title, iconElement } = item;
                    return (
                        <div
                            key={index}
                            className="flex items-start justify-between w-full gap-2 px-4 py-2 bg-white rounded">
                            <div className="flex items-start gap-2">
                                <div>
                                    <span className="inline-block w-12 h-full">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            dangerouslySetInnerHTML={{
                                                __html: iconElement,
                                            }}></svg>
                                    </span>
                                </div>
                                <div>
                                    <h5 className="text-lg capitalize">
                                        {title}
                                    </h5>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <button
                                    onClick={() => setEditElement(item)}
                                    className="p-1 rounded cursor-pointer hover:bg-yellow-500 hover:text-black"
                                    title="Edit defaults">
                                    <span className="inline-block w-5 h-full">
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
