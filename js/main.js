function Game(height, width) {
	this.id = "grid";
	this.height = height;
	this.width = width;
	this.cellSize = "30px";

	this.grid = init2D(height, width, null);
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

	// if this is true, piece cannot be moved
	this.locked = false;

	// every piece, when rotation=0, has height 2
	this.y = -2;
	// center the piece horizontally as far as possible
	var pieceWidth = this.shape[0][0].length;
	this.x = Math.floor(game.width/2) - Math.floor(pieceWidth/2);
}

// draw function to draw a piece onto the board
Piece.prototype.draw = function() {
	var height = this.shape[this.rotation].length;
	var width = this.shape[this.rotation][0].length;
	for (var i=0; i<height; i++)
		for (var j=0; j<width; j++)
			if (this.shape[this.rotation][i][j]) {
				var y = this.y + i,
					x = this.x + j;
				if (0 <= y && y < game.height && 0 <= x && x < game.width)
					getCell(game.id, y, x).style.backgroundColor = this.color;
			}
}

// undraw function to remove a piece from the board
// this will occur before any sort of movement to a piece
Piece.prototype.undraw = function() {
	var height = this.shape[this.rotation].length;
	var width = this.shape[this.rotation][0].length;
	for (var i=0; i<height; i++)
		for (var j=0; j<width; j++)
			if (this.shape[this.rotation][i][j]) {
				var y = this.y + i,
					x = this.x + j;
				if (0 <= y && y < game.height && 0 <= x && x < game.width)
					getCell(game.id, y, x).style.backgroundColor = "white";
			}
}

Piece.prototype.lock = function() {
	this.locked = true;

	var height = this.shape[this.rotation].length;
	var width = this.shape[this.rotation][0].length;
	for (var i=0; i<height; i++)
		for (var j=0; j<width; j++)
			if (this.shape[this.rotation][i][j]) {
				var y = this.y + i,
					x = this.x + j;
				if (0 <= y && y < game.height && 0 <= x && x < game.width)
					game.grid[y][x] = this.color;
			}
}

var game;

window.onload = function() {
	game = new Game(15, 8);
	game.drawBoard();
}