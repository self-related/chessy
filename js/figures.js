import * as moves from "./moves.js";

//все фигуры для спавна: имя, Unicode символ, координаты: ряды и буквы (ряды сразу для черных и белых)
const INITIAL_FIGURES_MAP = [
    {
        name: "pawn", 
        symbol: "♟",
        initialRow: [2, 7], //второй и седьмой ряд - белые и черных пешки
        initialLetter: ["A", "B", "C", "D", "E", "F", "G", "H"], 
    },
    { 
        name: "rook", 
        symbol: "♜",
        initialRow: [1, 8], //ряд 1 и 8 - старшие фигуры
        initialLetter: ["A", "H"],
    },
    {
        name: "knight", 
        symbol: "♞",
        initialRow: [1, 8],
        initialLetter: ["B", "G"],
    },
    {
        name: "bishop", 
        symbol: "♝",
        initialRow: [1, 8],
        initialLetter: ["C", "F"],
    },
    {
        name: "queen", 
        symbol: "♛",
        initialRow: [1, 8],
        initialLetter: ["D"],
    },
    {
        name: "king", 
        symbol: "♚",
        initialRow: [1, 8],
        initialLetter: ["E"],
    },
];

//объект для фигуры
function Figure(cell, initialFigure) {  
    const {name, symbol} = initialFigure;
    
    this.cell = cell;
    this.name = name;
    this.team = cell.coords[1] < 5 ? "white" : "black";
    this.symbol = symbol;
    this.possibleMoves = null;
    this.setPossibleMoves = () => moves[name](this);
    this.isFirstMove = true; // нужно только для пешки
}
    
//расставить фигуры внутри клеток
export function initFigures(cells) {
    const figures = []; //общий массив фигур

    //проходимся по всем клеткам
    cells.forEach( (cell) => {
        //проходимся по мапе фигур
        INITIAL_FIGURES_MAP.forEach( (initialFigure) => {
            //если в фигуре из мапы есть ряд и буква текущей клетки
            if (initialFigure.initialRow.includes(cell.coords[1])
                && initialFigure.initialLetter.includes(cell.coords[0])
            ) {
                //создать фигуру, поместить в текущую клетку ссылку на эту фигуру
                const figure = new Figure(cell, initialFigure)
                cell.figure = figure;
                //добавить фигуру к общему массиву
                figures.push(figure);
            }
        });
    });

    //вернуть массив фигур
    return figures;
}


