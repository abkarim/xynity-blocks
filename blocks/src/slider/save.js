import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { Dashicon } from "@wordpress/components";

export default function save({ attributes }) {
	return (
		<div {...useBlockProps.save()}>
			<div
				className="content"
				currentslideitem="1"
				loop-activated={attributes.loop ? "true" : "false"}>
				<InnerBlocks.Content />
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
					{Array(attributes.sliderCount)
						.fill(0)
						.map((value, index) => (
							<span className={`${index === 0 ? "active" : ""}`}>
								&bull;
							</span>
						))}
				</div>
			)}
		</div>
	);
}
