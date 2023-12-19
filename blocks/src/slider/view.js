import Control from "./Control";

/**
 * Get all sliders
 */
const sliders = [
	...document.querySelectorAll(".wp-block-xynity-blocks-slider"),
];

sliders.map((sliderContainer) => {
	const contentElement = sliderContainer.querySelector(".content");
	const control = new Control(contentElement);

	/**
	 * Add events to controller if exists
	 */
	const controllerContainerElement =
		sliderContainer.querySelector(".controller");
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
