const RadioSwitchInput = ({
	selected = false,
	className = "",
	smaller = false,
	onClick = () => {},
	...props
}) => {
	return (
		<div
			{...props}
			className={`relative z-0 ${
				smaller ? "w-8 p-1.5" : "w-10 p-2"
			} rounded-full bg-opacity-60 cursor-pointer ${
				selected ? "bg-green-500" : "bg-gray-400"
			}`}
			onClick={onClick}>
			<span
				className={`absolute top-0 bottom-0 transition-all inline-block ${
					smaller ? "w-3 h-3" : "w-4 h-4"
				} rounded-full aspect-square z-[1] scale-150 ${
					selected ? "right-0 bg-green-500" : "left-0 bg-gray-400"
				}`}></span>
		</div>
	);
};

export default RadioSwitchInput;
