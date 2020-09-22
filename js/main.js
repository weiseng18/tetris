function Game(height, width) {
	this.height = height;
	this.width = width;
	this.cellSize = "30px";
}

Game.prototype.drawBoard = function() {
	var grid = document.createElement("table");
	grid.className = "grid";

	for (var i=0; i<this.height; i++) {
		var row = grid.insertRow();
		row.style.height = this.cellSize;
		for (var j=0; j<this.width; j++) {
			var cell = row.insertCell();
			cell.style.width = this.cellSize;
		}
	}

	var wrapper = get("boardWrapper");
	wrapper.appendChild(grid);
}

var game;

window.onload = function() {
	game = new Game(15, 8);
	game.drawBoard();
}