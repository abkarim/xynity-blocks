class Control {
	currentSliderReference = null;
	containerReference = null;
	sliderElements = [];
	currentSliderAttributeName = "currentSlideItem";
	isLoopActivated = true;

	/**
	 * Constructor
	 *
	 * @param {import("react").RefObject} counterRef
	 * @param {import("react").RefObject} containerRef
	 */
	constructor(counterRef, containerRef) {
		this.currentSliderReference = counterRef;
		this.containerReference = containerRef;

		if (this.containerReference.current != null) {
			const elements = this.containerReference.current.querySelectorAll(
				"section.wp-block-xynity-blocks-slider-child"
			);

			this.sliderElements = [...elements];
		}
	}

	/**
	 * Go to previous slide
	 */
	previousSlide() {
		if (this.currentSliderReference.current > 1) {
			this.currentSliderReference.current =
				this.currentSliderReference.current - 1;
		} else {
			/**
			 * This is the first slide
			 * there are no previous slide available
			 *
			 * Set to the last slide if loop activated
			 */
			if (this.isLoopActivated) {
				this.currentSliderReference.current =
					this.sliderElements.length || 1;
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
		if (
			this.currentSliderReference.current === this.sliderElements.length
		) {
			/**
			 * This is the last slide and there are no next slide available
			 *
			 * Set slide to the first slide if loop activated
			 */
			if (this.isLoopActivated) {
				this.currentSliderReference.current = 1;
			}
		} else {
			// This is not the last slide, carry on
			this.currentSliderReference.current =
				this.currentSliderReference.current + 1;
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
		this.sliderElements[
			this.currentSliderReference.current - 1
		].setAttribute(this.currentSliderAttributeName, true);
	}
}

export default Control;
