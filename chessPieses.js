
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

const isInVerticalBounds = (cellIndex, possibleMove) => {
	if (possibleMove > 63 || possibleMove < 0) {
		return false;
	}

	const currentColumn = Math.floor(cellIndex / 8);

	const newColumn = Math.floor(possibleMove / 8);

	return currentColumn === newColumn;

}

const isInDiagonalBounds = (lastMove, possibleMove) => {
	if (possibleMove > 63 || possibleMove < 0) {
		return false;
	}

	const currentColumn = Math.floor(lastMove / 8);
	const newColumn = Math.floor(possibleMove / 8);


	return Math.abs(currentColumn - newColumn) === 1;

}

const isKnightInBounds = (cellIndex, possibleMove) => {
	if (possibleMove > 63 || possibleMove < 0) {
		return false;
	}

	const currentColumn = Math.floor(cellIndex / 8);
	const currentRow = cellIndex - currentColumn * 8;

	const newColumn = Math.floor(possibleMove / 8);
	const newRow = possibleMove - newColumn * 8;


	return Math.abs(currentRow - newRow) <= 3;

}

const markPossibleMoves = (possibleMoves, team) => {

	possibleMoves.forEach((move) => {
		board[move].isPossibleMove = true;
		board[move].moveFor = team;
	});
}


class ChessPiece {

	/**@type {String} */
	team = null;
	
	
	/**@type {number} */ 
	cellIndex = null;
	
	/**@type {Array<number>} */ 
	possibleMoves = [];

	htmlElement = null;

	moveExtra() {}

	move(newCellIndex) {
		let killedPiece = null;

		if (this.possibleMoves.includes(newCellIndex)) {

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

			
			/**@returns {ChessPiece} */
			return {result: true, killedPiece};
		} else {
			return {result: false, killedPiece};
		}
	}

	getPossibleMoves() {}

	getStraightMoves = (modifier = 8) => {
		const possibleMoves = [];

		//get moves up
		for (let i = 1; i <= modifier; i++) {

			const possibleMove = this.cellIndex + i;

			if (!isInVerticalBounds(this.cellIndex, possibleMove)) {
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

			if (!isInVerticalBounds(this.cellIndex, possibleMove)) {
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

	getDiagonalMoves = (modifier = 8) => {
		const possibleMoves = [];

		//get moves up-right
		for (let i = 1; i <= modifier; i++) {

			
			const possibleMove = this.cellIndex + i * 9;
			const lastMove = possibleMove - 9;

			if (possibleMove > 63 || possibleMove < 0) break;

			if (!isInDiagonalBounds(lastMove, possibleMove)) {
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

			if (!isInDiagonalBounds(lastMove, possibleMove)) {
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

			if (!isInDiagonalBounds(lastMove, possibleMove)) {
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

			if (!isInDiagonalBounds(lastMove, possibleMove)) {
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


	highlightPossibleMoves() {
		this.possibleMoves.forEach((move) => {
			document.getElementById("cell-"+ move).classList.add("possible-move");
		});
	}

	constructor(team, cellIndex) {
		this.cellIndex = cellIndex;
		this.team = team;
	}
}

class Pawn extends ChessPiece {
	icon = "♟";
	name = "pawn";

	firstMove = true;

	//override
	getPossibleMoves() {
		const direction = this.team === "white" ? 1 : -1;
		this.possibleMoves = [];

		for (let i = 1; i < 3; i++) {
			const possibleMove = this.cellIndex + i * direction;

			if (isInVerticalBounds(this.cellIndex, possibleMove) !== true) {
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


		markPossibleMoves(this.possibleMoves, this.team);
	}

	//override
	moveExtra() {
		const currentColumn = Math.floor(this.cellIndex / 8);
		const currentRow = this.cellIndex - currentColumn * 8;
		
		if (currentRow === 7 || currentRow === 0) {
			
			document.getElementById("choose-new-piece").classList.add("display-block");
		}
	}

	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}


class Rook extends ChessPiece {
	icon = "♜";
	name = "rook";

	//override

	getPossibleMoves() {
		const straightMoves = this.getStraightMoves();

		this.possibleMoves = [...straightMoves];

		markPossibleMoves(this.possibleMoves, this.team);

	}
	

	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class Knight extends ChessPiece {
	icon = "♞";
	name = "knight";

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

			if (!isKnightInBounds( this.cellIndex, possibleMove)) {
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
		markPossibleMoves(this.possibleMoves, this.team);
	}

	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class Bishop extends ChessPiece {
	icon = "♝";
	name = "bishop";

	getPossibleMoves() {
		const diagonalMoves = this.getDiagonalMoves();

		this.possibleMoves = [...diagonalMoves];

		markPossibleMoves(this.possibleMoves, this.team);

	}

	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class Queen extends ChessPiece {
	icon = "♛";
	name = "queen";

	getPossibleMoves() {
		const straightMoves = this.getStraightMoves();

		const diagonalMoves = this.getDiagonalMoves();

		this.possibleMoves = [...straightMoves, ...diagonalMoves];

		markPossibleMoves(this.possibleMoves, this.team);

	}

	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

class King extends ChessPiece {
	icon = "♚";
	name = "king";

	getPossibleMoves() {
		const straightMoves = this.getStraightMoves(1);

		const diagonalMoves = this.getDiagonalMoves(1);

		this.possibleMoves = [...straightMoves, ...diagonalMoves];

		markPossibleMoves(this.possibleMoves, this.team);

	}
	constructor(team, cellIndex) {
		super(team, cellIndex);
	}
}

export { ChessPiece, Queen, Knight, Rook, Bishop }