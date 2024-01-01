import { __ } from "@wordpress/i18n";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import "./editor.scss";
import { InspectorControls, BlockControls } from "@wordpress/block-editor";
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	Icon,
	Dashicon,
	Toolbar,
	TextControl,
	ToolbarButton,
} from "@wordpress/components";

import {
	arrowRight,
	image,
	close,
	moreHorizontalMobile,
	textColor,
	plusCircle,
} from "@wordpress/icons";
import { useRef } from "react";
import Control from "./Control";
import { ToggleControl } from "@wordpress/components";
import { useEffect } from "react";

/**
 * Allowed blocks in innerBlocks
 */
const SLIDER_CHILD_BLOCK_NAME = "xynity-blocks/slider-child";
const ALLOWED_BLOCKS = [SLIDER_CHILD_BLOCK_NAME];

export default function Edit({ clientId, attributes, setAttributes }) {
	const controlType = attributes.control;
	const indicatorType = attributes.indicator;

	/**
	 * Update indicator type
	 */
	function updateIndicator(value) {
		setAttributes({ indicator: value });
	}

	/**
	 * Update control type
	 */
	function updateControl(value) {
		setAttributes({ control: value });
	}

	/**
	 * Update control text values
	 */
	function updateControlTextValues(controlType, value) {
		setAttributes({
			controlTextValues: {
				previous: attributes.controlTextValues.previous,
				next: attributes.controlTextValues.next,
				[controlType]: value,
			},
		});
	}

	/**
	 * Add new slide
	 *
	 * adds a new slider child block
	 */
	function addNewSlide() {
		const block = wp.blocks.createBlock(SLIDER_CHILD_BLOCK_NAME);
		wp.data
			.dispatch("core/block-editor")
			.insertBlock(block, undefined, clientId);
	}

	const currentBlock = wp.data.select("core/block-editor").getSelectedBlock();

	/**
	 * Count sliders child
	 */
	useEffect(() => {
		if (currentBlock && currentBlock.clientId === clientId) {
			const sliderChildCount = currentBlock.innerBlocks.length;
			console.log({ sliderChildCount });
		}
	}, [currentBlock]);

	return (
		<div {...useBlockProps()}>
			<BlockControls>
				<Toolbar label="Slider Controls">
					<ToolbarButton
						showTooltip={true}
						label="Add new slide"
						onClick={addNewSlide}>
						<Icon icon={plusCircle} />
					</ToolbarButton>
				</Toolbar>
			</BlockControls>
			<InspectorControls>
				<PanelBody title="Controls">
					{/* Handle loop */}
					<ToggleControl
						label="Activate Loop"
						checked={attributes.loop}
						onChange={(value) => setAttributes({ loop: value })}
					/>
					<ToggleGroupControl
						label="Previous Next Controls"
						value={controlType}
						onChange={updateControl}>
						<ToggleGroupControlOptionIcon
							value="text"
							label="Text"
							icon={textColor}
						/>
						{/* // TODO handle icons */}
						<ToggleGroupControlOptionIcon
							value="arrow"
							label="Arrow"
							icon={arrowRight}
						/>
						<ToggleGroupControlOptionIcon
							value="none"
							label="None"
							icon={close}
						/>
					</ToggleGroupControl>
					{
						/** Render controls text input */
						controlType === "text" && (
							<>
								<TextControl
									label="Previous control text"
									value={
										attributes.controlTextValues.previous
									}
									onChange={(value) =>
										updateControlTextValues(
											"previous",
											value
										)
									}
								/>
								<TextControl
									label="Next control text"
									value={attributes.controlTextValues.next}
									onChange={(value) =>
										updateControlTextValues("next", value)
									}
								/>
							</>
						)
					}
					<ToggleGroupControl
						label="Indicator"
						value={indicatorType}
						onChange={updateIndicator}>
						<ToggleGroupControlOptionIcon
							value="dots"
							label="Dots"
							icon={moreHorizontalMobile}
						/>
						<ToggleGroupControlOptionIcon
							value="none"
							label="None"
							icon={close}
						/>
					</ToggleGroupControl>
				</PanelBody>
			</InspectorControls>
			<Slider attributes={attributes} />
		</div>
	);
}

function Slider({ attributes }) {
	const contentRef = useRef(null);
	const indicatorRef = useRef(null);

	const control = new Control(contentRef.current, attributes.loop);

	return (
		<>
			<div className="content no-navigation" ref={contentRef}>
				<InnerBlocks
					renderAppender={false}
					allowedBlocks={ALLOWED_BLOCKS}
					template={[[SLIDER_CHILD_BLOCK_NAME, {}]]}
				/>
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
				<div className="indicator" ref={indicatorRef}>
					<span>&bull;</span>
				</div>
			)}
		</>
	);
}
