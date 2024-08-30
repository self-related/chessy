import { states } from "./index.js";
import { cellElementsClickHandler } from "./index.js";

export function updateCellElements(cells){
    const boardElement = document.getElementById("board"); //доска
    boardElement.innerHTML = ""; //очистить доску

    cells.forEach((cell) => {
        //создать элемент для проверяемой клетки
        const cellElement = document.createElement("button");
        cellElement.id = cell.id;
        cellElement.classList.add("cell");
        cellElement.cell = cell; //ссылка на себя из основного массива, чтобы потом обратиться к ней по клику
        cell.isBlack ? cellElement.classList.add("cell-black") : null;
        cellElement.addEventListener("click", cellElementsClickHandler);

        //фигура внутри клетки, если есть
        if (cell.figure !== null) {
            cellElement.innerHTML = cell.figure.symbol;
            cellElement.classList.add(`team-${cell.figure.team}`); //раскрасить нужным цветом
            cellElement.onclick = cell.figure.action;
        }

        //если проверяемая клетка - возможный ход для текущей выбранной фигуры И не содержит фигуру этой же команды
        if (cell.isPossibleMove 
            && states.figureChosen?.possibleMoves?.includes(cell.index)
            && cell.figure?.team !== states.figureChosen?.team  
        ) {
            cellElement.classList.add("possible-move");
        } else {
            cellElement.classList.remove("possible-move");

        }
        

        boardElement.appendChild(cellElement);
    });
}

