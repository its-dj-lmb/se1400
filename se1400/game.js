// Game constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 4;

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Player object
const player = {
    x: 100,
    y: CANVAS_HEIGHT - 100,
    width: 40,
    height: 60,
    velocityX: 0,
    velocityY: 0,
    isJumping: false
};

// Platforms
const platforms = [
    { x: 0, y: CANVAS_HEIGHT - 40, width: CANVAS_WIDTH, height: 40 }, // Ground
    { x: 300, y: 400, width: 200, height: 20 },
    { x: 100, y: 300, width: 200, height: 20 },
    { x: 500, y: 200, width: 200, height: 20 },
    { x: 200, y: 150, width: 200, height: 20 }
];

// Key state
const keys = {
    left: false,
    right: false,
    up: false
};

// Event listeners
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a':
            keys.left = true;
            break;
        case 'd':
            keys.right = true;
            break;
        case 'w':
        case ' ':
            if (!keys.up && !player.isJumping) {
                keys.up = true;
                player.velocityY = JUMP_FORCE;
                player.isJumping = true;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch(e.key.toLowerCase()) {
        case 'a':
            keys.left = false;
            break;
        case 'd':
            keys.right = false;
            break;
        case 'w':
        case ' ':
            keys.up = false;
            break;
    }
});

function update() {
    // Handle movement
    if (keys.left) {
        player.velocityX = -MOVE_SPEED;
    } else if (keys.right) {
        player.velocityX = MOVE_SPEED;
    } else {
        player.velocityX = 0;
    }

    // Apply gravity
    player.velocityY += GRAVITY;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Platform collision
    platforms.forEach(platform => {
        if (isColliding(player, platform)) {
            // Bottom collision
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.isJumping = false;
            }
            // Top collision
            else if (player.velocityY < 0) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Side collisions
            if (player.velocityX > 0) {
                player.x = platform.x - player.width;
            } else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
            }
        }
    });
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw platforms
    ctx.fillStyle = '#8B4513';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = '#4169E1';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop(); 