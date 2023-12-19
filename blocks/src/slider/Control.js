class Control {
	currentSliderNumber = 1;
	containerElement = null;
	sliderElements = [];
	currentSliderAttributeName = "currentSlideItem";
	isLoopActivated = true;

	constructor(containerElement) {
		this.containerElement = containerElement;

		if (this.containerElement === null) return;

		const elements = this.containerElement.querySelectorAll(
			"section.wp-block-xynity-blocks-slider-child"
		);

		this.sliderElements = [...elements];
	}

	/**
	 * Go to previous slide
	 */
	previousSlide() {
		if (this.currentSliderNumber > 1) {
			this.currentSliderNumber = this.currentSliderNumber - 1;
		} else {
			/**
			 * This is the first slide
			 * there are no previous slide available
			 *
			 * Set to the last slide if loop activated
			 */
			if (this.isLoopActivated) {
				this.currentSliderNumber = this.sliderElements.length || 1;
			}
		}

		this.handleSlideTransition();
	}

	/**
	 * Go to next slide
	 */
	nextSlide() {
		/**
		 * Is this is the last slide available
		 */
		if (this.currentSliderNumber === this.sliderElements.length) {
			/**
			 * This is the last slide and there are no next slide available
			 *
			 * Set slide to the first slide if loop activated
			 */
			if (this.isLoopActivated) {
				this.currentSliderNumber = 1;
			}
		} else {
			// This is not the last slide, carry on
			this.currentSliderNumber = this.currentSliderNumber + 1;
		}

		this.handleSlideTransition();
	}

	/**
	 * Handle slide transition
	 */
	handleSlideTransition() {
		// Remove previous slide
		const [previousSlide] = this.sliderElements.filter(
			(item) =>
				item.getAttribute(this.currentSliderAttributeName) === "true"
		);
		if (previousSlide) {
			previousSlide.removeAttribute(this.currentSliderAttributeName);
		}

		// Show current slide
		this.sliderElements[this.currentSliderNumber - 1].setAttribute(
			this.currentSliderAttributeName,
			true
		);
	}
}

export default Control;
