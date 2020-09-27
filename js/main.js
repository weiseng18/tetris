function Game(height, width) {
	this.id = "grid";
	this.height = height;
	this.width = width;
	this.cellSize = "30px";
}

Game.prototype.drawBoard = function() {
	var grid = document.createElement("table");
	grid.id = this.id;
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

// this.y, this.x will point to top left of the cell area in pieces.js
function Piece(letter) {
	this.shape = SHAPES[letter];
	this.color = COLORS[letter];
	this.rotation = 0;

	// every piece, when rotation=0, has height 2
	this.y = -2;
	// center the piece horizontally as far as possible
	var pieceWidth = this.shape[0][0].length;
	this.x = Math.floor(game.width/2) - Math.floor(pieceWidth/2);
}

var game;

window.onload = function() {
	game = new Game(15, 8);
	game.drawBoard();
}