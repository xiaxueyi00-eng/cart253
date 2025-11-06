/**
 *Frog Time!
 *  A timing-based frog game where the player clicks to shoot the frog's tongue
 * and catch flies before time runs out.
 *
 * - Black fly = +1 score
 * - Every third fly becomes yellow → +3 seconds bonus & frog turns yellow briefly
 * - Goal: Reach 8 points before time ends
 *
 * Controls:
 * Move mouse → move frog left/right
 * Click → shoot tongue
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameState = "start";
let score = 0;
let sounds;
let bestScore = 0;
let startTime;
let baseGameDurationMs = 10000;
let extraTimeMs = 0;

// ==== Frog Object ====
const frog = {
    body: {
        x: 320,
        y: 460,
        size: 150,
        color: "#00ff00"
    },
    tongue: {
        x: undefined,
        y: 400,
        size: 20,
        speed: 25,
        state: "idle"
    }
};

const fly = {
    x: 0,
    y: 200,
    size: 10,
    angle: 0,
    speed: 3,
    color: "#000000",
    captured: false

};

let flyCount = 0;

// === Preload assets (runs before setup) ===
function preload() {
    sounds = {
        eat: loadSound("assets/sounds/eat.mp3")
    };
}

// === Setup canvas & initial state ===
function setup() {
    createCanvas(640, 480);
    sounds.eat.setVolume(0.5);
    resetFly();
}

// === Main draw loop ===
function draw() {
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "play") {
        drawGame();
    } else if (gameState === "end") {
        drawEndScreen();
    }
}


// === START SCREEN ===
/**
 * Shows the title and waits for the player to click to start.
 */
function drawStartScreen() {
    background("#90d195");
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("#38945e");
    text("frogfrogfrog", width / 2, height / 2 - 60);
    textSize(30);
    text("Click the frog to start!", width / 2, height / 2 + 40);
    drawFrog();
    // Click anywhere to start game
    if (mouseIsPressed) {
        resetGame();
        gameState = "play";
        startTime = millis();
    }
}


// === GAMEPLAY LOOP ===
/**
 * Handles all animations, interactions, UI, timer, and win/lose conditions.
 *
 */
function drawGame() {
    drawBackground();
    moveFly();
    drawFly();
    moveFrog();
    moveTongue();
    drawFrog();
    checkTongueFlyOverlap();
    printScore();

    // Compute remaining time (base time + bonus time - elapsed)
    const elapsed = millis() - startTime;
    const remainingSec = max(0, (baseGameDurationMs + extraTimeMs - elapsed) / 1000);

    // Display time
    fill(0);
    textSize(20);
    textAlign(LEFT, TOP);
    text(nf(remainingSec.toFixed(1), 2, 1) + "s", 10, 10);

    // Time runs out → end game
    if (elapsed >= baseGameDurationMs + extraTimeMs) {
        gameState = "end";
    }
}
// === BACKGROUND ===
/**
 * Draws sky, water, clouds, and lotus leaves for visual setting.
 */

