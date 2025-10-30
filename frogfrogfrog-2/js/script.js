/**
 * Frogfrogfrog
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameState = "start";
let score = 0;
let bestScore = 0;
let startTime;
let gameDurationMs = 10000; // 10 seconds (in milliseconds)


// Our frog
const frog = {
    body: {
        x: 320,
        y: 460,
        size: 150,
        color: "#00ff00" // Added color attribute
    },
    tongue: {
        x: undefined,
        y: 400,
        size: 20,
        speed: 20,
        state: "idle" // idle, outbound, inbound
    }
};

// Fly
const fly = {
    x: 0,
    y: 200,
    size: 10,
    speed: 3,
    color: "#000000"
};

let flyCount = 0;

function setup() {
    createCanvas(640, 480);
    resetFly();
}

// --- DRAW LOOP ---
function draw() {
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "play") {
        drawGame();
    } else if (gameState === "end") {
        drawEndScreen();
    }
}

// --- Start Screen ---
function drawStartScreen() {
    background("#90d195");
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("#38945e");
    text("frogfrogfrog", width / 2, height / 2 - 40);
    textSize(20);
    text("Click the frog to start!", width / 2, height / 2 + 40);
    drawFrog();

    if (mouseIsPressed) {
        resetGame();
        gameState = "play";
        startTime = millis(); // start timer here
    }
}


// --- Main Game Loop ---
function drawGame() {
    background("#87ceeb");
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    printScore();

    const elapsed = millis() - startTime;
    const remainingSec = max(0, (gameDurationMs - elapsed) / 1000);
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(nf(remainingSec.toFixed(1), 2, 1) + "s", 10, 10);

    if (elapsed >= gameDurationMs) {
        gameState = "end";
    }
}


function printScore() {
    textAlign(LEFT);
    fill(50);
    textSize(30);
    text("Score: " + score, 5 * width / 6, height / 9);
    text("Best: " + bestScore, 5 * width / 6, height / 9 + 40);
}


// --- End Screen ---
function drawEndScreen() {
    background("black");
    textAlign(CENTER, CENTER);
    fill("yellow");
    textSize(40);

    if (score >= 8) {
        text("YOU WIN! ", width / 2, height / 2 - 50);
    } else {
        text("GAME OVER ", width / 2, height / 2 - 50);
    }

    fill("white");
    textSize(25);
    text("Your score: " + score, width / 2, height / 2 + 10);
    text("Click to Restart", width / 2, height / 2 + 60);

    if (mouseIsPressed) {
        resetGame();
        gameState = "start";
    }
}

// --- Helper Functions ---
function resetGame() {
    score = 0;
    frog.body.color = "#00ff00";
    frog.tongue.state = "idle";
    frog.tongue.y = 400;
    resetFly();
}

function moveFly() {
    fly.x += fly.speed;
    if (fly.x > width) {
        resetFly();
    }
}

function drawFly() {
    push();
    noStroke();
    drawWings(fly.x, fly.y);
    fill(fly.color);
    ellipse(fly.x, fly.y, fly.size * 1.2);
    pop();
}

function drawWings(x, y) {
    let wingFlap = sin(frameCount * 0.3) * 4;
    let wingSpan = 10;
    let wingYOffset = 5;
    let wingXOffset = wingFlap;
    let birdSize = fly.size * 3;

    fill(255, 255, 255, 120);
    ellipse(x - wingSpan - wingXOffset, y - wingYOffset, birdSize / 2, birdSize / 3);
    ellipse(x + wingSpan + wingXOffset, y - wingYOffset, birdSize / 2, birdSize / 3);
}

function resetFly() {
    flyCount++;
    fly.x = 0;
    fly.y = random(0, 300);

    if (flyCount % 3 === 0) {
        fly.color = "#e5ff00"; // yellow fly
    } else {
        fly.color = "#000000"; // black fly
    }
}

function moveFrog() {
    frog.body.x = mouseX;
}

function moveTongue() {
    frog.tongue.x = frog.body.x;

    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    } else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) frog.tongue.state = "idle";
    }
}

function drawFrog() {
    // Tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Tongue line
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Frog body
    push();
    fill(frog.body.color);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Eyes
    drawEyes();
}

function drawEyes() {
    let eyeHeight = frameCount % 40 < 10 ? 10 : 35;

    push();
    fill("white");
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 70, 35, eyeHeight);
    ellipse(frog.body.x + 40, frog.body.y - 70, 35, eyeHeight);
    pop();

    push();
    fill("black");
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 70, 15, 15);
    ellipse(frog.body.x + 40, frog.body.y - 70, 15, 15);
    pop();
}

function checkTongueFlyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);

    if (eaten) {
        score += 1;

        if (fly.color === "#e5ff00") {
            frog.body.color = "#e5ff00";
        } else {
            frog.body.color = "#00ff00";
        }

        resetFly();
        frog.tongue.state = "inbound";

        if (score >= 5) {
            gameState = "end";
        }
    }
}

// Only shoot tongue during play state
function mousePressed() {
    if (gameState === "play" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}