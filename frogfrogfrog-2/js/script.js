/**
 *Frog Time!
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameState = "start";
let score = 0;
let bestScore = 0;
let startTime;
let baseGameDurationMs = 10000; // 10 seconds (in milliseconds)
let extraTimeMs = 0;



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
    angle: 0,
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
    drawBackground();
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    printScore();

    const elapsed = millis() - startTime;
    const remainingSec = max(0, (baseGameDurationMs + extraTimeMs - elapsed) / 1000);
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(nf(remainingSec.toFixed(1), 2, 1) + "s", 10, 10);

    if (elapsed >= baseGameDurationMs + extraTimeMs) {
        gameState = "end";
    }
}
function drawBackground() {
    // Light blue background for sky/water
    background(5, 172, 223);
    noStroke();
    fill(5, 223, 143);
    rect(0, height / 2, width, height / 2);

    // clouds
    drawCloud(110, 80, 1.0);
    drawCloud(300, 60, 1.3);
    drawCloud(520, 85, 0.9);

    // Lotus leaves base color
    noStroke();
    fill("#3da35d");
    ellipse(150, height - 60, 120, 50);
    ellipse(400, height - 40, 180, 70);
    ellipse(550, height - 80, 100, 45);

    // Leaf lines (simple veins)
    stroke("#2e7d32");
    strokeWeight(2);

    // First leaf
    line(150, height - 60, 150, height - 85);
    line(150, height - 60, 120, height - 55);
    line(150, height - 60, 180, height - 55);

    // Second leaf
    line(400, height - 40, 400, height - 70);
    line(400, height - 40, 370, height - 35);
    line(400, height - 40, 430, height - 35);


    // Third leaf
    line(550, height - 80, 550, height - 100);
    line(550, height - 80, 530, height - 75);
    line(550, height - 80, 570, height - 75);
}
// === Draw simple cloud ===
function drawCloud(x, y, s = 1) {
    push();
    noStroke();
    fill(255, 255, 255, 230); // white, slightly transparent

    // main fluffy parts
    ellipse(x, y, 60 * s, 40 * s);
    ellipse(x - 25 * s, y + 5 * s, 50 * s, 30 * s);
    ellipse(x + 25 * s, y + 8 * s, 50 * s, 30 * s);
    ellipse(x, y + 12 * s, 70 * s, 25 * s);
    pop();

}


function printScore() {
    textAlign(LEFT);
    fill(50);
    textSize(30);
    textAlign(CENTER); text("Score: " + score, width / 2, 50);
}


// --- End Screen ---
function drawEndScreen() {
    background("black");
    textAlign(CENTER, CENTER);
    fill("yellow");
    textSize(50);


    push();

    let oldX = frog.body.x;
    let oldY = frog.body.y;

    // Temporarily move the frog to (0,0) so rotation happens around its center
    frog.body.x = 0;
    frog.body.y = 0;

    // Move drawing origin to the screen center and rotate the frog
    translate(width / 2, height / 2 + 40);
    rotate(frameCount * 0.05);
    scale(1.0);

    // Draw the frog at the new temporary position
    drawFrog();

    // Restore frog's original position after drawing
    frog.body.x = oldX;
    frog.body.y = oldY;

    pop();

    if (score > bestScore) bestScore = score;

    if (score >= 8) {
        text("YOU WIN!", width / 2, height / 2 - 120);
    } else {
        text("GAME OVER", width / 2, height / 2 - 120);
    }

    fill("white");
    textSize(30);
    text("Your Score: " + score, width / 2, height / 2 + 20);
    text("Best Score: " + bestScore, width / 2, height / 2 + 60);
    text("One More Try ?", width / 2, height / 2 + 120);

    if (mouseIsPressed) {
        resetGame();
        gameState = "start";
    }
}


// --- Helper Functions ---
function resetGame() {
    score = 0;
    extraTimeMs = 0;
    frog.body.color = "#00ff00";
    frog.tongue.state = "idle";
    frog.tongue.y = 400;
    resetFly();
}

function moveFly() {
    fly.x += fly.speed;
    fly.y = 200 + sin(frameCount * 0.1) * 80;
    if (fly.x > width) {
        resetFly();
    }
}

function drawFly() {
    push();
    noStroke();
    rotate(fly.angle);
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
    // === Tongue only in play state ===
    if (gameState === "play") {
        // Tongue line (draw BEFORE body so the body hides the base)
        push();
        stroke("#ff0000");
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y - 20); // 🔥 从嘴的位置开始
        pop();

        // Tongue tip
        push();
        fill("#ff0000");
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();
    }

    // === Frog body ===
    push();
    fill(frog.body.color);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // === Mouth (this hides tongue root) ===
    push();
    fill("#ff4d4d");
    noStroke();
    ellipse(frog.body.x, frog.body.y - 20, 30, 22);
    pop();

    // === Eyes ===
    drawEyes();
}

//  Eyes stay OUTSIDE drawFrog()
function drawEyes() {
    let blink = frameCount % 60 < 10; // blink animation
    let eyeHeight = blink ? 10 : 35;

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
            extraTimeMs += 3000;
        } else {
            frog.body.color = "#00ff00";
        }

        resetFly();
        frog.tongue.state = "inbound";
    }
    if (score >= 8) {
        gameState = "end";
    }

}
// Only shoot tongue during play state
function mousePressed() {
    if (gameState === "play" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}
