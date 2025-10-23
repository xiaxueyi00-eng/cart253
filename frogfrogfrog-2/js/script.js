/**
 * Frogfrogfrog
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameState = "start";
let score = 0;       // Current score
let bestScore = 0;   // Highest score
let startTime;
let gamDuration = 40;

// Our frog
const frog = {
    // The frog's body has a position, size, and color
    body: {
        x: 320,
        y: 460,
        size: 150,
        color: "#00ff00" // Added color attribute
    },

    // The frog's tongue has a position, size, speed, and state
    tongue: {
        x: undefined,
        y: 400,
        size: 20,
        speed: 20,
        // Determines how the tongue moves each frame
        state: "idle" // State can be: idle, outbound, inbound
    }
};

// Our fly
// Has a position, size, and speed of horizontal movement
const fly = {
    x: 0,
    y: 200, // Will be random
    size: 10,
    speed: 3
};

/**
 * Creates the canvas and initializes the fly
 */
function setup() {
    createCanvas(640, 480);

    // Give the fly its first random position
    resetFly();
}
starTime = mills();

function draw() {
    // --- Control the overall game states ---
    if (gameState === "start") {
        drawStartScreen();
    }
    else if (gameState === "play") {
        drawGame();
    }
    else if (gameState === "end") {
        drawEndScreen();
    }
}

