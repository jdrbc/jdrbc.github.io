// reusing code from a long time ago-- please don't judge too harshly! :) 

// Initialize global variables

// Grid containing the game state
window.grid = [];

// Grid background color
window.backgroundColor = '#FFFFFF';

// Grid line color
window.gridColor = '#000000';

// Live cell color
window.cellColor = '#267CB9';

// Number of cells in the horizontal rows
window.numCellsX = 0;

// Number of cells in the vertical rows
window.numCellsY = 0;

// The size of the grid cells in pixels
window.cellSize = 40;

// The size of the grid lines relative to cell size
window.gridLineWidthRatio = 10;

// The minimum size of the grid cells in pixels
window.minCellSize = 3;

// Boolean tracking whether the game is paused or not
window.playGame = true;

// Boolean tracking whether the mouse is being held down
window.mouseDown = false;

// Object tracking grid coordinates of the last cell clicked or touched by the user
window.lastCellClicked = null;

window.returntoffps = 1;

// Number reflecting how quickly the game moves through steps
window.fps = 1;

// Symmetry switch for cell creation
window.symmetry = false;

function boom() {
    for (var i = 0; i < window.numCellsX; i++) {
        window.grid[i] = [];
        for (var j = 0; j < window.numCellsY; j++) {
            // Assign state to the cell
            window.grid[i][j] = Math.random() >= 0.5;
        }
    }
    window.fps = 30;
}

// Set up and start the game
function init() {
    // Create a full screen canvas
    var canvas = document.getElementById('mainCanvas');
    canvas.width = window.innerWidth + 100;
    canvas.height = window.innerHeight + 100;

    // Determine ideal number of cells to display
    window.numCellsX = Math.floor(canvas.width / window.cellSize);
    window.numCellsY = Math.floor(canvas.height / window.cellSize);

    // Initialize the grid with dead/alive cells
    for (var i = 0; i < window.numCellsX; i++) {
        window.grid[i] = [];
        for (var j = 0; j < window.numCellsY; j++) {
            // Assign state to the cell
            window.grid[i][j] = false;
        }
    }

    var glider = [
        [0, 1, 0,],
        [0, 0, 1,],
        [1, 1, 1,],
    ];

    for (var i = 0; i < glider.length; i++) {
        for (var j = 0; j < glider[i].length; j++) {
            if (i < window.numCellsX && j < window.numCellsY) {
                window.grid[i][j] = glider[i][j] == 1;
            }
        }
    }

    // Draw the game board
    draw();

    // Redraw the grid when the window is resized
    window.addEventListener('resize', init);

    // Add canvas event listener for mouse/touch events
    canvas.addEventListener('mousedown', onCanvasMouseDown, false);
    canvas.addEventListener('mouseup', onCanvasMouseUp, false);
    canvas.addEventListener('mousemove', onCanvasMouseMove, false);
    canvas.addEventListener('touchstart', onCanvasTouchStart, false);
    canvas.addEventListener('touchmove', onCanvasTouchMove, false);
    canvas.addEventListener('touchend', onCanvasTouchEnd, false);

    gameLoop();
}

function gameLoop() {
    if (window.playGame) {
        window.grid = getNextState();
        draw();
    }
    if (window.fps > window.returntoffps) { window.fps -= 1; }
    setTimeout(gameLoop, 1000 * (1 / window.fps));
}

function draw() {
    //drawGrid();
    drawCells();
}

/**
 * Draw a grid on the canvas.
 */
function drawGrid() {
    var canvas = document.getElementById('mainCanvas');

    // Draw a black background
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = window.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set the stroke color to grey
    ctx.strokeStyle = window.gridColor;

    // Set the stroke size to 1/10th of the cell size
    ctx.lineWidth = window.cellSize / window.gridLineWidthRatio;

    // Draw the vertical lines of the grid
    var offset;
    for (var i = 0; i <= window.numCellsX; i++) {
        offset = i * window.cellSize;
        ctx.beginPath();
        ctx.moveTo(offset, 0);
        ctx.lineTo(offset, canvas.height);
        ctx.stroke();
    }

    // Draw the horizontal lines of the grid
    for (i = 0; i <= window.numCellsY; i++) {
        offset = i * window.cellSize;
        ctx.beginPath();
        ctx.moveTo(0, offset);
        ctx.lineTo(canvas.width, offset);
        ctx.stroke();
    }
}

/**
 * Draw live cells onto the grid
 */
function drawCells() {
    // Get canvas context
    var canvas = document.getElementById('mainCanvas');
    var ctx = canvas.getContext('2d');

    // Cycle through the grid
    for (var i = 0; i < window.numCellsX; i++) {
        for (var j = 0; j < window.numCellsY; j++) {
            // Check if cell is alive or dead
            if (window.grid[i][j]) {
                // If cell is alive then color with cell color
                ctx.fillStyle = window.cellColor;
            } else {
                // If cell is dead then color with background color
                ctx.fillStyle = window.backgroundColor;
            }

            // Draw the cells
            var halfGridLineWidth = (window.cellSize / window.gridLineWidthRatio) / 2;
            ctx.fillRect((i * window.cellSize) + halfGridLineWidth,
                (j * window.cellSize) + halfGridLineWidth,
                window.cellSize - halfGridLineWidth, window.cellSize - halfGridLineWidth);
        }
    }
}

