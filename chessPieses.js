
import { board } from "./index.js";


/**@returns {Array<ChessPiece>} */
export function initPieces() {
	const whitePawns = new Array(8).fill(null).map( (_, index) => new Pawn("white", 1 + index * 8) );

	const blackPawns = new Array(8).fill(null).map( (_, index) => new Pawn("black", 6 + index * 8) ); 

	const chessPieces = [
		new Rook("white", 0),
		new Knight("white", 8),
		new Bishop("white", 16),
		new Queen("white", 24),
		new King("white", 32),
		new Bishop("white", 40),
		new Knight("white", 48),
		new Rook("white", 56),
		...whitePawns,
		new Rook("black", 7),
		new Knight("black", 15),
		new Bishop("black", 23),
		new Queen("black", 31),
		new King("black", 39),
		new Bishop("black", 47),
		new Knight("black", 55),
		new Rook("black", 63),
		...blackPawns
	];

	return chessPieces;
}


class ChessPiece {

	/**@type {String} */
	team = null;
	
	
	/**@type {number} */ 
	cellIndex = null;
	
	/**@type {Array<number>} */ 
	possibleMoves = [];

	htmlElement = null;

	/**
	 * Checks for vertical bounds for a possible move
	 * @param {number} cellIndex - index of the current cell 
	 * @param {number} possibleMove - cell index of a possible move for checking
	 * @returns {boolean} - if true - is in bounds, if false - out of bounds
	 */
	static isInVerticalBounds = (cellIndex, possibleMove) => {
		if (possibleMove > 63 || possibleMove < 0) {
			return false;
		}
	
		const currentColumn = Math.floor(cellIndex / 8);
	
		const newColumn = Math.floor(possibleMove / 8);
	
		return currentColumn === newColumn;
	
	}
	
	/**
	 * Checks vertical bounds for a diagonal possible move
	 * @param {number} lastMove - cell index of previous valid possible move
	 * @param {number} possibleMove - cell index of a possible move for checking
	 * @returns {boolean} - true - is in bounds, false - out of bounds
	 */
	static isInDiagonalBounds = (lastMove, possibleMove) => {
		if (possibleMove > 63 || possibleMove < 0) {
			return false;
		}
	
		const currentColumn = Math.floor(lastMove / 8);
		const newColumn = Math.floor(possibleMove / 8);
	
	
		return Math.abs(currentColumn - newColumn) === 1;
	
	}
	
	/**
	 * Checks a knight's possible moves for vertical bounds
	 * @param {number} cellIndex index of the current cell 
	 * @param {number} possibleMove cell index of a possible move for checking
	 * @returns {boolean} true - is in bounds, false - out of bounds
	 */
	static isKnightInBounds = (cellIndex, possibleMove) => {
		if (possibleMove > 63 || possibleMove < 0) {
			return false;
		}
	
		const currentColumn = Math.floor(cellIndex / 8);
		const currentRow = cellIndex - currentColumn * 8;
	
		const newColumn = Math.floor(possibleMove / 8);
		const newRow = possibleMove - newColumn * 8;
	
	
		return Math.abs(currentRow - newRow) <= 3;
	
	}
	
	/**
	 * Marks cells as possible moves
	 * @param {Array<number>} possibleMoves - array of cell indices of possible moves
	 * @param {String} team - indicates a team of the possible move 
	 * @returns {undefined} - returns void
	 */
	static markPossibleMoves = (possibleMoves, team, name) => {
	
		possibleMoves.forEach((move) => {
			board[move].isPossibleMove = true;
			if (name !== "pawn") {
				team === "white" ? board[move].isPossibleWhiteKill = true : board[move].isPossibleBlackKill = true;
			} else {
				team === "white" ? board[move].isPossibleWhiteKill = false : board[move].isPossibleBlackKill = false;
			}
			// else if (name === "pawn") {
			// 	board[move].isPossibleKill = false;
			// }
			board[move].moveFor = team;
		});
	}


	/**
	 * Executes with move() method
	 * 
	 * To Be Overridden
	 */
	moveExtra() {
		
	}

