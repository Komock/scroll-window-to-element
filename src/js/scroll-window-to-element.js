// Animation function with requestAnimationFrame()
function animate(draw, duration) {
	const start = performance.now();
	requestAnimationFrame(function _animate(time) {
		let timePassed = time - start;
		if (timePassed > duration) timePassed = duration;
		draw(timePassed);
		if (timePassed < duration) requestAnimationFrame(_animate);
	});
};

function ScrollToElement(opts) {
	const defaults = {
		anchors: 'a[href*="#"]',
		duration: 350,
		offset: 0,
		easing: 'easeInOut',
		dataAttrName: 'section',
		init: true,
	};
	this.opts = Object.assign(defaults, (opts || {}));
	if (this.opts.init) this.init();
}

ScrollToElement.prototype.init = function() {
	const that = this;
	const anchors = document.querySelectorAll(this.opts.anchors);
	const anchorsArr = [].prototype.slice.call(anchors);
	anchorsArr.forEach(function(a, i) {
		a.addEventListener('click', function(e) { that.clickHandler(e) });
	});
}

ScrollToElement.prototype.makeEaseInOut = function(timing, progress) {
	return function() {
		if (progress < 0.5) { return timing(2 * progress) / 2;
		} else { return (2 - timing(2 * (1 - progress))) / 2; }
	};
}

ScrollToElement.prototype.timingFn = function(progress, startVal, displace) {
	if (this.easing === 'linear') {
		return (progress * displace) + startVal;
	} else {
		const easeInOut = this.makeEaseInOut(function (prgrs) { return Math.pow(prgrs, 2); }, progress);
		return (easeInOut() * displace) + startVal;
	}
}

ScrollToElement.prototype.clickHandler = function(e) {
	if (e) { e.preventDefault(); }

	const that = this,
		link = e.currentTarget.getAttribute('href'),
		elToScroll = document.querySelector(link) || document.querySelector('*[data-' + this.opts.dataAttrName + '="' + link.substr(1) + '"]'),
		offsetTop = this.elOffsetTop(elToScroll);

	const startVal = window.pageYOffset,
		endVal = offsetTop + this.opts.offset,
		displace = endVal - startVal,
		duration = this.opts.duration;

	if (displace === 0) return;

	animate(function(timePassed) {
		let progress = timePassed / duration,
			newVal = that.timingFn(progress, startVal, displace);
		window.scrollTo(null, newVal);
	}, duration);

}

ScrollToElement.prototype.elOffsetTop = function(el) {
	let top = 0;
	while (el.parentNode) {
		top += el.offsetTop;
		el = el.parentNode;
	}
	return top;
}

module.exports = scrollToElement;
