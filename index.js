import { initPieces, ChessPiece, Queen, Knight, Rook, Bishop } from "./chessPieses.js";

//JSDoc types:

/**
 * @typedef {Object} Board
 * @prop {Array<string | number>} coords
 */


//Global vars

/**@type {ChessPiece} */
let selectedPiece = null;

let currentTurn = "white";

let checkWhiteCount = 0; //count untill 2 before lose
let checkBlackCount = 0;

let gameOverCover = document.createElement("div");

gameOverCover.className = "game-over";

export const board = initBoard();
let pieces = initPieces();
const boardHTML = initBoardHTML(board);
updatePiecesHTML(board, pieces); //update and debug

// Functions

function initBoard(cells = new Array(64).fill(null)) {
	const board = cells.map((_cell, index) => (
		{
			/**@type {ChessPiece} */
			piece: null,
			isPossibleMove: false,
		}
	));

	/**@returns {Board} */
	return board;
}

const cleanPossibleMoves = () => {
	board.forEach((cell, index) => {
		cell.isPossibleMove = false;
		cell.moveFor = null;
		document.getElementById("cell-"+ index).classList.remove("possible-move");
	});
}

const updatePossibleMoves = () => {
	pieces.forEach(piece => piece.getPossibleMoves());
};

function isCheck() {
	board.find((cell) => {
		if (cell.piece?.name === "king" && cell.moveFor === "black") {
			alert("Check! Save white king!");
			checkWhiteCount++;
		} else if (cell.piece?.name === "king" && cell.piece?.team === "white" && cell.moveFor === null) {
			checkWhiteCount = 0;
		}
	});
	board.find((cell) => {
		if (cell.piece?.name === "king" && cell.moveFor === "white") {
			alert("Check! Save black king!");
			checkBlackCount++;
		} else if (cell.piece?.name === "king" && cell.piece?.team === "black" && cell.moveFor === null) {
			checkBlackCount = 0;
		}
	});

	if (checkWhiteCount === 2) {
		alert("Blacks won!");
		boardHTML.appendChild(gameOverCover);
	} else if (checkBlackCount === 2) {
		alert("Whites won!");
		boardHTML.appendChild(gameOverCover);
	}
}

function move(newCellIndex) {
	const {result, killedPiece} = selectedPiece.move(newCellIndex);

	if (!result) {
		cleanPossibleMoves(); 
		selectedPiece = null;
		return;
	}
	if (killedPiece !== null) {
		console.log(killedPiece.name + " " + killedPiece.team + " is killed!");
		pieces = pieces.filter((piece) => piece != killedPiece);
	}

	if (currentTurn === "white") {
		currentTurn = "black";
	} else {
		currentTurn = "white";
	}

	cleanPossibleMoves();
	updatePossibleMoves();
	setTimeout(isCheck, 0); //check after html render
}


function updatePiecesHTML(board, pieces) {
	const piecesHTML = []; //for debug


	for (const piece of pieces) {

		board.forEach((cell, index) => {
			const currentCell = document.getElementById(`cell-${index}`);

			if (currentCell.id === `cell-${piece.cellIndex}`) {
				board[index].piece = piece;

				const pieceHTML = document.createElement("div");
				pieceHTML.innerText = piece.icon;
				pieceHTML.className = `chess-piece chess-piece-${piece.team}`;
				piece.htmlElement = pieceHTML;

				pieceHTML.addEventListener("click", (e) => {
					e.stopPropagation(); //stop propagation!
					if (piece.team !== currentTurn && !selectedPiece)
					{return};

					if (selectedPiece && piece.team !== currentTurn) {
						move(piece.cellIndex); 
						return;
					}
					
					
					selectedPiece = piece;

					cleanPossibleMoves();
					updatePossibleMoves();
					piece.highlightPossibleMoves();
				});

				
				currentCell.innerHTML = '';				
				currentCell.appendChild(pieceHTML);
				

				piecesHTML.push(pieceHTML); //for debug
			}
		});

	}

	return piecesHTML; //for debug
}


/** @param {Array<Board>} board */
function initBoardHTML(board) {

	const boardHTML = document.getElementById("board");
	boardHTML.innerHTML = '';

	board.forEach((cell, index) => {
		const isColumnEven = Math.floor(index / 8) % 2 === 0;
		const columnOrder = isColumnEven ? "column-even" : "column-odd";

		const cellHTML = document.createElement("div");
		cellHTML.className = `cell ${columnOrder}`;
		cellHTML.id = `cell-${index}`;

		boardHTML.appendChild(cellHTML);

		cellHTML.addEventListener("click", (e) => {
			console.log("cell id: " + cellHTML.id);
			if (selectedPiece) {
				console.log("move");
				move(index);
			}
		})
	});

	return boardHTML;
}


const chooseNewPieceWindow = document.getElementById("choose-new-piece");
const chooseNewPieceDivs = document.querySelectorAll("#choose-new-piece > div");
chooseNewPieceDivs.forEach((element) => {
	element.addEventListener("click", (e) => {

		let newElement = null;

		switch (e.target.innerText) {
			case "♛ Queen" :
				newElement = new Queen(selectedPiece.team, selectedPiece.cellIndex);
				break;
			case "♞ Knight" :
				newElement = new Knight(selectedPiece.team, selectedPiece.cellIndex);
				break;
			case "♜ Rook" :
				newElement = new Rook(selectedPiece.team, selectedPiece.cellIndex);
				break;
			case "♝ Bishop" :
				newElement = new Bishop(selectedPiece.team, selectedPiece.cellIndex);
				break;
		}
		
		pieces = pieces.filter(piece => piece !== selectedPiece);
		pieces.push(newElement);

		updatePiecesHTML(board, pieces);
		updatePossibleMoves();
		setTimeout(isCheck, 0); //check after html render

		chooseNewPieceWindow.classList.remove("display-block");
	});
})

