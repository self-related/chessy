//найти букву для клетки
const getLetter = (index) => { // (int) -> String
    const inititalLetterCode = 'A'.charCodeAt(0);
    const offset = index - Math.floor(index / 8) * 8; //смещение == индекс - полный ряд
    const letter = String.fromCharCode(inititalLetterCode + offset);

    return letter;
};

//цвет клетки в зависимости от ряда
const getCellColor = (index, row) => { // (int, int) -> bool
    const isRowOdd = row / 2 !== Math.floor(row / 2);
    const isIndexEven = index / 2 === Math.floor(index / 2);
    const isBlack = isRowOdd ? isIndexEven : !isIndexEven;   //если ряд нечетный то черные клетки меняются 

    return isBlack;
};

export function initCells() { // () -> Array(64)
    const cells = new Array(64).fill(null);
    cells.forEach((__, index) => {
        const row = Math.floor(index / 8) + 1;     //ряд клетки, от 1 до 8
        const letter = getLetter(index);           //буква клетки, от A до H
        const isBlack = getCellColor(index, row);  //черная или белая
        const id = `cell-${index}`;                //id с индексом

        cells[index] = {
            coords: [letter, row],
            figure: null,
            id,
            index,
            isBlack,
        };
    });
    
    return cells;
};

