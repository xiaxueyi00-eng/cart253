

function setup() {
    createCanvas(600, 400);
}

function draw() {
    background(135, 206, 235); // 
    fill(34, 139, 34); //
    rect(0, 300, width, 100);
}

/**
 * Creates the canvas
 */
function setup() {
    createCanvas(400, 400);
}

/**
 * Draws the cat
 */
function draw() {
    // Pink background
    background(255, 180, 180);

    // No stroke everywhere!
    noStroke();

    drawCat();
}

/**
 * Draws the cat using functions
 */
function drawCat() {
    drawHead();
    drawEyes();
    drawNose();
    drawMouth();
}

/**
 * Draws the cat's head (including its ears)
 */
function drawHead() {

    // Cat head
    push();
    fill(127);
    ellipse(200, 350, 200);
    pop();

    // Cat ears (truly hellish to find the numbers for these)
    push();
    fill(127);
    triangle(120, 290, 160, 260, 140, 230);
    triangle(240, 260, 280, 290, 260, 230);
    pop();
}

/**
 * Draws the cats two eyes
 */
function drawEyes() {
    // Left cat eye
    push();
    fill(255);
    ellipse(150, 350, 30);
    fill(0);
    ellipse(150, 350, 20);
    pop();

    // Right cat eye
    push();
    fill(255);
    ellipse(250, 350, 30);
    fill(0);
    ellipse(250, 350, 20);
    pop();
}

/**
 * Draws the cat's nose
 */
function drawNose() {
    // Cat nose
    push();
    fill(255, 100, 100);
    triangle(190, 340, 210, 340, 200, 360);
    pop();
}

/**
 * Draws the cat's mouth
 */
function drawMouth() {
    // Cat mouth
    push();
    strokeWeight(2);
    stroke(255, 100, 100);
    line(200, 360, 190, 370);
    line(200, 360, 210, 370);
    pop();
}