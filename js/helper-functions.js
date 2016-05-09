function forEachInObject(object, iterationFunction) {
	if (!object) return;
	for (var key in object) {
		if (!object.hasOwnProperty(key)) continue;
		iterationFunction(key, object[key], object);
	}
}

function createElement(tagName, style, attributes, parent) {
	var element = document.createElement(tagName);
	forEachInObject(style, function (key, val) {
		element.style[key] = val;
	});
	forEachInObject(attributes, function (key, val) {
		element[key] = val;
	});
	if (parent) parent.appendChild(element);
	return element;
}

// Shuffle array in-place using Fisher-Yates shuffle:
// 	https://bost.ocks.org/mike/shuffle/
function shuffleArray(array) {
	for (var i = array.length - 1; i > 0; i -= 1) {
		// Pick a random index to swap with the ith element
		var randomIndex = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[randomIndex];
		array[randomIndex] = temp;
	}
	return array;
}

