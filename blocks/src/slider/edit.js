import { __ } from "@wordpress/i18n";
import {
	InnerBlocks,
	useBlockProps,
	InspectorControls,
	BlockControls,
	__experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
	__experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
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
	RangeControl,
} from "@wordpress/components";

import {
	arrowRight,
	close,
	moreHorizontalMobile,
	textColor,
	plusCircle,
	justifyStretch,
	justifySpaceBetween,
	justifyLeft,
} from "@wordpress/icons";
import { useRef, useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Control from "./Control";

/**
 * Allowed blocks in innerBlocks
 */
const SLIDER_CHILD_BLOCK_NAME = "xynity-blocks/slider-child";
const ALLOWED_BLOCKS = [SLIDER_CHILD_BLOCK_NAME];

export default function Edit({ clientId, attributes, setAttributes }) {
	const colorGradientSettings = useMultipleOriginColorsAndGradients();
	const modifiedColorsDropDown = (
		<ColorGradientSettingsDropdown
			settings={[
				// If slider control available
				{
					label: __("Slider Control Color", "xynity-blocks"),
					colorValue:
						attributes.xynitySliderStyle.sliderControl.normal.color,
					onColorChange: (value) => {
						setAttributes({
							xynitySliderStyle: {
								...attributes.xynitySliderStyle,
								sliderControl: {
									...attributes.xynitySliderStyle
										.sliderControl,
									normal: {
										...attributes.xynitySliderStyle
											.sliderControl.normal,
										color: value,
									},
								},
							},
						});
					},
				},
				{
					label: __(
						"Slider Control Background Color",
						"xynity-blocks"
					),
					colorValue:
						attributes.xynitySliderStyle.sliderControl.normal
							.backgroundColor,
					onColorChange: (value) => {
						setAttributes({
							xynitySliderStyle: {
								...attributes.xynitySliderStyle,
								sliderControl: {
									...attributes.xynitySliderStyle
										.sliderControl,
									normal: {
										...attributes.xynitySliderStyle
											.sliderControl.normal,
										backgroundColor: value,
									},
								},
							},
						});
					},
				},
				// If slider indicator available
				{
					label: __("Slide Indicator Color", "xynity-blocks"),
					colorValue:
						attributes.xynitySliderStyle.indicatorControl.normal
							.color,
					onColorChange: (value) => {
						setAttributes({
							xynitySliderStyle: {
								...attributes.xynitySliderStyle,
								indicatorControl: {
									...attributes.xynitySliderStyle
										.indicatorControl,
									normal: {
										...attributes.xynitySliderStyle
											.indicatorControl.normal,
										color: value,
									},
								},
							},
						});
					},
				},
				{
					label: __("Active Slide Indicator Color", "xynity-blocks"),
					colorValue:
						attributes.xynitySliderStyle.indicatorControl.active
							.color,
					onColorChange: (value) => {
						setAttributes({
							xynitySliderStyle: {
								...attributes.xynitySliderStyle,
								indicatorControl: {
									...attributes.xynitySliderStyle
										.indicatorControl,
									active: {
										...attributes.xynitySliderStyle
											.indicatorControl.active,
										color: value,
									},
								},
							},
						});
					},
				},
			]}
			panelId={clientId}
			hasColorsOrGradients={false}
			disableCustomColors={false}
			__experimentalIsRenderedInSidebar
			{...colorGradientSettings}
		/>
	);

	const controlType = attributes.control;

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
	 * Update sliders align property
	 */
	function updateSlidersAlign(value) {
		setAttributes({
			xynitySliderStyle: {
				...attributes.xynitySliderStyle,
				slides: {
					...attributes.xynitySliderStyle.slides,
					verticalAlign: value,
				},
			},
		});
	}

	/**
	 * Update slider control style
	 *
	 * @param {String} key
	 * @param {String} value
	 */
	function updateSliderControl(key, value) {
		setAttributes({
			xynitySliderStyle: {
				...attributes.xynitySliderStyle,
				sliderControl: {
					...attributes.xynitySliderStyle.sliderControl,
					normal: {
						...attributes.xynitySliderStyle.sliderControl.normal,
						[key]: value,
					},
				},
			},
		});
	}

	/**
	 * Update normal indicator style
	 *
	 * @param {String} key
	 * @param {String} value
	 */
	function updateNormalIndicator(key, value) {
		setAttributes({
			xynitySliderStyle: {
				...attributes.xynitySliderStyle,
				indicatorControl: {
					...attributes.xynitySliderStyle.indicatorControl,
					normal: {
						...attributes.xynitySliderStyle.indicatorControl.normal,
						[key]: value,
					},
				},
			},
		});
	}

	/**
	 * Update active indicator style
	 *
	 * @param {String} key
	 * @param {String} value
	 */
	function updateActiveIndicator(key, value) {
		setAttributes({
			xynitySliderStyle: {
				...attributes.xynitySliderStyle,
				indicatorControl: {
					...attributes.xynitySliderStyle.indicatorControl,
					active: {
						...attributes.xynitySliderStyle.indicatorControl.active,
						[key]: value,
					},
				},
			},
		});
	}

	/**
	 * Generate a random id
	 * it should be generate once
	 * if not already available
	 */
	useEffect(() => {
		const attributePrefix = "xynity-";

		if (attributes.xynityUniqueId === "") {
			setAttributes({
				xynityUniqueId: attributePrefix + uuid().slice(0, 10),
			});
		} else {
			/**
			 * Replace id
			 * when block is duplicated via duplicate button
			 */
			const sliderBlocks = wp.data
				.select("core/block-editor")
				.getBlocks()
				.filter((block) => block.name === "xynity-blocks/slider");

			const matchedxynityUniqueId = sliderBlocks.filter(
				(block) =>
					block.attributes.xynityUniqueId ===
					attributes.xynityUniqueId
			);

			if (matchedxynityUniqueId.length > 1) {
				setAttributes({
					xynityUniqueId: attributePrefix + uuid().slice(0, 10),
				});
			}
		}
	}, [attributes.xynityUniqueId]);

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
		<div {...useBlockProps({ className: attributes.xynityUniqueId })}>
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
			{/* Controls settings */}
			<InspectorControls group="settings">
				<PanelBody title="Controls">
					{/* Handle loop */}
					<ToggleControl
						label="Activate Loop"
						checked={attributes.loop}
						onChange={(value) => setAttributes({ loop: value })}
					/>
					<ToggleGroupControl
						label="Controls type"
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
						label="Indicator type"
						value={attributes.indicator}
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
			{/* Styles */}
			<InspectorControls group="styles">
				<PanelBody title="Slides">
					<ToggleGroupControl
						label="Vertical align"
						value={
							attributes.xynitySliderStyle.slides.verticalAlign
						}
						onChange={updateSlidersAlign}>
						<ToggleGroupControlOptionIcon
							value="start"
							label="Start"
							icon={justifyLeft}
							className="rotate-90"
						/>
						<ToggleGroupControlOptionIcon
							value="center"
							label="Center"
							icon={justifySpaceBetween}
							className="rotate-90"
						/>
						<ToggleGroupControlOptionIcon
							value="end"
							label="End"
							icon={justifyLeft}
							className="-rotate-90"
						/>
						<ToggleGroupControlOptionIcon
							value="stretch"
							label="Stretch"
							icon={justifyStretch}
							className="rotate-90"
						/>
					</ToggleGroupControl>
				</PanelBody>
				{/* Slider controls style */}
				<PanelBody title="Slider Controls">
					<RangeControl
						label="Size (px)"
						value={
							attributes.xynitySliderStyle.sliderControl.normal
								.size
						}
						min={0}
						onChange={(value) => updateSliderControl("size", value)}
					/>
				</PanelBody>
				<PanelBody title="Indicator">
					<RangeControl
						label="Size (px)"
						value={
							attributes.xynitySliderStyle.indicatorControl.normal
								.size
						}
						min={0}
						onChange={(value) =>
							updateNormalIndicator("size", value)
						}
					/>
					<RangeControl
						label="Gap (px)"
						value={
							attributes.xynitySliderStyle.indicatorControl.normal
								.gap
						}
						min={0}
						onChange={(value) =>
							updateNormalIndicator("gap", value)
						}
					/>
				</PanelBody>
				<PanelBody title="Active Indicator">
					<RangeControl
						label="Size (px)"
						value={
							attributes.xynitySliderStyle.indicatorControl.active
								.size
						}
						min={0}
						onChange={(value) =>
							updateActiveIndicator("size", value)
						}
					/>
				</PanelBody>
			</InspectorControls>
			{/* Add custom color options */}
			<InspectorControls group="color">
				{modifiedColorsDropDown}
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
		if (contentRef.current === null || !attributes.xynityUniqueId) return;

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

			const prefix = `.wp-block-xynity-blocks-slider.${attributes.xynityUniqueId} `;

			// Update CSS
			setCss(`${prefix} .content[currentslideitem="${currentSliderNumber}"] section.wp-block-xynity-blocks-slider-child:nth-child(${currentSliderNumber}) {
					z-index: 2;
					opacity: 1;
				}`);
		});

		const config = {
			attributes: true,
			attributeFilter: ["currentslideitem"],
		};

		observer.observe(contentRef.current, config);
	}, [contentRef, attributes.xynityUniqueId]);

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
	 * Update customization CSS
	 */
	useEffect(() => {
		/**
		 * Destruct data
		 */

		/**
		 * Get biggest value of indicator
		 * and divide via 2
		 */
		const indicatorLineHeight =
			attributes.xynitySliderStyle.indicatorControl.normal.size >
			attributes.xynitySliderStyle.indicatorControl.active.size
				? attributes.xynitySliderStyle.indicatorControl.normal.size / 2
				: attributes.xynitySliderStyle.indicatorControl.active.size / 2;

		const prefix = `.wp-block-xynity-blocks-slider.${attributes.xynityUniqueId} `;

		// Create initial css
		let css = `${prefix} .content section.wp-block-xynity-blocks-slider-child figure.wp-block-image {align-items: ${attributes.xynitySliderStyle.slides.verticalAlign};}`;
		css += `${prefix} .controller span { font-size: ${attributes.xynitySliderStyle.sliderControl.normal.size}px; color: ${attributes.xynitySliderStyle.sliderControl.normal.color}; background-color: ${attributes.xynitySliderStyle.sliderControl.normal.backgroundColor}; }`;
		css += `${prefix} .indicator span { font-size: ${attributes.xynitySliderStyle.indicatorControl.normal.size}px; color: ${attributes.xynitySliderStyle.indicatorControl.normal.color}; }`;
		css += `${prefix} .indicator { column-gap: ${
			attributes.xynitySliderStyle.indicatorControl.normal.gap
		}px; line-height: ${indicatorLineHeight + 5}px;}`;
		css += `${prefix} .indicator span.active { font-size: ${attributes.xynitySliderStyle.indicatorControl.active.size}px; color: ${attributes.xynitySliderStyle.indicatorControl.active.color}; }`;

		if (isInitialRender.current === true) {
			if (attributes.customizationCSS === "") {
				setAttributes({ customizationCSS: css });
			}

			return;
		}

		setAttributes({ customizationCSS: css });
	}, [
		attributes.xynitySliderStyle,
		attributes.customizationCSS,
		attributes.xynityUniqueId,
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
			<style>{attributes.customizationCSS}</style>
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
