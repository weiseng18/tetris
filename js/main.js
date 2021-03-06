function Game(height, width) {
	this.id = "grid";
	this.height = height;
	this.width = width;
	this.cellSize = "30px";

	// tick speed set in ms
	this.tickSpeed = 1000;
	this.started = false;

	this.grid = init2D(height, width, null);

	this.letters = ["O","I","T","S","Z","J","L"];
	this.activePiece = null;
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

Game.prototype.drawLocked = function() {
	for (var i=0; i<this.height; i++)
		for (var j=0; j<this.width; j++)
			if (this.grid[i][j] != null)
				getCell(this.id, i, j).style.backgroundColor = this.grid[i][j];
}

Game.prototype.undrawLocked = function() {
	for (var i=0; i<this.height; i++)
		for (var j=0; j<this.width; j++)
			if (this.grid[i][j] != null)
				getCell(this.id, i, j).style.backgroundColor = "white";
}

Game.prototype.checkFullRow = function() {
	var rowsToDelete = [];

	for (var i=0; i<this.height; i++) {
		var isFull = true;
		for (var j=0; j<this.width; j++)
			if (this.grid[i][j] == null) {
				isFull = false;
				break;
			}
		if (isFull)
			rowsToDelete.push(i);
	}

	var total = rowsToDelete.length;

	if (total > 0) {

		// paint white
		for (var i=total-1; i>=0; i--) {
			// undraw
			this.undrawLocked();

			// paint white
			var indexToDelete = rowsToDelete[i];
			for (var a=0; a<this.width; a++)
				this.grid[indexToDelete][a] = null;

			// redraw
			this.drawLocked();
		}

		// remove rows
		var rowsDeleted = 0;

		setTimeout(() => {
			// remove
			for (var i=total-1; i>=0; i--) {
				// undraw
				this.undrawLocked();

				var indexToDelete = rowsToDelete[i] + rowsDeleted;
				// remove
				this.grid.splice(indexToDelete, 1);
				rowsDeleted++;
				this.grid.unshift([]);

				// redraw
				this.drawLocked();
			}
		}, 0.1*this.tickSpeed);
	}
}

Game.prototype.newPiece = function() {
	var idx = randomInt(this.letters.length);
	var letter = this.letters[idx];

	this.activePiece = new Piece(letter);
}

Game.prototype.start = function() {
	if (!this.started) {
		this.started = true;
		this.newPiece();
	}
}

Game.prototype.keypress = function() {
	window.addEventListener("keypress", (e) => {
		var key = e.key.toLowerCase();
		if (key == "a")
			this.activePiece.move(0, -1, 0);
		else if (key == "d")
			this.activePiece.move(0, 1, 0);
		else if (key == "s")
			this.activePiece.move(1, 0, 0);
		else if (key == "q")
			this.activePiece.move(0, 0, -1);
		else if (key == "e")
			this.activePiece.move(0, 0, 1);
	});
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

	this.startGravity();
}

Piece.prototype.startGravity = function() {
	this.gravity = setInterval(() => {
		this.move(1, 0, 0);
	}, game.tickSpeed);
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
	clearInterval(this.gravity);

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
	if (this.y >= 0) {
		game.newPiece();
		game.checkFullRow();
	}
}

Piece.prototype.collision = function(deltaY, deltaX, deltaRotation) {
	var height = this.shape[this.rotation].length;
	var width = this.shape[this.rotation][0].length;

	var rotation = this.rotation + deltaRotation;
	if (rotation >= this.shape.length) rotation -= this.shape.length;
	if (rotation < 0) rotation += this.shape.length;

	for (var i=0; i<height; i++)
		for (var j=0; j<width; j++)
			if (this.shape[rotation][i][j]) {
				var y = this.y + deltaY + i,
					x = this.x + deltaX + j;

				// if out of bounds, collision with bottom/side wall
				if (y >= game.height || x < 0 || x >= game.width)
					return true;

				// if within the bounds, check for collision with pieces
				if (0 <= y && y < game.height && 0 <= x && x < game.width)
					if (game.grid[y][x] != null)
						return true;
			}
	return false;
}

Piece.prototype.move = function(deltaY, deltaX, deltaRotation) {
	if (this.locked == true)
		return;

	// handle moving down separately
	// to check if the piece should be locked
	if (deltaY == 1 && deltaX == 0 && deltaRotation == 0) {
		if (!this.collision(1, 0, 0)) {
			this.undraw();
			this.y++;
			this.draw();
		}
		else
			this.lock();
	}

	else if (!this.collision(deltaY, deltaX, deltaRotation)) {
		this.undraw();
		this.y += deltaY;
		this.x += deltaX;

		this.rotation += deltaRotation;
		if (this.rotation >= this.shape.length) this.rotation -= this.shape.length;
		if (this.rotation < 0) this.rotation += this.shape.length;

		this.draw();
	}
}

var game;

window.onload = function() {
	game = new Game(15, 9);
	game.drawBoard();
	game.keypress();

	addButtons();
}