// --- Start Screen ---
function drawStartScreen() {
    background("#90d195ff");
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("#38945eff");
    text("frogfrogfrog", width / 2, height / 2 - 40);
    textSize(20);
    text("Click the frog to start!", width / 2, height / 2 + 40);

    drawFrog(); // Draw the frog

    // Start the game when the mouse is pressed
    if (mouseIsPressed) {
        resetGame();
        gameState = "play";
    }
    function resetGame() {
        resetFly();
        frog.tongue.state = "idle"
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
}

//  Countdown logic
let elapsed = millis() - startTime;
let remaining = max(0, (gameDuration - elapsed) / 1000); // seconds left

// Show timer
fill(0);
textSize(20);
textAlign(LEFT, TOP);
text("⏰ " + nf(remaining.toFixed(1), 2, 1) + "s", 10, 10);

// End game when time runs out
if (elapsed > gameDuration) {
    gameState = "end";
}

// --- End Screen ---
function drawEndScreen() {
    background("black");
    textAlign(CENTER, CENTER);
    fill("yellow");
    textSize(40);

    //  WIN message
    if (score >= 5) {
        text("YOU WIN!", width / 2, height / 2 - 50);
    } else {
        text("GAME OVER ", width / 2, height / 2 - 50);
    }

    fill("white");
    textSize(25);
    text("Your score: " + score, width / 2, height / 2 + 10);
    text("Click to Restart", width / 2, height / 2 + 60);

    //  Restart logic
    if (mouseIsPressed) {
        score = 0;                   // Reset score
        frog.body.color = "#00ff00"; // Reset frog color
        resetFly();                  // Reset fly
        gameState = "start";         // Go back to start screen
    }
}

function gameOverScreen() {
    background(23, 24, 24, 3);
    textAlign(CENTER);

    if (bestScore < score) {
        bestScore = score;
    }
    fill(255, 227, 132);
    textSize(30);
    text("Highest", width / 2, height / 10);
    textSize(40);
    text(bestScore, width / 2, height / 5);

    fill(230, 180, 80);
    textSize(30);
    text("Score", width / 2, height / 2 - 110);
    textSize(150);
    text(score, width / 2, height / 2 + 50);

    fill(92, 167, 182);
    rectMode(CENTER);
    noStroke();
    rect(width / 2, height - 40, 200, 60, 5);
    fill(236, 240, 241);
    textSize(30);
    text("Restart", width / 2, height - 30);
}
function startGame() {
    gameScreen = 1;
}


function gameOver() {
    gameScreen = 2;
    gameoverSound.play();
}

function restart() {
    gameScreen = 1;
    lastAddTime = 0;
    birds = [];
}
/**
 * Moves the fly according to its speed
 * Resets the fly if it gets all the way to the right
 */
function moveFly() {
    // Move the fly
    fly.x += fly.speed;
    // Handle the fly going off the canvas
    if (fly.x > width) {
        resetFly();
    }
}

/**
 * Draws the fly as a black circle
 */
function drawFly() {
    push();
    noStroke();
    drawWings(fly.x, fly.y)
    fill(fly.color || "#000000");
    ellipse(fly.x, fly.y, fly.size * 1.2);

    pop();
}


function drawWings(x, y) {
    // 🪽 Gentle wing flapping animation using a sine wave
    let wingFlap = sin(frameCount * 0.3) * 4;  // Flapping amplitude
    let wingSpan = 10;        // Horizontal distance between wings
    let wingYOffset = 5;      // Vertical offset of the wings
    let wingXOffset = wingFlap; // Wing movement that changes over time
    let birdSize = fly.size * 3; // Adjust overall wing size relative to the fly

    // --- Draw wings ---
    fill(255, 255, 255, 120); // Semi-transparent white for light, delicate wings
    ellipse(x - wingSpan - wingXOffset, y - wingYOffset, birdSize / 2, birdSize / 3);
    ellipse(x + wingSpan + wingXOffset, y - wingYOffset, birdSize / 2, birdSize / 3);

}


/**
 * Resets the fly to the left with a random y
 */

let flyCount = 0
function resetFly() {
    flyCount++;
    fly.x = 0;
    fly.y = random(0, 300);


    if (flyCount % 3 === 0) {
        fly.color = "#e5ff00ff";
    } else {
        fly.color = "#000000";
    }
}

/**
 * Moves the frog to the mouse position on x
 */
function moveFrog() {
    frog.body.x = mouseX;
}

/**
 * Handles moving the tongue based on its state
 */
function moveTongue() {
    // Tongue matches the frog's x
    frog.tongue.x = frog.body.x;
    // If the tongue is idle, it doesn't do anything
    if (frog.tongue.state === "idle") {
        // Do nothing
    }
    // If the tongue is outbound, it moves up
    else if (frog.tongue.state === "outbound") {
        frog.tongue.y += -frog.tongue.speed;
        // The tongue bounces back if it hits the top
        if (frog.tongue.y <= 0) {
            frog.tongue.state = "inbound";
        }
    }
    // If the tongue is inbound, it moves down
    else if (frog.tongue.state === "inbound") {
        frog.tongue.y += frog.tongue.speed;
        // The tongue stops if it hits the bottom
        if (frog.tongue.y >= height) {
            frog.tongue.state = "idle";
        }
    }
}

/**
 * Displays the tongue (tip and line connection) and the frog (body)
 */
function drawFrog() {
    // Draw the tongue tip
    push();
    fill("#ff0000");
    noStroke();
    ellipse(frog.tongue.x, frog.tongue.y, frog.tongue.size);
    pop();

    // Draw the rest of the tongue
    push();
    stroke("#ff0000");
    strokeWeight(frog.tongue.size);
    line(frog.tongue.x, frog.tongue.y, frog.body.x, frog.body.y);
    pop();

    // Draw the frog's body
    push();
    fill(frog.body.color || "#00ff00");
    noStroke();
    ellipse(frog.body.x, frog.body.y, frog.body.size);
    pop();

    // Draw the frog's eyes
    drawEyes();
}
function drawEyes() {
    let eyeHeight = 35; // default: open

    // Blink every 40 frames, close for 10 frames
    if (frameCount % 40 < 10) {
        eyeHeight = 10; // closed
    }
    //Draw the frog's eyes
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

/**
 * Handles the tongue overlapping the fly
 */
function checkTongueFlyOverlap() {
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);

    if (eaten) {
        score += 1;  // Add +1 each time the frog catches a fly

        // ß Check the fly color
        if (fly.color === "#e5ff00ff") {
            frog.body.color = "#e5ff00ff"; // Frog turns yellow if it eats a yellow fly
        } else {
            frog.body.color = "#00ff00"; // Otherwise, stay green
        }

        resetFly(); // Reset fly position
        frog.tongue.state = "inbound"; // Tongue goes back after catching

        //  Check if player reached 10 points
        if (score >= 5) {
            gameState = "end"; // Switch to end screen
        }
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (mouseIsPressed) {
        resetGame();
        gameState = "play";
        startTime = millis(); //  Start timer
    }
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}