function drawBackground() {
    let c1, c2;
    c1 = color(120, 190, 255);
    c2 = color(90, 230, 170);

    for (let y = 0; y < height; y++) {
        let n = map(y, 0, height, 0, 1);
        let newc = lerpColor(c1, c2, n);
        stroke(newc);
        line(0, y, width, y);
    }

    fill(5, 223, 143);
    noStroke();

    // clouds
    drawCloud(110, 80, 1.0);
    drawCloud(300, 60, 1.3);
    drawCloud(520, 85, 0.9);
    drawCloud(200, 120, 1.6);
    drawCloud(450, 150, 1.4);


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

// === SCORE DISPLAY ===
function printScore() {
    textAlign(LEFT);
    fill(50);
    textSize(30);
    textAlign(CENTER); text("Score: " + score, width / 2, 50);
}


// === END SCREEN ===
/**
 * Shows win/lose message and spinning frog animation.
 */
function drawEndScreen() {
    background("black");
    textAlign(CENTER, CENTER);
    fill("yellow");
    textSize(50);
    push();

    // Save old frog coordinates before rotating
    let oldX = frog.body.x;
    let oldY = frog.body.y;

    // Temporarily move frog to origin for rotation animation
    frog.body.x = 0;
    frog.body.y = 0;

    translate(width / 2, height / 2 + 40);
    rotate(frameCount * 0.05);
    scale(1.0);
    drawFrog();
    pop();

    // Restore frog original position
    frog.body.x = oldX;
    frog.body.y = oldY;

    // Update best score after round ends
    if (score > bestScore) bestScore = score;
    // Win/Loss text
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
    // Click anywhere → return to start screen
    if (mouseIsPressed) {
        resetGame();
        gameState = "start";
    }
}


// === RESET GAME STATE FOR NEW ROUND ===
function resetGame() {
    score = 0;
    extraTimeMs = 0;
    frog.body.color = "#00ff00";
    frog.tongue.state = "idle";
    frog.tongue.y = 400;
    resetFly();
}
// === FLY MOVEMENT ===
/**
 * Handles normal fly movement and captured-fly animation.
 */
function moveFly() {
    // If the fly has been captured by the frog
    if (fly.captured) {

        // Target position (the frog's mouth)
        let targetX = frog.body.x;
        let targetY = frog.body.y - 20;

        // Smoothly move (lerp) the fly toward the frog's mouth
        fly.x = lerp(fly.x, targetX, 0.15);
        fly.y = lerp(fly.y, targetY, 0.15);

        // Once the fly is close enough to the mouth, we consider it "eaten"
        if (dist(fly.x, fly.y, targetX, targetY) < 10) {
            fly.captured = false;
            resetFly(); // Spawn a new fly
        }

    } else {
        // Normal fly movement when it has not been captured
        fly.x += fly.speed;
        fly.y = 200 + sin(frameCount * 0.1) * 80;

        // If the fly goes off the screen, spawn a new one
        if (fly.x > width) {
            resetFly();
        }
    }
}
// === DRAW FLY ===
function drawFly() {
    push();
    noStroke();
    rotate(fly.angle);
    drawWings(fly.x, fly.y);
    fill(fly.color);
    ellipse(fly.x, fly.y, fly.size * 1.2);
    pop();
}

// === FLY WINGS ANIMATION ===
function drawWings(x, y) {
    let flap = sin(frameCount * 0.3) * 4;
    let span = 10;

    fill(255, 255, 255, 120);
    ellipse(x - span - flap, y - 5, fly.size * 1.5, fly.size * 1);
    ellipse(x + span + flap, y - 5, fly.size * 1.5, fly.size * 1);
}


// === SPAWN / RESET FLY ===
function resetFly() {
    flyCount++;

    fly.x = 0;
    fly.y = random(0, 300);

    // Every 3rd fly is yellow
    if (flyCount % 3 === 0) {
        fly.color = "#e5ff00"; // Yellow fly (bonus)
    } else {
        fly.color = "#000000"; // Normal black fly
    }
}


// === FROG MOVEMENT (mouse controlled) ===
function moveFrog() {
    frog.body.x = mouseX;
}


// === TONGUE SHOOTING ANIMATION ===
function moveTongue() {
    frog.tongue.x = frog.body.x;

    if (frog.tongue.state === "outbound") {
        frog.tongue.y -= frog.tongue.speed;
        if (frog.tongue.y <= 0) frog.tongue.state = "inbound";
    }
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        if (frog.tongue.y >= height) frog.tongue.state = "idle";
    }
}


// === DRAW FROG ===
function drawFrog() {
    // Draw tongue only during gameplay
    if (gameState === "play") {
        push();
        stroke("#ff0000");
        strokeWeight(frog.tongue.size);
        line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y - 20);
        pop();

        // Tongue tip
        push();
        fill("#ff0000");
        noStroke();
        ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
        pop();
    }

    // Frog body
    push();
    fill(frog.body.color);
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Mouth
    push();
    fill("#ff4d4d");
    noStroke();
    ellipse(frog.body.x, frog.body.y - 20, 30, 22);
    pop();

    // Eyes
    drawEyes();
}


// === EYE BLINK ANIMATION ===
function drawEyes() {
    let blink = frameCount % 60 < 10;
    let eyeHeight = blink ? 10 : 35;

    // White eye shapes
    push();
    fill("white");
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 70, 35, eyeHeight);
    ellipse(frog.body.x + 40, frog.body.y - 70, 35, eyeHeight);
    pop();

    // Pupils
    push();
    fill("black");
    noStroke();
    ellipse(frog.body.x - 40, frog.body.y - 70, 15, 15);
    ellipse(frog.body.x + 40, frog.body.y - 70, 15, 15);
    pop();
}


// === DETECT AND PROCESS FLY CATCHING ===
function checkTongueFlyOverlap() {
    // Distance between tongue tip & fly center
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);

    // Overlap threshold
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);

    // Only process catch once
    if (eaten && !fly.captured) {
        sounds.eat.play();
        score += 1;

        // If yellow fly → bonus effects
        if (fly.color === "#e5ff00") {
            frog.body.color = "#e5ff00";
            extraTimeMs += 3000;
        } else {
            frog.body.color = "#00ff00";
        }

        fly.captured = true;
        frog.tongue.state = "inbound";
    }

    // If score reaches target → win immediately
    if (score >= 8) {
        gameState = "end";
    }
}


// === SHOOT TONGUE ON CLICK ===
function mousePressed() {
    if (gameState === "play" && frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}