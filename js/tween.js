function Tween(startValue, endValue, duration, easingType) {
	this.startValue = startValue;
	this.endValue = endValue;
	this.changeInValue = endValue - startValue;
	this.easingEquation = this.easingEquations[easingType];
	this.startTime = Date.now();
	this.duration = duration;
	this.isRunning = true;
}

// Robert Penner equations, implementation borrowed from: 
// 	https://github.com/ashblue/simple-tween-js/blob/master/tween.js
Tween.prototype.easingEquations = {
	// t = current time in ms in tween (relative to start time)
	// b = starting value
	// c = change in value
	// d = duration in ms
    linear: function (t, b, c, d) {
        return c * t / d + b;
    },
	quadInOut: function (t, b, c, d) {
	    t /= d / 2;
	    if (t < 1) {
	        return c / 2 * t * t + b;
	    }
	    t--;
	    return -c / 2 * (t * (t - 2) - 1) + b;
	}
};

Tween.prototype.getValue = function () {
	var elapsedTweenTime = Date.now() - this.startTime;
	if (elapsedTweenTime >= this.duration) {
		this.isRunning = false;
		elapsedTweenTime = this.duration;
	}
	var value = this.easingEquation(elapsedTweenTime, this.startValue,
								    this.changeInValue, this.duration);
	return value;
};

Tween.prototype.getEndValue = function () {
	return this.endValue;
};