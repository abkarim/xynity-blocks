import { useLayoutEffect, useState } from "react";
import getSearchParam from "./util/getSearchParam.js";
import appendSearchParam from "./util/appendSearchParam.js";
import Intro from "./intro/App.jsx";
import Settings from "./settings/App.jsx";
import Blocks from "./blocks/App.jsx";

const MenuButton = ({ targetPath, currentPath, changePath, children }) => {
    return (
        <button
            type="button"
            role="button"
            className={`${
                targetPath === currentPath &&
                "!text-blue-600 hover:text-blue-600 !border-blue-400 hover:!border-blue-400"
            } text-base py-4 border-b-2 border-[rgba(0,0,0,0)] font-bold hover:border-gray-300 hover:text-gray-900 text-gray-500 transition-all duration-200`}
            onClick={() => changePath(targetPath)}>
            {children}
        </button>
    );
};

const Header = ({ currentPath, changePath }) => {
    return (
        <div className="bg-white border-b shadow">
            <header className="flex items-center justify-between mx-auto max-w-7xl">
                <div className="flex items-center gap-5">
                    <h2 className="mr-5 text-2xl font-bold">Xynity Blocks</h2>
                    <MenuButton
                        targetPath={null}
                        currentPath={currentPath}
                        changePath={changePath}>
                        Welcome
                    </MenuButton>
                    <MenuButton
                        targetPath="blocks"
                        currentPath={currentPath}
                        changePath={changePath}>
                        Blocks
                    </MenuButton>
                    <MenuButton
                        targetPath="settings"
                        currentPath={currentPath}
                        changePath={changePath}>
                        Settings
                    </MenuButton>
                </div>
                <div>
                    <span className="inline-block">
                        {plugin_info_from_backend.plugin_version}
                    </span>
                </div>
            </header>
        </div>
    );
};

const App = () => {
    const defaultPath =
        getSearchParam("path") === "null" ? null : getSearchParam("path");
    const [path, setPath] = useState(defaultPath);

    const handlePath = (path) => {
        appendSearchParam("path", path);
        setPath(path);
    };

    /**
     * TODO
     *  BUG current class is not adding
     *
     * Handle links on WordPress dashboard menu
     * manage active and deactivate state
     *
     * add "current" class to activate
     * remove "current" class to deactivate
     */
    useLayoutEffect(() => {
        console.log({ path });
        // Get links wrapper
        const container = document.querySelector(
            ".toplevel_page_xynity-blocks"
        );

        // Deactivate prev link
        const prevLink = container.querySelector(".current");
        if (prevLink) {
            prevLink.classList.remove("current");
        }

        // Activate current link
        const currentLink = container.querySelector(
            `li > a[href$="&path=${path}"]`
        );
        if (currentLink) {
            // We got a
            // But we need a's parent li
            currentLink.parentElement.classList.add("current");
        } else {
            container.querySelector(".wp-first-item").classList.add("current");
        }
    }, [path]);

    return (
        <div className="-ml-5">
            <Header changePath={handlePath} currentPath={path} />
            <div className="mx-auto mt-6 max-w-7xl">
                {path === null && <Intro />}
                {path === "blocks" && <Blocks />}
                {path === "settings" && <Settings />}
            </div>
        </div>
    );
};

export default App;
