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

