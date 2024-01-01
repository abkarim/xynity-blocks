class Control {
	currentSliderNumber = 1;
	previousSliderNumber = 1;
	containerElement = null;
	sliderElements = [];
	currentSliderAttributeName = "currentSlideItem";
	isLoopActivated = true;
	isNavigationOccurred = false;

	/**
	 *
	 * @param {Element} containerElement
	 * @param {Boolean} loop
	 * @returns
	 */
	constructor(containerElement, loop = true) {
		this.containerElement = containerElement;
		this.isLoopActivated = loop;

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

		// Change slide if current and previous slide number is different
		if (this.previousSliderNumber !== this.currentSliderNumber) {
			this.removePreviousSlide("backward");
			this.showCurrentSlide("backward");
		}
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

		// Change slide if current and previous slide number is different
		if (this.previousSliderNumber !== this.currentSliderNumber) {
			this.removePreviousSlide("forward");
			this.showCurrentSlide("forward");
		}
	}

	/**
	 * Removes previous slide if exists
	 */
	removePreviousSlide(animation = "forward") {
		// Remove previous slide
		let [previousSlide] = this.sliderElements.filter((item) =>
			item.classList.contains("center")
		);
		if (!previousSlide) {
			// The first child is the active slide
			previousSlide = this.sliderElements[0];
		}

		// Add removed class for remove animation
		if (animation === "forward") {
			previousSlide.classList.add("right");
		} else {
			previousSlide.classList.add("left");
		}

		setTimeout(() => {
			previousSlide.classList.remove("center", "left", "right");
		}, 50);
	}

	/**
	 * Show current slide
	 */
	showCurrentSlide(animation = "forward") {
		if (this.isNavigationOccurred === false) {
			// Remove no navigation class from content element
			this.containerElement.classList.remove("no-navigation");

			// Set isNavigationOccurred to true
			this.isNavigationOccurred = true;
		}

		const currentItem = this.sliderElements[this.currentSliderNumber - 1];

		if (animation === "backward") {
			this.containerElement.classList.add("right-init");
			currentItem.classList.add("right");
			setTimeout(() => currentItem.classList.remove("right"), 50);
		} else {
			this.containerElement.classList.remove("right-init");
		}

		currentItem.classList.add("center");

		// Set previous slider number to current slider number
		// this is the last move until now
		// so this should be the previous number
		this.previousSliderNumber = this.currentSliderNumber;
	}
}

export default Control;