/**
 * Given pixel coordinates on the canvas switch that cell's alive/dead status and update lastCellClicked, and if
 * symmetry is enabled then do the same for the cell's partner
 * @param x {Number} the X value of the pixel coordinates on the canvas
 * @param y {Number} the Y value of the pixel coordinates on the canvas
 */
function clickCell(x, y) {
    // Check that the mouse is down
    if (window.mouseDown) {
        // Get the grid coordinates of the cell
        var coords = getCellGridCoordinates(x, y);
        console.log(`x: ${x} y: ${y}`)
        console.log('coords: ' + JSON.stringify(coords));
        // Return if the coordinates are not on the grid
        if (coords === null) {
            return null;
        }

        // Check that this is not the most recent cell clicked
        if ((window.lastCellClicked === null) ||
            !(window.lastCellClicked.x === coords.x && window.lastCellClicked.y === coords.y)) {
            // Switch the cell state
            window.grid[coords.x][coords.y] = !window.grid[coords.x][coords.y];

            if (window.symmetry) {
                var partnerX = window.numCellsX - 1 - coords.x;
                window.grid[partnerX][coords.y] = window.grid[coords.x][coords.y];
            }

            // Update last cell clicked
            window.lastCellClicked = coords;

            // Update the screen
            draw();
        }
    }
}

/**
 * @return {Array} array describing the next game state
 */
function getNextState() {
    var newGrid = [];
    for (var x = 0; x < window.numCellsX; x++) {
        newGrid[x] = [];
        for (var y = 0; y < window.numCellsY; y++) {
            var count = getAliveNeighborCount(x, y);
            // Check if cell is created, survives, or dies
            if (window.grid[x][y] && (count === 3 || count === 2)) {
                // Cell survives
                newGrid[x][y] = true;
            } else if (!window.grid[x][y] && count === 3) {
                // Cell is created
                newGrid[x][y] = true;
            } else {
                // Cell dies
                newGrid[x][y] = false;
            }
        }
    }
    return newGrid;
}

/**
 * @param x {Number} X grid coordinate of the cell
 * @param y {Number} Y grid coordinate of the cell
 * @return {Number} number of live neighbors
 */
function getAliveNeighborCount(x, y) {
    var rightX = (x + 1) % window.numCellsX;
    var leftX = (x - 1) < 0 ? window.numCellsX - 1 : (x - 1);
    var downY = (y + 1) % window.numCellsY;
    var upY = (y - 1) < 0 ? window.numCellsY - 1 : (y - 1);

    return window.grid[rightX][y] + window.grid[rightX][upY] + window.grid[rightX][downY] +
        window.grid[leftX][y] + window.grid[leftX][upY] + window.grid[leftX][downY] +
        window.grid[x][upY] + window.grid[x][downY];
}

/**
 * Given pixel coordinates on the canvas return a cell's grid coordinates
 * @param x {Number} the X value of the pixel coordinates on the canvas
 * @param y {Number} the Y value of the pixel coordinates on the canvas
 * @return {Object} the object containing grid coordinates of the cell with x, y properties. Returns null if the given
 * coordinates are not on the grid.
 */
function getCellGridCoordinates(x, y) {
    var canvas = document.getElementById('mainCanvas');

    // Determine grid coordinates of the cell
    x = Math.floor(x / window.cellSize);
    y = Math.floor(y / window.cellSize);

    return { x: x, y: y };
}

// ############## Event Listeners ###############

/**
 * Set the mouseDown variable to true and call the clickCell method
 * @param event
 */
function onCanvasMouseDown(event) {
    window.mouseDown = true;
    clickCell(event.offsetX, event.offsetY);
}

/**
 * Set the mouseDown variable to false and set the last cell clicked variable to null
 */
function onCanvasMouseUp() {
    window.mouseDown = false;
    window.lastCellClicked = null;
}

/**
 * If the mouse is down then call the clickCell method
 * @param event
 */
function onCanvasMouseMove(event) {
    if (window.mouseDown) {
        clickCell(event.offsetX, event.offsetY);
    }
}

/**
 * If the mouse is down then call the clickCell method
 * @param event
 */
function onCanvasTouchMove(event) {
    var touch = event.changedTouches[0];
    if (window.mouseDown) {
        clickCell(touch.clientX, touch.clientY);
    }
    event.preventDefault();
}

/**
 * Set the mouseDown variable to true and call the clickCell method
 * @param event
 */
function onCanvasTouchStart(event) {
    window.mouseDown = true;
    var touch = event.changedTouches[0];
    clickCell(touch.clientX, touch.clientY);
    event.preventDefault();
}

/**
 * Set the mouseDown variable to false and set the last cell clicked variable to null
 */
function onCanvasTouchEnd() {
    window.mouseDown = false;
    window.lastCellClicked = null;
    event.preventDefault();
}

init();