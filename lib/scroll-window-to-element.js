'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var animate = require('./animate.js');

var scrollToElement = function () {
	function scrollToElement(options) {
		_classCallCheck(this, scrollToElement);

		var defaults = {
			anchors: 'a[href*="#"]',
			duration: 350,
			offset: 0,
			easing: 'easeInOut'
		};
		options ? this.options = Object.assign(defaults, options) : this.options = defaults;
	}

	_createClass(scrollToElement, [{
		key: 'setClickEvent',
		value: function setClickEvent() {
			var that = this,
			    anchors = document.querySelectorAll(this.options.anchors);
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = anchors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var anchor = _step.value;

					anchor.addEventListener('click', function (e) {
						return that.clickHandler(e);
					});
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	}, {
		key: 'makeEaseInOut',
		value: function makeEaseInOut(timing, progress) {
			return function () {
				if (progress < 0.5) {
					return timing(2 * progress) / 2;
				} else {
					return (2 - timing(2 * (1 - progress))) / 2;
				}
			};
		}
	}, {
		key: 'timingFn',
		value: function timingFn(progress, startVal, displace) {
			if (this.easing === 'linear') {
				return progress * displace + startVal;
			} else {
				// Default animation 'easeInOut'
				var easeInOut = this.makeEaseInOut(function (progress) {
					return Math.pow(progress, 2);
				}, progress);
				return easeInOut() * displace + startVal;
			}
		}
	}, {
		key: 'clickHandler',
		value: function clickHandler(e) {
			var _this = this;

			e.preventDefault();

			var el = e.currentTarget,
			    link = el.getAttribute('href'),
			    elToScroll = document.querySelector(link) || document.querySelector('*[data-section="' + link.substr(1) + '"]'),
			    offsetTop = this.elOffsetTop(elToScroll);

			// Animation
			var startVal = window.pageYOffset,
			    endVal = offsetTop + this.options.offset,
			    displace = endVal - startVal,
			    duration = this.options.duration;

			if (displace === 0) return;

			animate(function (timePassed) {
				var progress = timePassed / duration,
				    newVal = _this.timingFn(progress, startVal, displace);
				window.scrollTo(null, newVal);
			}, duration);
		}
	}, {
		key: 'elOffsetTop',
		value: function elOffsetTop(el) {
			var top = 0;
			while (el.parentNode) {
				top += el.offsetTop;
				el = el.parentNode;
			}
			return top;
		}
	}, {
		key: 'init',
		value: function init() {
			this.setClickEvent();
		}
	}]);

	return scrollToElement;
}();

module.exports = scrollToElement;