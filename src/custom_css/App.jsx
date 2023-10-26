import { useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
import TextInput from "../components/input/InputText.jsx";
import DefaultButton from "../components/button/Default.jsx";
import List from "./List.jsx";
import AddNew from "./AddNew.jsx";
import Edit from "./Edit.jsx";

export default function CustomCSS() {
    const [option, setOption] = useState(getSearchParam("option") || "all");
    const [edit, setEdit] = useState(null);

    const [search, setSearch] = useState("");

    const handleOption = (option) => {
        appendSearchParam("option", option);
        setOption(option);
    };

    return (
        <section>
            <div className="flex items-center justify-start gap-2 mb-3">
                <span className="inline-block w-6 h-full">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        version="1.1"
                        id="Capa_1"
                        x="0px"
                        y="0px"
                        fill="#2965f1"
                        viewBox="0 0 24 24">
                        <polygon points="6.972,14.935 7.274,18.316 11.994,19.59 11.998,19.589 11.998,19.589 16.725,18.313 17.217,12.816 2.528,12.816   2.149,8.578 17.584,8.578 17.97,4.238 1.771,4.238 1.385,0 22.615,0 20.686,21.59 12.013,23.994 12.013,23.995 11.993,24   3.312,21.59 2.718,14.935 " />
                    </svg>
                </span>
                <h1 className="text-2xl font-bold">Custom CSS</h1>
                <div className="ml-3">
                    {edit === null && (
                        <DefaultButton onClick={() => setEdit("add_new")}>
                            Add new
                        </DefaultButton>
                    )}
                    {edit !== null && (
                        <DefaultButton onClick={() => setEdit(null)}>
                            Back
                        </DefaultButton>
                    )}
                </div>
            </div>
            {edit === null && (
                <section>
                    <div className="flex items-center gap-2">
                        {["All", "Published", "Draft", "Trash"].map(
                            (opt, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOption(opt)}
                                    className={`px-4 py-1 text-base rounded-full shadow  outline-1 ${
                                        option === opt
                                            ? "bg-slate-100 outline font-bold"
                                            : "bg-white"
                                    }`}>
                                    {opt}
                                </button>
                            )
                        )}
                    </div>
                    <div className="mt-5 mb-5">
                        <TextInput
                            value={search}
                            onInput={(e) =>
                                setSearch(e.target.value.toLowerCase())
                            }
                            placeholder="Search here"
                            className="!bg-white text-base p-1 px-2 outline-none"
                        />
                    </div>
                    <section className="mt-2">
                        <List
                            status={option.toLowerCase()}
                            search={search.trim()}
                            setEdit={setEdit}
                        />
                    </section>
                </section>
            )}
            {edit === "add_new" && <AddNew goBack={() => setEdit(null)} />}
            {edit !== null && typeof edit === "object" && (
                <Edit initData={edit} goBack={() => setEdit(null)} />
            )}
        </section>
    );
}
