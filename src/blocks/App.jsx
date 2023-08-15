import { useState } from "react";
import Core from "./Core.jsx";
import TextInput from "../components/InputText.jsx";

console.log({ blocks_options_from_backend });

const Blocks = () => {
    const [category, setCategory] = useState("All");
    const [search, setSearch] = useState("");
    return (
        <section>
            <h1 className="text-2xl font-bold">Blocks</h1>
            <div className="flex items-center gap-2 mt-3">
                {["All", "Core"].map((cat, index) => (
                    <button
                        key={index}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-1 text-base rounded-full shadow  outline-1 ${
                            category === cat
                                ? "bg-slate-100 outline font-bold"
                                : "bg-white"
                        }`}>
                        {cat}
                    </button>
                ))}
            </div>
            <div className="mt-5">
                <TextInput
                    value={search}
                    onInput={(e) => setSearch(e.target.value.toLowerCase())}
                    placeholder="Search here"
                    className="!bg-white text-base p-1 px-2 outline-none"
                />
            </div>
            <main className="mt-5">
                {(category === "Core" || category === "All") && (
                    <Core
                        search={search.trim()}
                        showTitle={category !== "Core"}
                    />
                )}
            </main>
        </section>
    );
};

export default Blocks;
