let animate = require('./animate.js');

class scrollToElement {
	constructor(options) {
		let defaults = {
			anchors: 'a[href*="#"]',
			duration: 350,
			offset: 0,
			easing: 'easeInOut'
		};
		options ? this.options = Object.assign(defaults, options) : this.options = defaults;
	}

	setClickEvent() {
		let that = this,
			anchors = document.querySelectorAll(this.options.anchors);
		for( let anchor of anchors ){
			anchor.addEventListener('click', e=> that.clickHandler(e));
		}
	}

	makeEaseInOut(timing, progress) {
		return () => {
			if (progress < 0.5) {
				return timing(2 * progress) / 2;
			} else {
				return (2 - timing(2 * (1 - progress))) / 2;
			}
		};
	}

	timingFn(progress, startVal, displace) {
		if (this.easing === 'linear') {
			return (progress * displace) + startVal;
		} else {
			// Default animation 'easeInOut'
			let easeInOut = this.makeEaseInOut((progress)=> Math.pow(progress, 2), progress);
			return (easeInOut() * displace) + startVal;
		}
	}

	clickHandler(e) {
		e.preventDefault();

		let el = e.currentTarget,
			link = el.getAttribute('href'),
			elToScroll = document.querySelector(link) || document.querySelector(`*[data-section="${link.substr(1)}"]`),
			offsetTop = this.elOffsetTop(elToScroll);

		// Animation
		let startVal = window.pageYOffset,
			endVal = offsetTop + this.options.offset,
			displace = endVal - startVal,
			duration = this.options.duration;

		if (displace === 0) return;

		animate((timePassed) => {
			let progress = timePassed / duration,
				newVal = this.timingFn(progress, startVal, displace);
			window.scrollTo(null, newVal);
		}, duration);

	}

	elOffsetTop(el) {
		let top = 0;
		while (el.parentNode) {
			top += el.offsetTop;
			el = el.parentNode;
		}
		return top;
	}

	init() {
		this.setClickEvent();
	}
}

module.exports = scrollToElement;
