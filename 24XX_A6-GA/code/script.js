const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const startBtn = document.getElementById('startBtn');

const dinoImg = new Image();
dinoImg.src = '../img/dino.png';
let animationId;
let frames = 0;
let score = 0;
let highScore = localStorage.getItem('savedHighScore') || 0;
highScoreElement.innerText = `High Score: ${highScore}`;
let gameSpeed = 5;
let gameOver = false;

// Web Audio API Context
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

startBtn.addEventListener('click', initGame);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
});

const dino = {
    x: 50,
    y: 200,
    width: 40,
    height: 40,
    baseY: 200,
    dy: 0,
    jumpForce: -12,
    gravity: 0.6,
    speed: 5,

    draw() {
        let currentHeight = this.height;
        let currentY = this.y;

        // Ducking
        if (keys.ArrowDown && this.y === this.baseY) {
            currentHeight = 20;
            currentY = this.baseY + 20;
        }

        if (dinoImg.complete) {
            ctx.drawImage(dinoImg, this.x, currentY, this.width, currentHeight);
        } else {
            ctx.fillStyle = '#333';
            ctx.fillRect(this.x, currentY, this.width, currentHeight);
        }
    },

    update() {
        // Jumping
        if (keys.ArrowUp && this.y === this.baseY) {
            this.dy = this.jumpForce;
        }

        // Apply Gravity
        this.dy += this.gravity;
        this.y += this.dy;

        // Floor constraint
        if (this.y > this.baseY) {
            this.y = this.baseY;
            this.dy = 0;
        }

        // Horizontal movement constraints
        if (keys.ArrowLeft) {
            this.x -= this.speed;
        }
        if (keys.ArrowRight) {
            this.x += this.speed;
        }

        // Screen boundaries
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        this.draw();
    }
};

const obstacles = [];

class Obstacle {
    constructor() {
        this.width = 20 + Math.random() * 30; // 20 to 50
        this.height = 30 + Math.random() * 40; // 30 to 70
        this.x = canvas.width;
        this.y = 240 - this.height;
    }

    draw() {
        ctx.fillStyle = '#8B0000'; // Dark red for cacti/obstacles
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.x -= gameSpeed;
        this.draw();
    }
}

function handleObstacles() {
    // Generate new obstacles
    if (frames % Math.max(60, 120 - Math.floor(score / 10)) === 0) {
        obstacles.push(new Obstacle());
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();

        // Remove off-screen obstacles
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

function checkCollision() {
    let currentHeight = keys.ArrowDown && dino.y === dino.baseY ? 20 : dino.height;
    let currentY = keys.ArrowDown && dino.y === dino.baseY ? dino.baseY + 20 : dino.y;

    for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        if (
            dino.x < obs.x + obs.width &&
            dino.x + dino.width > obs.x &&
            currentY < obs.y + obs.height &&
            currentY + currentHeight > obs.y
        ) {
            return true;
        }
    }
    return false;
}

function playDeathSound() {
    if (!audioCtx) audioCtx = new AudioContext();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.5);
}

function initGame() {
    // Resume audio context if browser suspended it
    if (!audioCtx) {
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    dino.y = dino.baseY;
    dino.x = 50;
    dino.dy = 0;
    obstacles.length = 0;
    score = 0;
    gameSpeed = 5;
    frames = 0;
    highScoreElement.innerText = `High Score: ${highScore}`;
    gameOver = false;
    startBtn.style.display = 'none';

    if (animationId) cancelAnimationFrame(animationId);
    animate();
}

function animate() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground line
    ctx.beginPath();
    ctx.moveTo(0, 240);
    ctx.lineTo(canvas.width, 240);
    ctx.strokeStyle = '#555';
    ctx.stroke();

    dino.update();
    handleObstacles();

    if (checkCollision()) {
        gameOver = true;
        if (score > highScore) {
            highScore = score;
            highScoreElement.innerText = `High Score: ${highScore}`;
            localStorage.setItem("savedHighScore",highScore)
        }
        playDeathSound();
        ctx.fillStyle = 'red';
        ctx.font = '30px Courier New';
        ctx.fillText('GAME OVER', canvas.width / 2 - 80, canvas.height / 2);
        startBtn.style.display = 'inline-block';
        startBtn.innerText = 'Restart';
        return;
    }

    frames++;
    if (frames % 10 === 0) {
        score++;
        scoreElement.innerText = `Score: ${score}`;
        // Increase game speed as time increases
        if (score % 100 === 0) {
            gameSpeed += 0.5;
        }
    }

    animationId = requestAnimationFrame(animate);
}
