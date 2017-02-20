"use strict";

// Animation function with requestAnimationFrame()
module.exports = function animate(draw, duration) {
	var start = performance.now();
	requestAnimationFrame(function animate(time) {
		var timePassed = time - start;
		if (timePassed > duration) timePassed = duration;
		draw(timePassed);
		if (timePassed < duration) requestAnimationFrame(animate);
	});
};