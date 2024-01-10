import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	BlockControls,
} from "@wordpress/block-editor";
import "./editor.scss";
import {
	PanelBody,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
	Icon,
	Dashicon,
	Toolbar,
	TextControl,
	ToolbarButton,
	ToggleControl,
} from "@wordpress/components";

import {
	arrowRight,
	image,
	close,
	moreHorizontalMobile,
	textColor,
	plusCircle,
} from "@wordpress/icons";
import { useRef, useEffect, useState } from "react";
import { useSelect } from "@wordpress/data";
import Control from "./Control";

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

		setAttributes({ sliderCount: attributes.sliderCount + 1 });
	}

	/**
	 * Update slider count on delete slider
	 */

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
			<Slider attributes={attributes} clientId={clientId} />
		</div>
	);
}

function Slider({ attributes, clientId }) {
	const contentRef = useRef(null);
	const indicatorRef = useRef(null);
	const [css, setCss] = useState("");
	const isInitialRender = useRef(true);

	const control = new Control(contentRef.current, attributes.loop);

	/**
	 * Class is removed from innerBlocks content on select unselect
	 * let's handle it
	 */
	useEffect(() => {
		// Return if no reference found
		if (!contentRef.current) return;

		// Add a mutation observer to container and listen for attribute change
		const observer = new MutationObserver((mutations) => {
			/**
			 * @type {string}
			 */
			let currentSliderNumber =
				contentRef.current.getAttribute("currentslideitem");

			// Return if no slider number found
			if (!currentSliderNumber) return;

			/**
			 * @type {number}
			 */
			currentSliderNumber = parseInt(currentSliderNumber);

			// Update CSS
			setCss(`.wp-block-xynity-blocks-slider .content[currentslideitem="${currentSliderNumber}"] section.wp-block-xynity-blocks-slider-child:nth-child(${currentSliderNumber}) {
					z-index: 2;
					opacity: 1;
				}`);
		});

		const config = {
			attributes: true,
			attributeFilter: ["currentslideitem"],
		};

		observer.observe(contentRef.current, config);
	}, [contentRef]);

	// Show last slide when new slide added
	useEffect(() => {
		if (isInitialRender.current) {
			/**
			 * Show first slide
			 */
			contentRef.current.setAttribute("currentslideitem", 1);
			return;
		}

		/**
		 * Get all sliders
		 * @type {Array}
		 */
		const sliders = [
			...contentRef.current.querySelectorAll(
				"section.wp-block-xynity-blocks-slider-child"
			),
		];

		/**
		 * Total slider count
		 * @type {Number}
		 */
		const sliderLength = sliders.length;

		/**
		 * Get current slider number
		 * @type {Number}
		 */
		const currentSliderNumber = parseInt(
			contentRef.current.getAttribute("currentslideitem")
		);

		/**
		 * Show last slider
		 * if currentSliderNumber is less than sliderLength
		 */
		if (currentSliderNumber < sliderLength) {
			/**
			 * Remove previous slider that already may be active
			 */
			const [previousSlider] = sliders.filter((slider) =>
				slider.classList.contains("center")
			);
			if (previousSlider) {
				previousSlider.classList.remove("center");
			}

			/**
			 * Set current slide number attribute to content container
			 */
			contentRef.current.setAttribute("currentslideitem", sliderLength);

			/**
			 * Add current class to newly added slider
			 */
			sliders[sliderLength - 1].classList.add("center");
		}
	}, [attributes.sliderCount]);

	/**
	 * Track initial render
	 */
	useEffect(() => {
		isInitialRender.current = false;
	}, []);

	return (
		<>
			<style>{css}</style>
			<div className="content" ref={contentRef}>
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
					{Array(attributes.sliderCount)
						.fill(0)
						.map(() => (
							<span>&bull;</span>
						))}
				</div>
			)}
		</>
	);
}