	/**
	 * Moves the chess piece to another cell
	 * @param {number} newCellIndex - index of a cell where the chess piece will be moved
	 * @returns {{result: boolean, killedPiece: ChessPiece}} - returns move result with killed chess piece (if it was killed)
	 */
	move(newCellIndex) {
		let killedPiece = null;

		if (this.possibleMoves.includes(newCellIndex)) {

			if (this.name === "king" && this.team === "white"
				&& board[newCellIndex].isPossibleBlackKill
				||
				this.name === "king" && this.team === "black"
				&& board[newCellIndex].isPossibleWhiteKill
				 
			) {
				console.log(board[newCellIndex].isPossibleKill);
				window.alert("Please don't kill your beloved king!");
				return {result: false, killedPiece};
			}

			if (board[newCellIndex].piece) {
				killedPiece = board[newCellIndex].piece;		
			}

			if (this.firstMove === true) {
				this.firstMove = false;
			}

			board[this.cellIndex].piece = null; //remove current chess piece
			board[newCellIndex].piece = this; //add to the new place
			this.cellIndex = newCellIndex;
			const cellHTML = document.getElementById(`cell-${newCellIndex}`);

			cellHTML.innerHTML = " ";
			cellHTML.appendChild(this.htmlElement);

			this.moveExtra();

			
			return {result: true, killedPiece};

		} else {
			return {result: false, killedPiece};
		}
	}

	/**
	 * Unique for every chess piece - gets possible moves for a specific chess piece and puts it into this.possibleMoves
	 * 
	 * to be overridden
	 * @returns {undefined}
	 */
	getPossibleMoves() {
	}

	/**
	 * Get possible moves for straight directions
	 * @param {number} modifier - how much cells to check in each direction (for rook - 8 (default), for king should be passed 1)
	 * @returns {Array<number>} - returns an array of indices of the possible moves
	 */
	getStraightMoves = (modifier = 8) => {
		const possibleMoves = [];

		/* 4 for loops check moves - up, down, left, right */

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex + i;

			if (!ChessPiece.isInVerticalBounds(this.cellIndex, possibleMove)) {
				break;
			};

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}
			
			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex - i;

			if (!ChessPiece.isInVerticalBounds(this.cellIndex, possibleMove)) {
				break;
			};

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex + i * 8;

			if (possibleMove < 0 || possibleMove > 63) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex - i * 8;
	
			if (possibleMove < 0 || possibleMove > 63) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}
		return possibleMoves;
		
	}

	/**
	 * Get possible moves for diagonal directions
	 * @param {number} modifier - how much cells to check in each direction (for rook - 8 (default), for king should be passed 1)
	 * @returns {Array<number>} - array of indices of possible diagonal moves
	 */
	getDiagonalMoves = (modifier = 8) => {
		const possibleMoves = [];

		/* 4 for loops check moves - up-right, down-left, down-right, up-left */

		for (let i = 1; i <= modifier; i++) {

			
			const possibleMove = this.cellIndex + i * 9;
			const lastMove = possibleMove - 9;

			if (possibleMove > 63 || possibleMove < 0) break;

			if (!ChessPiece.isInDiagonalBounds(lastMove, possibleMove)) {
				break;
			}
				

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}
			
			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex - i * 9;
			const lastMove = possibleMove + 9;

			if (possibleMove > 63 || possibleMove < 0) 
				break;

			if (!ChessPiece.isInDiagonalBounds(lastMove, possibleMove)) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex + i * 7;
			const lastMove = possibleMove - 7;

			if (possibleMove > 63 || possibleMove < 0) break;

			if (!ChessPiece.isInDiagonalBounds(lastMove, possibleMove)) {
				break;
			}


			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}

		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex - i * 7;
			const lastMove = possibleMove + 7;

			if (possibleMove > 63 || possibleMove < 0) break;

			if (!ChessPiece.isInDiagonalBounds(lastMove, possibleMove)) {
				break;
			}


			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				break;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				possibleMoves.push(possibleMove);
				break;
			}

			possibleMoves.push(possibleMove);
		}

		return possibleMoves;
		
	}

	/**
	 * Get HTML elements for cells of possible moves and add the className of "possible-move" to highlight them visually
	 * @returns {undefined}
	 */
	highlightPossibleMoves() {
		this.possibleMoves.forEach((move) => {
			document.getElementById("cell-"+ move).classList.add("possible-move");
		});
	}

	/**
	 * 
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		this.cellIndex = cellIndex;
		this.team = team;
	}
}
/****************** End of ChessPiece class **************/


class Pawn extends ChessPiece {
	icon = "♟";
	name = "pawn";

	firstMove = true;

