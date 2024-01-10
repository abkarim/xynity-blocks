class Control {
	currentSliderNumber = 1;
	previousSliderNumber = 1;
	containerElement = null;
	sliderElements = [];
	currentSliderAttributeName = "currentslideitem";
	isLoopActivated = true;

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

		/**
		 * Initiate current slider number
		 */
		let currentSliderNumber = this.containerElement.getAttribute(
			this.currentSliderAttributeName
		);
		if (currentSliderNumber) {
			/**
			 * Convert to number
			 * @type {Number}
			 */
			currentSliderNumber = parseInt(currentSliderNumber);

			this.currentSliderNumber = currentSliderNumber;
			this.previousSliderNumber = currentSliderNumber;
		}

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
			this.removePreviousSlide();
			this.showCurrentSlide();
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
			this.removePreviousSlide();
			this.showCurrentSlide();
		}
	}

	/**
	 * Removes previous slide if exists
	 */
	removePreviousSlide() {
		// Remove previous slide
		let [previousSlide] = this.sliderElements.filter((item) =>
			item.classList.contains("center")
		);
		if (!previousSlide) {
			// The first child is the active slide
			previousSlide = this.sliderElements[0];
		}

		setTimeout(() => {
			previousSlide.classList.remove("center");
		}, 50);
	}

	/**
	 * Show current slide
	 */
	showCurrentSlide() {
		const currentItem = this.sliderElements[this.currentSliderNumber - 1];

		currentItem.classList.add("center");

		// Set previous slider number to current slider number
		// this is the last move until now
		// so this should be the previous number
		this.previousSliderNumber = this.currentSliderNumber;

		/**
		 * Update current slide attribute
		 * to content element
		 */
		this.containerElement.setAttribute(
			this.currentSliderAttributeName,
			this.currentSliderNumber
		);
	}
}

export default Control;
