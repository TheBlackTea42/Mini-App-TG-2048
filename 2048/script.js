const gridSize = 4;
let grid = [];
let score = 0;
let bestscore = 0;
if(localStorage.getItem('best')){
    textbestscore = document.getElementById("bestscores")
    bestscore = localStorage.getItem('best')
    textbestscore.innerHTML = bestscore
}
// Создание пустой сетки
function createEmptyGrid() {
    return Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
}

// Отображение сетки в DOM
function renderGrid() {
    const gameContainer = document.getElementById("game-container");
    gameContainer.innerHTML = ""; // Очистить контейнер перед отрисовкой

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const value = grid[row][col];
            const tile = document.createElement("div");
            tile.className = "tile";

            // Если в клетке есть значение, добавляем его

                tile.dataset.value = value;
                tile.textContent = value;
                console.log(value)
                if (value === 0) {
                tile.classList.add("zero")
            }

            gameContainer.appendChild(tile);
        }
    }
}

// Спавн новой плитки
function spawnTile() {
    const emptyTiles = [];
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 0) {
                emptyTiles.push({ row, col });
            }
        }
    }

    // Если есть пустые клетки, добавляем новую плитку
    if (emptyTiles.length > 0) {
        const { row, col } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Сжатие строки (удаление нулей)
function compress(row) {
    const newRow = row.filter(value => value !== 0);
    while (newRow.length < gridSize) {
        newRow.push(0);
    }
    return newRow;
}

// Слияние плиток
function merge(row) {
    for (let i = 0; i < gridSize - 1; i++) {
        if (row[i] === row[i + 1] && row[i] !== 0) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i]
            updatescore()
        }
    }
    return row;
}
function updatescore(){
    textscore = document.getElementById("scores")
    textbestscore = document.getElementById("bestscores")
    
    textscore.innerHTML = score
    if(parseInt(textbestscore.innerHTML) <= parseInt(textscore.innerHTML)){
        textbestscore.innerHTML = score
        localStorage.setItem('best', score);

    }
}
// Двигаем плитки влево
function moveLeft() {
    let moved = false;
    for (let row = 0; row < gridSize; row++) {
        const compressed = compress(grid[row]);
        const merged = merge(compressed);
        const finalRow = compress(merged);

        if (grid[row].toString() !== finalRow.toString()) {
            moved = true;
            grid[row] = finalRow;
        }
    }
    return moved;
}

// Двигаем плитки вправо
function moveRight() {
    let moved = false;
    for (let row = 0; row < gridSize; row++) {
        const reversedRow = [...grid[row]].reverse();
        const compressed = compress(reversedRow);
        const merged = merge(compressed);
        const finalRow = compress(merged).reverse();

        if (grid[row].toString() !== finalRow.toString()) {
            moved = true;
            grid[row] = finalRow;
        }
    }
    return moved;
}

// Двигаем плитки вверх
function moveUp() {
    let moved = false;
    for (let col = 0; col < gridSize; col++) {
        const column = grid.map(row => row[col]);
        const compressed = compress(column);
        const merged = merge(compressed);
        const finalColumn = compress(merged);

        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col] !== finalColumn[row]) {
                moved = true;
                grid[row][col] = finalColumn[row];
            }
        }
    }
    return moved;
}

// Двигаем плитки вниз
function moveDown() {
    let moved = false;
    for (let col = 0; col < gridSize; col++) {
        const column = grid.map(row => row[col]).reverse();
        const compressed = compress(column);
        const merged = merge(compressed);
        const finalColumn = compress(merged).reverse();

        for (let row = 0; row < gridSize; row++) {
            if (grid[row][col] !== finalColumn[row]) {
                moved = true;
                grid[row][col] = finalColumn[row];
            }
        }
    }
    return moved;
}

// Проверка на проигрыш
function isGameOver() {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === 0) return false; // Есть пустая клетка
            if (col < gridSize - 1 && grid[row][col] === grid[row][col + 1]) return false; // Горизонтальное слияние
            if (row < gridSize - 1 && grid[row][col] === grid[row + 1][col]) return false; // Вертикальное слияние
        }
    }
    return true;
}







// Обработка нажатий клавиш
function handleKeyPress(event) {
    let moved = false;
    const gameContainer = document.getElementById("game-container");
    clearanimations()
    switch (event.key) {
        case "ArrowLeft":
            moved = moveLeft();
            gameContainer.classList.add("lefts")

            
            break;
        case "ArrowRight":
            moved = moveRight();
            gameContainer.classList.add("rights")

            break;
        case "ArrowUp":
            moved = moveUp();
            gameContainer.classList.add("tops")
            break;
        case "ArrowDown":
            moved = moveDown();
            gameContainer.classList.add("downs")

            break;
    }

    if (moved) {
        spawnTile(); // Добавляем новую плитку после успешного хода
        renderGrid(); // Обновляем сетку

        // Проверяем, не завершилась ли игра
        if (isGameOver()) {
            alert("Game Over!");
            document.removeEventListener("keydown", handleKeyPress); // Отключаем управление
        }
    }
}


function handleSwipe(dir) {
    let moved = false;
    const gameContainer = document.getElementById("game-container");
    clearanimations()
    switch (dir) {
        case "left":
            moved = moveLeft();
            gameContainer.classList.add("lefts")

            
            break;
        case "right":
            moved = moveRight();
            gameContainer.classList.add("rights")

            break;
        case "up":
            moved = moveUp();
            gameContainer.classList.add("tops")
            break;
        case "down":
            moved = moveDown();
            gameContainer.classList.add("downs")

            break;
    }

    if (moved) {
        spawnTile(); // Добавляем новую плитку после успешного хода
        renderGrid(); // Обновляем сетку

        // Проверяем, не завершилась ли игра
        if (isGameOver()) {
            alert("Game Over!");
            document.removeEventListener("keydown", handleKeyPress); // Отключаем управление
        }
    }
}

// Инициализация игры
function initGame() {
    grid = createEmptyGrid();
    spawnTile();
    spawnTile();
    renderGrid();
}
function clearanimations(){
    const gameContainer = document.getElementById("game-container");
    gameContainer.classList.remove("tops")
    gameContainer.classList.remove("downs")
    gameContainer.classList.remove("lefts")
    gameContainer.classList.remove("rights")
}
// Слушаем события клавиш
document.addEventListener("keydown", handleKeyPress);
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
var xDown = null;
var yDown = null;
function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}
function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
};
function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }
    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;
    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        
        if ( xDiff > 0 ) {
            handleSwipe("left")
        } else {
            handleSwipe("right")
        }
    } else {
        if ( yDiff > 0 ) {
            handleSwipe("up")
        } else {
            handleSwipe("down")
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

// Запускаем игру
initGame();