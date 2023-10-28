import { useState } from "react";
import getSearchParam from "../util/getSearchParam";
import appendSearchParam from "../util/appendSearchParam";
import TextInput from "../components/input/InputText.jsx";
import DefaultButton from "../components/button/Default.jsx";
import List from "./List.jsx";
import AddNew from "./AddNew.jsx";
import Edit from "./Edit.jsx";

export default function CustomJS() {
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
                <span className="inline-block h-full w-7">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        id="js"
                        fill="#f0db4f "
                        viewBox="6.3 10.87 15.85 11.3">
                        <path d="M16.122,18.75a2.456,2.456,0,0,0,2.225,1.37c.934,0,1.531-.467,1.531-1.113,0-.773-.613-1.047-1.642-1.5l-.564-.242c-1.627-.693-2.708-1.562-2.708-3.4a3.014,3.014,0,0,1,3.3-2.979A3.332,3.332,0,0,1,21.474,12.7l-1.756,1.127a1.534,1.534,0,0,0-1.451-.966.982.982,0,0,0-1.08.966c0,.677.419.951,1.387,1.37l.564.241c1.916.822,3,1.66,3,3.543,0,2.031-1.595,3.143-3.737,3.143a4.333,4.333,0,0,1-4.11-2.306Zm-7.967.2c.354.628.677,1.16,1.451,1.16.741,0,1.209-.29,1.209-1.418V11.02H13.07v7.7a3.063,3.063,0,0,1-3.368,3.4,3.5,3.5,0,0,1-3.383-2.06Z"></path>{" "}
                    </svg>
                </span>
                <h1 className="text-2xl font-bold">Custom JavaScript</h1>
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
