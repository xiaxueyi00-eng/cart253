/**
 * Starter House
 * xueyi xia
 * Draws a house with shapes.
 * 
 * Disclaimer: Not actually my house.
 * 
 * Uses:
 * p5.js
 * https://p5js.org/
 */

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(640, 480);
}

/**
 * Draws a house and its immediate environment
 */
function draw() {
    drawSky();
    drawCloud();
    drawGround();
    drawHouse();
}


/**
 * Draws the sky    
 */
function drawSky() {
    background(150, 200, 250);
}


/**
 * Draws a cloud
 */
function drawCloud() {
    push();
    noStroke();
    fill(255);
    ellipse(100, 100, 100, 100);
    ellipse(180, 80, 100, 100);
    ellipse(160, 120, 60, 60);
    ellipse(190, 130, 60, 60);
    ellipse(220, 120, 60, 60);
    pop();
}

/**
 * Draws the ground 
 */
function drawGround() {
    push();
    noStroke();
    fill(200);
    rect(0, 400, 640, 80);
    pop();
}

/**
 * Draws the house with a window, door, and roof,etc.
 */
function drawHouse() {
    drawHouseBody();
    drawHouseRoof();
    drawHouseWindow();
    drawHouseDoor();
}

/**
 * Draws the house's body
 */

function drawHouseBody() {
    push();
    noStroke();
    fill(250, 250, 200);
    rect(200, 240, 280, 180);
    pop();
}

/**
 * Draws the house's roof
 */
function drawHouseRoof() {
    push();
    noStroke();
    fill("#dc143c");
    triangle(180, 240, 340, 120, 500, 240);
    pop();
}

/**
 * Draw the single window of the house
 *
 */
function drawHouseWindow() {
    push();
    stroke("deeppink");
    strokeWeight(5);
    fill("blanchedalmond");
    rect(220, 260, 80, 80);
    pop();
}

/**
 * Draw the door of the house
 */
function drawHouseDoor() {
    push();
    noStroke();
    fill(0, 128, 0);
    rect(320, 300, 80, 120);
    pop();

    // The doorknob
    push();
    noStroke();
    fill(255, 215, 0);
    ellipse(340, 360, 10, 10);
    pop();
}   