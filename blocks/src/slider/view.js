import Control from "./Control";

/**
 * Get all sliders
 */
const sliders = [
	...document.querySelectorAll(".wp-block-xynity-blocks-slider"),
];

sliders.map((sliderContainer) => {
	const contentElement = sliderContainer.querySelector(".content");
	const indicatorContainerElement =
		sliderContainer.querySelector(".indicator");
	const controllerContainerElement =
		sliderContainer.querySelector(".controller");

	const control = new Control(contentElement, indicatorContainerElement);

	/**
	 * Add events to controller if exists
	 */
	if (controllerContainerElement) {
		const previousControllerElement =
			controllerContainerElement.querySelector(".previous");
		previousControllerElement.addEventListener("click", () =>
			control.previousSlide()
		);

		const nextControllerElement =
			controllerContainerElement.querySelector(".next");
		nextControllerElement.addEventListener("click", () =>
			control.nextSlide()
		);
	}

	/**
	 * Add events to indicator if exists
	 */
});
