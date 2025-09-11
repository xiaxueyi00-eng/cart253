/**
 * Title of Project
 * Author Name
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */


"use strict";

/**
 * Create a canvas, hides the cursor
*/
function setup() {
    // A 640x480 canvas
    createCanvas(640, 640);

    // Don't show the cursor
    noCursor();
}

/**
 * Draws a top-down view of a pyramid and also a black circle
 * at the position of the user's cursor
*/
function draw() {
    // Make the background blue (specified as RGB)
    background(0, 0, 255);

    // Draw a pyramid
    // How many levels for the pyramid
    const levels = 16;
    // Loop through every level (backwards)
    for (let level = levels; level > 0; level--) {
        // Draw this layer
        push();
        // Set the grey shade of the level based on its number
        // e.g. level 1 will get a shade of 10 (blue), 
        // level 10 will be 255(pink)
        const shade = map(level, 1, levels, 16, 255);
        // No line around the levels
        noStroke();
        // Set the fill colour to our shade (RGB)
        fill(shade, 0, shade);
        // Draw rectangles from the centre
        rectMode(CENTER);
        // Draw the rectangle in the centre of the canvas
        // (320, 320) with a size based on the level
        // e.g. level 1 will be a 48x48 rectangle and
        // level 10 will be a 480x480 rectangle
        rect(320, 320, level * 48, level * 48);
        pop();
    }

    // Draw a white circle at the position of the mouse
    push();
    // No line around the shape
    noStroke();
    // Make it white (RGB)
    fill(255, 255, 255);
    // Draw a 100x100 circle at the mouse position
    ellipse(mouseX, mouseY, 100, 100);
    pop();
}