	/**
	 * Get possible moves for a pawn
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		const direction = this.team === "white" ? 1 : -1;
		this.possibleMoves = [];

		for (let i = 1; i < 3; i++) {
			const possibleMove = this.cellIndex + i * direction;

			if (ChessPiece.isInVerticalBounds(this.cellIndex, possibleMove) !== true) {
				break;
			}

			if (board[possibleMove]?.piece?.team === this.team) {
				break;
			}
			
			if (i === 2 && this.firstMove === false) {
				break;
			}

			if (board[possibleMove].piece) {
				break;
			}
			this.possibleMoves.push(possibleMove);
		}

		//find possible kill ways
		const killMove1 = this.cellIndex + 9 * direction;
		const killMove2 = this.cellIndex - 7 * direction;

		if ( killMove1 >= 0 && killMove1 < 64 
			&& board[killMove1]?.piece
			&& board[killMove1]?.piece?.team !== this.team 
		) {
			this.possibleMoves.push(killMove1);
		}

		if ( killMove2 >= 0 && killMove2 < 64 
			&& board[killMove2]?.piece
			&& board[killMove2]?.piece?.team !== this.team 
		) {
			this.possibleMoves.push(killMove2);
		}


		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);
		if ( killMove1 >= 0 && killMove1 < 64 ) {
			this.team === "white" ? board[killMove1].isPossibleWhiteKill = true : board[killMove1].isPossibleBlackKill = true;
		}

		if ( killMove2 >= 0 && killMove2 < 64 ) {
			this.team === "white" ? board[killMove2].isPossibleWhiteKill = true : board[killMove2].isPossibleBlackKill = true;
		}

	}

	/**
	 * For pawns - if a pawn reach the opposite edge, trigger popup for promotion 
	 * @returns {undefined}
	 */
	moveExtra() {
		const currentColumn = Math.floor(this.cellIndex / 8);
		const currentRow = this.cellIndex - currentColumn * 8;
		
		if (currentRow === 7 || currentRow === 0) {
			
			document.getElementById("choose-new-piece").classList.add("display-block");
		}
	}

	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}



class Rook extends ChessPiece {
	icon = "♜";
	name = "rook";

	/**
	 * Get possible moves for a rook
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		const straightMoves = this.getStraightMoves();

		this.possibleMoves = [...straightMoves];

		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);

	}
	
	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}



class Knight extends ChessPiece {
	icon = "♞";
	name = "knight";

	/**
	 * Get possible moves for a knight
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		this.possibleMoves = [];

		const moves = [
			this.cellIndex + 10,
			this.cellIndex - 6,
			this.cellIndex + 6,
			this.cellIndex - 10,
			this.cellIndex + 17,
			this.cellIndex - 15,
			this.cellIndex + 15,
			this.cellIndex - 17,
		]

		for (const possibleMove of moves) {
			if (possibleMove > 63 || possibleMove < 0) 
			continue;

			if (!ChessPiece.isKnightInBounds( this.cellIndex, possibleMove)) {
				continue;
			}


			if (board[possibleMove].piece && board[possibleMove].piece.team === this.team) {
				continue;
			}

			if (board[possibleMove].piece && board[possibleMove].piece.team !== this.team) {
				this.possibleMoves.push(possibleMove);
				continue;
			}
			this.possibleMoves.push(possibleMove);

		}
		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);
	}

	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}



class Bishop extends ChessPiece {
	icon = "♝";
	name = "bishop";

	/**
	 * Get possible moves for a bishop
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		const diagonalMoves = this.getDiagonalMoves();

		this.possibleMoves = [...diagonalMoves];

		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);

	}

	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class Queen extends ChessPiece {
	icon = "♛";
	name = "queen";

	/**
	 * Get possible moves for a queen
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		const straightMoves = this.getStraightMoves();

		const diagonalMoves = this.getDiagonalMoves();

		this.possibleMoves = [...straightMoves, ...diagonalMoves];

		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);

	}

	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class King extends ChessPiece {
	icon = "♚";
	name = "king";

	/**
	 * Get possible moves for a king
	 * @returns {undefined}
	 * @override
	 */
	getPossibleMoves() {
		const straightMoves = this.getStraightMoves(1);

		const diagonalMoves = this.getDiagonalMoves(1);

		this.possibleMoves = [...straightMoves, ...diagonalMoves];

		ChessPiece.markPossibleMoves(this.possibleMoves, this.team, this.name);

	}

	//ToDo: moveExtra checks if new king's cell is dangerous, triggers a popup and declines moving

	/**
	 * @param {String} team 
	 * @param {number} cellIndex 
	 */
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

export { ChessPiece, Queen, Knight, Rook, Bishop }