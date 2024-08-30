
// Тут просчитываются возможные ходы в зависимости от вида фигуры


import { cells } from "./index.js";

let chosenFigure = null; //проверяемая в данный момент фигура

function move(currentCellIndex, offset) { 
    //если прошлая клетка была null, следующие тоже null
    if (currentCellIndex === null) 
        return null;

    const newCellIndex = currentCellIndex + offset; // index новой клетки

    const checkVertical = newCellIndex <= 63 && newCellIndex >= 0 ; //проверка на вертикальные границы == проверка границ всего массива 

    const currentColumn = currentCellIndex % 8; //столбец сейчас
    const newColumn = newCellIndex % 8;         //новый столбец 
    const checkHorizontal = Math.abs( currentColumn - newColumn ) <= 1; //если смещение столбца больше 1, то нарушена граница по горизонтали
    
    const success = checkVertical && checkHorizontal; //проверки пройдены

    //вернуть null, если в текущем направлении уже была фигура
    if (success && cells[currentCellIndex].figure !== null) {
        if (cells[currentCellIndex].figure !== chosenFigure) { //т.е. если фигура из прошлой клетки не текущая выбранная
            return null;
    
        }
    }

    return success ? newCellIndex : null; //вернуть id следующего возможного хода, если проверки пройдены, иначе null
}

//только для коня
function moveKnight(currentCellIndex, offset) { 
    if (currentCellIndex === null) 
        return null;

    const newCellIndex = currentCellIndex + offset; 

    const checkVertical = newCellIndex <= 63 && newCellIndex >= 0
    
    const currentColumn = currentCellIndex % 8; 
    const newColumn = newCellIndex % 8;        
    const checkHorizontal = Math.abs( currentColumn - newColumn ) <= 2; //если смещение столбца больше 2 (только для коня), то нарушена граница по горизонтали
    
    const success = checkVertical && checkHorizontal; 

    return success ? newCellIndex : null; 
}


export const rook = (figure) => {
    chosenFigure = figure;
    let allMoves = [];
    let currentMoves = Array(4).fill(figure.cell.index);

    while ( true ) {
        const up = move(currentMoves[0], 8);      // 1 клетка вверх, т.е. +8 клеток в массиве

        const down = move(currentMoves[1], -8);   // 1 клетка вниз, -8
        
        const left = move(currentMoves[2], -1);   // 1 клетка влево, -1

        const right = move(currentMoves[3], 1);   // 1 клетка вправо, +1

        currentMoves = [up, down, left, right];


        if (currentMoves.every(el => el == null))
            break;
        
        currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );

    }

    figure.possibleMoves = allMoves;

    return allMoves;
}

export const bishop = (figure) => {
    chosenFigure = figure;
    const allMoves = [];
    let currentMoves = Array(4).fill(figure.cell.index);
        
    while ( true ) {
        const upLeft = move(currentMoves[0], 7);      

        const upRight = move(currentMoves[1], 9);   
        
        const downLeft = move(currentMoves[2], -9);  

        const downRight = move(currentMoves[3], -7);   

        currentMoves = [upLeft, upRight, downLeft, downRight];

        if (currentMoves.every(el => el == null))
            break;

        currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );
    }
    figure.possibleMoves = allMoves;

    return allMoves;
}

export const queen = (figure) => {
    chosenFigure = figure;
    const allMoves = [];
    let currentMoves = Array(8).fill(figure.cell.index);
        
    while ( true ) {
        const up = move(currentMoves[0], 8, figure);      // 1 клетка вверх, т.е. +8 клеток в массиве

        const down = move(currentMoves[1], -8);   // 1 клетка вниз, -8
        
        const left = move(currentMoves[2], -1);   // 1 клетка влево, -1

        const right = move(currentMoves[3], 1);   // 1 клетка вправо, +1

        const upLeft = move(currentMoves[4], 7);     

        const upRight = move(currentMoves[5], 9);   
        
        const downLeft = move(currentMoves[6], -9);   

        const downRight = move(currentMoves[7], -7);  


        currentMoves = [up, down, left, right, upLeft, upRight, downLeft, downRight];

        if (currentMoves.every(el => el == null))
            break;

        currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );
    }

    figure.possibleMoves = allMoves;

    return allMoves;
}


export const king = (figure) => {
    chosenFigure = figure;
    const allMoves = [];
    let currentMoves = Array(8).fill(figure.cell.index);
        
    const up = move(currentMoves[0], 8);      // 1 клетка вверх, т.е. +8 клеток в массиве

    const down = move(currentMoves[1], -8);   // 1 клетка вниз, -8
    
    const left = move(currentMoves[2], -1);   // 1 клетка влево, -1

    const right = move(currentMoves[3], 1);   // 1 клетка вправо, +1

    const upLeft = move(currentMoves[4], 7);     

    const upRight = move(currentMoves[5], 9);   
    
    const downLeft = move(currentMoves[6], -9);   

    const downRight = move(currentMoves[7], -7);  

    currentMoves = [up, down, left, right, upLeft, upRight, downLeft, downRight];
    currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );

    figure.possibleMoves = allMoves;

    return allMoves;
}


export const pawn = (figure) => {
    chosenFigure = figure;
    const allMoves = [];
    let currentMoves = Array(3).fill(figure.cell.index);
    
    let moveUp = 8;
    let moveUpLeft = 7;
    let moveUpRight = 9;

    if (figure.team === "black") {
        moveUp = -8;
        moveUpLeft = -9;
        moveUpRight = -7;
    }

    let up = move(currentMoves[0], moveUp);      // 1 клетка вверх, т.е. +8 клеток в массиве
    if (cells[up]?.figure) { //пешка не убивает по вертикали
        up = null;
    }
    
    let upLeft;
    let upRight;
    
    upLeft = move(currentMoves[1], moveUpLeft);
    if (!cells[upLeft]?.figure) {
        upLeft = null;
    }
 
    upRight = move(currentMoves[2], moveUpRight);
    if (!cells[upRight]?.figure) {
        upRight = null;
    }
    
    currentMoves = [up, upLeft, upRight];

    if (figure.isFirstMove) { //если у пешки первый ход, то еще +1 клетка вверх
        let upFirstMove = move(up, moveUp);

        if (cells[upFirstMove]?.figure) { //пешка не убивает по вертикали
            upFirstMove = null;
        }
        currentMoves.push(upFirstMove);
    }


    currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );
    
    figure.possibleMoves = allMoves;

    return allMoves;
}

export const knight = (figure) => {
    chosenFigure = figure;
    const allMoves = [];
    let currentMoves = Array(4).fill(figure.cell.index);
        
    const upLeft1 = moveKnight(currentMoves[0], 6);   
    const upLeft2 = moveKnight(currentMoves[0], 15);   

    const upRight1 = moveKnight(currentMoves[1], 10);   
    const upRight2 = moveKnight(currentMoves[1], 17);   

    const downLeft1 = moveKnight(currentMoves[2], -10);  
    const downLeft2 = moveKnight(currentMoves[2], -17);  

    const downRight1 = moveKnight(currentMoves[3], -6);   
    const downRight2 = moveKnight(currentMoves[3], -15);   

    currentMoves = [upLeft1, upLeft2, upRight1, upRight2, downLeft1, downLeft2, downRight1, downRight2 ];
    currentMoves.forEach((move) => (move !== null) ? allMoves.push(move) : 0 );

    // console.log(allMoves);
    figure.possibleMoves = allMoves;

    return allMoves;
}