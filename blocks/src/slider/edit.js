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
import Control from "./Control";
import { select } from "@wordpress/data";

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

		setAttributes({
			sliderCount: attributes.sliderCount + 1,
			lastSliderAction: "add",
		});
	}

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
			<Slider attributes={attributes} setAttributes={setAttributes} />
		</div>
	);
}

function Slider({ attributes, setAttributes }) {
	const contentRef = useRef(null);
	const indicatorRef = useRef(null);
	const [css, setCss] = useState("");
	const isInitialRender = useRef(true);

	const control = new Control(contentRef.current, indicatorRef.current);

	/**
	 * Class is removed from innerBlocks content on select unselect
	 * let's handle it
	 */
	useEffect(() => {
		// Return if no reference found
		if (contentRef.current === null) return;

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

	/**
	 * Show last slide when new slide added
	 */
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
		 * Get all indicators
		 * @type {Array}
		 */
		const indicators = [...indicatorRef.current.querySelectorAll("span")];

		/**
		 * Get current slider number
		 * @type {Number}
		 */
		const currentSliderNumber = parseInt(
			contentRef.current.getAttribute("currentslideitem")
		);

		function showLastSlide() {
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

			/**
			 * Remove previous active indicator
			 */
			const [activeIndicator] = indicators.filter((indicator) =>
				indicator.classList.contains("active")
			);
			if (activeIndicator) {
				activeIndicator.classList.remove("active");
			}

			/**
			 * Add active class to last indicator
			 */
			indicators[sliderLength - 1].classList.add("active");
		}

		/**
		 * Slider added
		 *
		 * Show last slider
		 * if currentSliderNumber is less than sliderLength
		 */
		if (
			currentSliderNumber < sliderLength &&
			attributes.lastSliderAction === "add"
		) {
			showLastSlide();
		} else if (
			currentSliderNumber > sliderLength &&
			attributes.lastSliderAction === "remove"
		) {
			/**
			 * Slider removed and current slider number is not valid
			 */
			showLastSlide();
		}
	}, [attributes.sliderCount, attributes.lastSliderAction]);

	/**
	 * Track block remove via the list view section
	 */
	useEffect(() => {
		if (contentRef.current === null || !setAttributes) return;

		const observer = new MutationObserver(() => {
			/**
			 * Total of current slider
			 * @type {Number}
			 */
			const sliderCount = [
				...contentRef.current.querySelectorAll(
					"section.wp-block-xynity-blocks-slider-child"
				),
			].length;

			/**
			 * Is element removed
			 *
			 * when content's child count is less than attributes.sliderCount
			 * that considered as slider remove
			 */
			if (
				sliderCount < attributes.sliderCount &&
				attributes.lastSliderAction !== "add"
			) {
				setAttributes({ sliderCount, lastSliderAction: "remove" });
			} else {
				// Remove last action
				setAttributes({ lastSliderAction: "" });
			}
		});

		observer.observe(contentRef.current, {
			attributes: false,
			subtree: true,
			childList: true,
		});
	}, [
		contentRef.current,
		attributes.sliderCount,
		attributes.lastSliderAction,
		setAttributes,
	]);

	/**
	 * Track initial render
	 */
	useEffect(() => {
		isInitialRender.current = false;
	}, []);

	return (
		<>
			<style>{css}</style>
			<div
				className="content"
				ref={contentRef}
				loop-activated={attributes.loop ? "true" : "false"}>
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
						.map((value, index) => (
							<span
								onClick={() =>
									control.showSlideBySlideNumber(index + 1)
								}
								className={`${index === 0 ? "active" : ""}`}>
								&bull;
							</span>
						))}
				</div>
			)}
		</>
	);
}
