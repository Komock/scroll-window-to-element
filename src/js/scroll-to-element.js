import animate from './animate.js';

export default class scrollToElement {
	constructor( options ) {
		let defaults = { 
			anchors: 'a[href*="#"]', 
			duration: 350, 
			easing: 'easeInOut' 
		};
		options ? this.options = Object.assign(defaults, options) : this.options = defaults;
	}

	setClickEvent() {
		let that = this,
			anchors = document.querySelectorAll(this.options.anchors);
		anchors.forEach(function(item) {
			item.addEventListener('click', e => that.clickHandler(e));
		});
	}

	timingFn(progress, startVal, displace) {
		switch (this.easing) {
			case 'quad':
				return (Math.pow(progress, 2) * displace) + startVal;
			case 'linear':
				return (progress * displace) + startVal;
			// Default animation 'easeInOut'
			default:
				function makeEaseInOut(timing) {
					return ()=> {
						if (progress < 0.5){
							return timing(2 * progress) / 2;
						} else {
							return (2 - timing(2 * (1 - progress))) / 2;
						}
					}
				}
				let easeInOut = makeEaseInOut( (progress)=> Math.pow( progress, 2 ) );
				return ( easeInOut() * displace ) + startVal;
		};
	}

	clickHandler(e) {
		e.preventDefault();
		
		let el = e.target,
			link = el.getAttribute('href'),
			elToScroll = document.querySelector(link) || document.querySelector(`*[data-section="${link.substr(1)}"]`),
			offsetTop = this.elOffsetTop(elToScroll);

		// Animation
		let startVal = window.pageYOffset,
			endVal = offsetTop,
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
