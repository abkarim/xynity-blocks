import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { Dashicon } from "@wordpress/components";
import { useRef } from "react";
import Control from "./Control";

export default function save({ attributes }) {
	const contentRef = useRef(null);
	const sliderTrackerRef = useRef(1);

	const control = new Control(sliderTrackerRef, contentRef);

	return (
		<div {...useBlockProps.save()}>
			<div className="content" ref={contentRef}>
				<div>
					<InnerBlocks.Content />
				</div>
			</div>
			{/* Controller */}
			{attributes.control !== "none" && (
				<div className="controller">
					<span onClick={() => control.previousSlide()}>
						{attributes.control === "text" &&
							attributes.controlTextValues.previous}
						{attributes.control === "arrow" && (
							<Dashicon icon="arrow-left-alt2" />
						)}
					</span>
					<span onClick={() => control.nextSlide()}>
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
