/**
 * Frogfrogfrog
 *
 * Made with p5
 * https://p5js.org/
 */

"use strict";

let gameState = "start";
// Our frog
const frog = {
    // The frog's body has a position and size
    body: {
        x: 320,
        y: 460,
        size: 150
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
    background("#b0f2b6");
    textAlign(CENTER, CENTER);
    textSize(40);
    fill("#2e8b57");
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

// --- End Screen ---
function drawEndScreen() {
    background("black");
    fill("yellow");
    textAlign(CENTER, CENTER);
    textSize(30);
    text("Game Over", width / 2, height / 2);
    textSize(20);
    text("Click to restart", width / 2, height / 2 + 40);

    // Restart game on click
    if (mouseIsPressed) {
        gameState = "start";
    }
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
    fill("#00ff00");
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
    // Get distance from tongue to fly
    const d = dist(frog.tongue.x, frog.tongue.y, fly.x, fly.y);
    // Check if it's an overlap
    const eaten = (d < frog.tongue.size / 2 + fly.size / 2);
    if (eaten) {
        // Reset the fly
        resetFly();
        // Bring back the tongue
        frog.tongue.state = "inbound";
    }
}

/**
 * Launch the tongue on click (if it's not launched yet)
 */
function mousePressed() {
    if (frog.tongue.state === "idle") {
        frog.tongue.state = "outbound";
    }
}