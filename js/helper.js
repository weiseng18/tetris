function get(id) {
	return document.getElementById(id);
}

// returns the HTML element of the xth tr of the yth td of a table.
// expects id to be the id of a table.
function getCell(id, x, y) {
	return document.getElementById(id).children[0].children[x].children[y];
}

function init2D(height, width, val) {
	var arr = [];
	for (var i=0; i<height; i++) {
		var row = [];
		for (var j=0; j<width; j++)
			row.push(val);
		arr.push(row);
	}
	return arr;
}

// returns integer in [0, length)
function randomInt(length) {
	// Math.random() range is [0,1)
	return Math.floor(Math.random()*length);
}