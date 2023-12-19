import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { Dashicon } from "@wordpress/components";

export default function save({ attributes }) {
	const uniqueID = attributes.uniqueID;
	return (
		<div {...useBlockProps.save()}>
			<div className="content" id={uniqueID}>
				<div>
					<InnerBlocks.Content />
				</div>
			</div>
			{/* Controller */}
			{attributes.control !== "none" && (
				<div className="controller">
					<span className="previous">
						{attributes.control === "text" &&
							attributes.controlTextValues.previous}
						{attributes.control === "arrow" && (
							<Dashicon icon="arrow-left-alt2" />
						)}
					</span>
					<span className="next">
						{attributes.control === "text" &&
							attributes.controlTextValues.next}
						{attributes.control === "arrow" && (
							<Dashicon icon="arrow-right-alt2" />
						)}
					</span>
				</div>
			)}
			{/* Indicator */}
			{attributes.indicator !== "none" && (
				<div className="indicator">
					<span>&bull;</span>
				</div>
			)}
		</div>
	);
}
