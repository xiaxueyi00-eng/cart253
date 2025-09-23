
/**
 * Mr. Furious
 * Pippin Barr
 *
 * A guy who becomes visibly furious!
 */

"use strict";

// Our friend Mr. Furious
let mrFurious = {
    // Position and size
    x: 200,
    y: 200,
    size: 100,
    // Colour
    fill: {
        r: 255,
        g: 0,
        b: 0
    }
};

/**
 * Create the canvas
 */
function setup() {
    createCanvas(400, 400);
};



/**
 * Draw (and update) Mr. Furious
 */
function draw() {
    background(0, 0, 0);

    // Draw Mr. Furious as a coloured circle
    push();
    noStroke();
    fill(mrFurious.fill.r, mrFurious.fill.g, mrFurious.fill.b);
    ellipse(mrFurious.x, mrFurious.y, mrFurious.size);
    pop();
}

function setup() {
    // Create the canvas
    createCanvas(640, 640);
}

function draw() {

    circle(50, 50, 25);

    // Draw a circle at the mouse coordinates
    push();
    noStroke();
    fill(255, 0, 0);
    // We use the variable names mouseX and mouseY instead
    // of numbers for the x and y coordinates of our circle
    // JavaScript will *use the values inside them* (the numbers)
    // to send as the x and y arguments of ellipse()
    // And that will mean the ellipse will be drawn with its (x, y)
    // position set to the current mouse (x, y) position.
    ellipse(mouseX, mouseY, 100, 100);
    pop();
}

