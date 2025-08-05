let gameStarted = false;

const GRID_SIZE = 20;       // size of each square
const GRID_WIDTH = 20;      // 20 x 20 = 400 pixels (window size)
const GRID_HEIGHT = 20;
let snake = [];
let food;
let direction = 'right';
let moveTimer = 0;
const MOVE_DELAY = 150;     // move snake every 150ms

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 400,
    backgroundColor: '#1d1d1d',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Nothing yet but will add audio and image once done
}

function create() {
    // Start with a snake of 3 segments
    snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
    ];

    // Place initial food
    placeFood();

    // Listen to arrow key presses
    this.input.keyboard.on('keydown', handleKey, this);

        // Start button logic
    const startBtn = document.getElementById('startBtn');
    startBtn.style.display = 'block';

    startBtn.onclick = () => {
        gameStarted = true;
        startBtn.style.display = 'none';
        drawSnake(this); // Show snake/food immediately after clicking Play
    };

}

function update(time) {
    if (!gameStarted) return; // wait until Play is pressed

    if (time > moveTimer) {
        moveSnake();
        drawSnake(this);
        moveTimer = time + MOVE_DELAY;
    }
}

function drawSnake(scene) {
    scene.children.removeAll(); // Clear old snake and food

    // Draw snake segments
    snake.forEach(part => {
        scene.add.rectangle(
            part.x * GRID_SIZE,
            part.y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE,
            0x00ff00
        ).setOrigin(0);
    });

    // Draw food
    scene.add.rectangle(
        food.x * GRID_SIZE,
        food.y * GRID_SIZE,
        GRID_SIZE,
        GRID_SIZE,
        0xff0000
    ).setOrigin(0);
}

function moveSnake() {
    const head = { ...snake[0] };

    if (direction === 'right') head.x += 1;
    else if (direction === 'left') head.x -= 1;
    else if (direction === 'up') head.y -= 1;
    else if (direction === 'down') head.y += 1;

    // Check wall collision (game over)
    if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
        gameOver();
        return;
    }

    // Check self collision (game over)
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food = {
        x: Phaser.Math.Between(0, GRID_WIDTH - 1),
        y: Phaser.Math.Between(0, GRID_HEIGHT - 1)
    };
}

function handleKey(event) {
    const key = event.key;

    if (key === 'ArrowUp' && direction !== 'down') direction = 'up';
    else if (key === 'ArrowDown' && direction !== 'up') direction = 'down';
    else if (key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    else if (key === 'ArrowRight' && direction !== 'left') direction = 'right';
}

function gameOver() {
    alert('Game Over! Reload the page to play again.');
    // Stop the game loop by disabling update function
    game.scene.pause();
}
