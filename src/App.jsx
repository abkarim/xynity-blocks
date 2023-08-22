import { Suspense, lazy, useState } from "react";
import getSearchParam from "./util/getSearchParam.js";
import appendSearchParam from "./util/appendSearchParam.js";
const Intro = lazy(() => import("./intro/App.jsx"));
const Settings = lazy(() => import("./settings/App.jsx"));
const Blocks = lazy(() => import("./blocks/App.jsx"));

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
                        {/**
                         * plugin_info_from_backend is localized by WordPress
                         * from: Dashboard->load_javascript()
                         */}
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
     * Handle links active and deactivate state
     */
    const links = document.querySelectorAll(
        ".toplevel_page_xynity-blocks > ul > li"
    );
    const prevLink = document.querySelector(
        ".toplevel_page_xynity-blocks > ul > .current"
    );
    if (prevLink) {
        prevLink.classList.remove("current");
    }
    if (path === null) {
        links[1].classList.add("current");
    } else if (path === "blocks") {
        links[2].classList.add("current");
    } else {
        links[3].classList.add("current");
    }

    return (
        <div className="-ml-5">
            <Header changePath={handlePath} currentPath={path} />
            <div className="relative mx-auto mt-6 max-w-7xl">
                <Suspense fallback={<h1>Loading...</h1>}>
                    {path === null && <Intro />}
                    {path === "blocks" && <Blocks />}
                    {path === "settings" && <Settings />}
                </Suspense>
            </div>
        </div>
    );
};

export default App;
