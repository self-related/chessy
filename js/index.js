import { initCells } from "./cells.js";
import { initFigures } from "./figures.js";
import * as updateElements from "./updateElements.js";


export const cells = initCells(); // Array(64), все клетки доски в массиве
let figures = initFigures(cells); //все фигуры в массиве
const allPossibleMoves = { //возможные ходы на текущий ход
    white: [],
    black: []
};
const king = { //короли команд
    white: figures.find(figure => figure.name === "king" && figure.team === "white"),
    black: figures.find(figure => figure.name === "king" && figure.team === "black"),
};

//статусы: чей ход, выбранная фигура (по клику), есть ли шах для команд, есть ли шах и мат
export const states = { 
    teamTurn: "white",
    figureChosen: null, // объект Fugure
    isCheck: {
        white: false,
        black: false,
    },
    isCheckMate: false,
};


//обновить возможные ходы команд
const updatePossibleMoves = () => {
    allPossibleMoves.white = [];
    allPossibleMoves.black = [];

    figures.forEach(figure => {
        const figurePossibleMoves = figure.setPossibleMoves();

        allPossibleMoves[figure.team] = [...allPossibleMoves[figure.team], ...figurePossibleMoves];
    });
}

//проверить только шах
const checkCheck = () => {
    let kingFigure = king["white"]; //король проверяемой команды
    states.isCheck["white"] = allPossibleMoves["black"].some(move => move === kingFigure.cell.index);

    kingFigure = king["black"];
    states.isCheck["black"] = allPossibleMoves["white"].some(move => move === kingFigure.cell.index);


    if (states.isCheck.white || states.isCheck.black) {

        // если поставил под удар своего короля == сразу шах и мат
        if (states.isCheck.white && states.teamTurn !== "white"
            || states.isCheck.black && states.teamTurn !== "black"
        ) { 
            alert("Шах и мат\n\nИгра окончена");
            states.isCheckMate = true;
        } else { 
            //иначе просто шах
            alert("Шах!");
        }
    }

}

//если пешка дошла до края
const checkPawnEdge = (cell) => {
    if (cell.index > 55 || cell.index < 8) {
        console.log("Edge");
        const dialogPawnChange = document.getElementById("dialog-pawn-change");
        dialogPawnChange.innerHTML += "test";
        const classTeam = cell.figure.team === "white" ? "team-white" : "team-black";
        
        const onClick = (event) => {
            cell.figure.name = event.target.name;
            cell.figure.symbol = event.target.symbol;

            dialogPawnChange.classList.toggle("hidden");
            updateElements.updateCellElements(cells);
            updatePossibleMoves();
        };

        dialogPawnChange.classList.toggle("hidden");
        dialogPawnChange.innerHTML = "";
        dialogPawnChange.innerHTML += '<h2 class="text-center">Выберите фигуру вместо пешки:</h2>';
        [
            {
                name: "knight",
                symbol: "♞"
            },
            {
                name: "queen",
                symbol: "♛"
            },
            {
                name: "rook",
                symbol: "♜"
            },
            {
                name: "bishop",
                symbol: "♝"
            },
        ].forEach((figure) => {
            const figureElement = document.createElement("p");

            figureElement.name = figure.name;
            figureElement.symbol = figure.symbol;
            // figureElement.classList.add(classTeam);
            figureElement.classList.add("option-new-figure");
            figureElement.innerHTML += `<span class="${classTeam}">${figure.symbol}</span> ${figure.name}`
            figureElement.addEventListener("click", onClick);
            dialogPawnChange.appendChild(figureElement);
        });
    }
};

//передвинуть выбранную фигуру на новое место
const moveFigure = (figureChosen, cell) => {

    //убрать фигуру из текущей клетки
    figureChosen.cell.figure = null;

    //поместить ссылку на новую клетку в фигуру
    figureChosen.cell = cell;

    //убить фигуру соперника, если она есть в клетке и убрать из массива
    if (cell.figure) {
        figures = figures.filter((figure) => figure !== cell.figure); 
    }
    
    //первый ход использован - нужно только для пешки
    if (figureChosen.isFirstMove) {
        figureChosen.isFirstMove = false;
    }
    
    //поместить ссылку на текущую фигуру в новую клетку
    cell.figure = figureChosen;


    if (cell.figure.name === "pawn") {
        console.log("cell index" + cell.index);
        checkPawnEdge(cell);
    }

    updatePossibleMoves();
};

//обработка клика по клетке
export const cellElementsClickHandler = (event) => {
    if (states.isCheckMate) {
        return;
    }

    const cell = event.target.cell; //достать из HTML элемента ссылку на клетку в основном массиве
    const figure = event.target.cell.figure; //достать фигуру из HTML элемента (если есть)

    //если в клетке есть фигура текущей команды, то выбрать ее для следующего клика 
    if (figure && figure.team === states.teamTurn) {
        states.figureChosen = figure;
        const possibleMoves = figure.possibleMoves;

        //проверить все клетки и отметить в них возможные ходы для текущей фигуры
        cells.forEach((cell) => {
            if (possibleMoves.includes(cell.index)){
                cell.isPossibleMove = true;
            } else {
                cell.isPossibleMove = false;
            }
        });

    //если если нет фигуры и клетка не является возможным ходом для текущей фигуры 
    } else if (!cell.figure && !cell.isPossibleMove) {
        console.log("not a figure");
        states.figureChosen = null;

    //если фигура выбрана и кликнут возможный ход
    } else if ( states.figureChosen && cell.isPossibleMove ) {

        moveFigure(states.figureChosen, cell); //передвинуть фигуру

        //сменить текущую команду
        if (states.teamTurn === "white") {
            states.teamTurn = "black";
        } else {
            states.teamTurn = "white";
        }

        states.figureChosen = null; //фигура снова не выбрана

        //проверить на шах
        checkCheck();
    }

    //обновить HTML
    updateElements.updateCellElements(cells);
};


//первое обновление HTML и возможных ходов
updateElements.updateCellElements(cells); 
updatePossibleMoves();
