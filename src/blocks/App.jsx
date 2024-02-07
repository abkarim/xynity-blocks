import { useEffect, useState } from "react";
import TextInput from "../components/input/InputText.jsx";
import appendSearchParam from "../util/appendSearchParam.js";
import getSearchParam from "../util/getSearchParam.js";
import Editor from "./Editor.jsx";
import BlocksWrapper from "./BlocksWrapper.jsx";
import getCoreBlocks from "../util/getCoreBlocks";

const coreBlocks = getCoreBlocks();

const Blocks = () => {
	const [category, setCategory] = useState(
		getSearchParam("category") || "All"
	);
	const [search, setSearch] = useState(getSearchParam("search") || "");
	const [editElement, setEditElement] = useState(null);

	useEffect(() => {
		appendSearchParam("category", category);
	}, [category]);

	useEffect(() => {
		appendSearchParam("search", search);
	}, [search]);

	return (
		<section>
			<h1 className="text-2xl font-bold">Blocks</h1>
			<div className="flex items-center gap-2 mt-3">
				{["All", "Core", "Xynity Blocks"].map((cat, index) => (
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
			<main className="mt-5 space-y-4">
				{(category === "Xynity Blocks" || category === "All") && (
					<XynityBlocks
						sectionTitle="Xynity Blocks"
						search={search.trim()}
						setEditElement={setEditElement}
					/>
				)}
				{(category === "Core" || category === "All") && (
					<CoreBlocks
						search={search.trim()}
						setEditElement={setEditElement}
						sectionTitle="Core"
					/>
				)}
			</main>
			{editElement !== null && (
				<Editor
					element={editElement}
					onClose={() => setEditElement(null)}
				/>
			)}
		</section>
	);
};

function XynityBlocks({ ...props }) {
	const [data, setData] = useState([]);

	/**
	 * Get xynity-blocks blocks from backend
	 */
	useEffect(() => {}, []);

	return <BlocksWrapper {...props} data={data} setData={setData} />;
}

const CoreBlocks = ({ ...props }) => {
	const [data, setData] = useState(coreBlocks);
	return <BlocksWrapper {...props} data={data} setData={setData} />;
};

export default Blocks;
