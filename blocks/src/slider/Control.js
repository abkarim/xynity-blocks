class Control {
	currentSliderNumber = 1;
	previousSliderNumber = 1;
	containerElement = null;
	sliderElements = [];
	currentSliderAttributeName = "currentslideitem";
	isLoopActivated = true;
	indicatorContainerElement = null;
	indicatorElements = [];

	/**
	 *
	 * @param {Element} containerElement
	 * @param {Boolean} loop
	 * @returns
	 */
	constructor(containerElement, indicatorContainerElement = null) {
		this.containerElement = containerElement;
		this.indicatorContainerElement = indicatorContainerElement;

		if (this.containerElement === null) return;

		/**
		 * Handle loop
		 */
		this.isLoopActivated =
			this.containerElement.getAttribute("loop-activated") === "true"
				? true
				: false;

		const elements = this.containerElement.querySelectorAll(
			"section.wp-block-xynity-blocks-slider-child"
		);
		this.sliderElements = [...elements];

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

		/**
		 * Initiate indicators
		 */
		if (this.indicatorContainerElement) {
			this.indicatorElements = [
				...this.indicatorContainerElement.querySelectorAll("span"),
			];
		}
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
	 * Show Slide by slide number
	 *
	 * @param {Number} slideNumber - default 1
	 */
	showSlideBySlideNumber(slideNumber = 1) {
		// Set slider number
		this.currentSliderNumber = slideNumber;

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

		/**
		 * Update indicator
		 */
		this.updateIndicator();
	}

	/**
	 * Update indicator
	 */
	updateIndicator() {
		/**
		 * Return if indicators not found
		 */
		if (this.indicatorElements.length === 0) return;

		/**
		 * Remove active class from previous indicator
		 */
		const [activeElement] = this.indicatorElements.filter((element) =>
			element.classList.contains("active")
		);
		if (activeElement) {
			activeElement.classList.remove("active");
		}

		/**
		 * Add active class to current indicator
		 */
		this.indicatorElements[this.currentSliderNumber - 1].classList.add(
			"active"
		);
	}
}

export default Control;
