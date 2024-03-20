import { useEffect, useState } from "react";
import RadioSwitchInput from "../components/input/RadioSwitchInput.jsx";
import patchData from "../util/fetch/patchData.js";
import { useNotificationUpdate } from "../context/notification.jsx";

/**
 * Blocks wrapper function
 *
 * @param {Array} data
 * @param {Function} setData
 * @param {String} search
 * @param {Function} setEditElement
 * @param {String} emptyMessage
 * @param {String} sectionTitle
 *
 * @returns {React.JSX.Element}
 */
export default function BlocksWrapper({
	data,
	setData,
	search,
	setEditElement,
	emptyMessage = "sorry, no result found",
	sectionTitle = "",
}) {
	const [filteredData, setFilteredData] = useState(data);

	useEffect(() => {
		if (search === "") {
			return setFilteredData(data);
		}

		const newData = data.filter((item) => {
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

		setFilteredData(newData);
	}, [search, data]);

	return (
		<>
			<h3 className="mb-3 text-xl font-bold">{sectionTitle}</h3>
			<section className="grid grid-cols-3 gap-5">
				{filteredData.map((item, index) => {
					const { title, iconElement } = item;
					return (
						<Block
							key={index}
							item={item}
							title={title}
							iconElement={iconElement}
						/>
					);
				})}
				{data.length === 0 && (
					<h5 className="text-lg capitalize">{emptyMessage}</h5>
				)}
			</section>
		</>
	);
}

/**
 * Block wrapper
 *
 * @param {Object} item Block Object
 * @param {String} iconElement SVG child
 * @param {String} title Block name
 *
 * @returns {React.JSX.Element}
 */
function Block({ item, iconElement, title }) {
	const [isBlockActive, setIsBlockActive] = useState(item.is_activated);
	const setNotification = useNotificationUpdate();

	async function activate_block() {
		setIsBlockActive(true);

		const response = await patchData({
			action: "__activate_xynity_blocks_block",
			data: {
				block_name: item.name,
			},
		});
		const response_data = (await response.json()).data;

		if (response.ok) {
			setNotification({
				text: response_data,
				type: "success",
			});
		} else {
			setIsBlockActive(item.is_activated);
			setNotification({
				text: response_data,
				type: "error",
			});
		}
	}

	async function deactivate_block() {
		setIsBlockActive(false);

		const response = await patchData({
			action: "__deactivate_xynity_blocks_block",
			data: {
				block_name: item.name,
			},
		});
		const response_data = (await response.json()).data;

		if (response.ok) {
			setNotification({
				text: response_data,
				type: "success",
			});
		} else {
			setIsBlockActive(item.is_activated);
			setNotification({
				text: response_data,
				type: "error",
			});
		}
	}

	return (
		<div className="flex items-start justify-between w-full gap-2 px-4 py-2 bg-white rounded">
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
					<h5 className="text-lg capitalize">{title}</h5>
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{/* Enable disable block options for xynity's blocks */}
				{item.from === "xynity-blocks" && (
					<RadioSwitchInput
						selected={isBlockActive}
						title={isBlockActive ? "Disable" : "Enable"}
						smaller={true}
						onClick={
							isBlockActive ? deactivate_block : activate_block
						}
					/>
				)}
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
}
