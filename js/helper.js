function get(id) {
	return document.getElementById(id);
}

// returns the HTML element of the xth tr of the yth td of a table.
// expects id to be the id of a table.
function getCell(id, x, y) {
	return document.getElementById(id).children[0].children[x].children[y];
}
