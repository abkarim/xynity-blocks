import Editor from "@monaco-editor/react";
import { useState } from "react";
import RadioSwitchInput from "./RadioSwitchInput.jsx";
import getCookie from "../../util/cookie/get.js";
import setCookie from "../../util/cookie/set.js";

export default function CSSInput({
    defaultValue = "// .some-class {color: black;}",
    onChange = () => {},
}) {
    const [theme, setTheme] = useState(getCookie("CSSTheme") || "vs-dark");
    const toggleEditorTheme = () => {
        setTheme((prev) => {
            const newTheme = theme === "light" ? "vs-dark" : "light";
            // Set value to cookie
            setCookie("CSSTheme", newTheme);
            return newTheme;
        });
    };

    return (
        <section className="border">
            <div className="flex items-center gap-2 p-2 border-b">
                <h4 className="text-base font-bold">Dark Theme</h4>
                <RadioSwitchInput
                    onClick={toggleEditorTheme}
                    selected={theme === "vs-dark"}
                    smaller={true}
                />
            </div>
            <Editor
                theme={theme}
                height="500px"
                language="css"
                onChange={onChange}
                defaultValue={defaultValue}
            />
        </section>
    );
}
