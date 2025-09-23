/**
 * Self-Portrait
 * xueyi xia
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let blush = {
    // Position and size
    xLeft: 300,
    xRight: 600,
    y: 480,
    size: 120,

    // Initial color
    fill: {
        r: 255,
        g: 180,
        b: 180
    }
};

function setup() {
    createCanvas(900, 900);
}

function draw() {
    // Background
    background(255, 230, 240);

    // Face
    fill(255, 220, 200);
    ellipse(width / 2, height / 2, 400, 600);

    // Eyes
    drawEyes();
    // Nose
    drawNose();
    // mouth
    drawMouth();


    // Blush color change gradually
    blush.fill.g -= 0.5;
    blush.fill.b -= 0.5;

    // Constrain blush color range to avoid turning black
    blush.fill.g = constrain(blush.fill.g, 80, 180);
    blush.fill.b = constrain(blush.fill.b, 80, 180);

    // Make blush move left and right slightly
    let offset = 10;
    if (frameCount % 40 === 0) {
        blush.xLeft += offset;
        blush.xRight -= offset;
    } else if (frameCount % 40 === 20) {
        blush.xLeft -= offset;
        blush.xRight += offset;
    }

    // Draw blush (two sides)
    noStroke();
    fill(blush.fill.r, blush.fill.g, blush.fill.b);
    ellipse(blush.xLeft, blush.y, blush.size, blush.size / 1.5);
    ellipse(blush.xRight, blush.y, blush.size, blush.size / 1.5);
}

// Functions outside draw()
//

// Eyes
function drawEyes() {
    let eyeHeight = 80; // default: open

    // Blink every 40 frames, close for 10 frames
    if (frameCount % 40 < 10) {
        eyeHeight = 20; // closed
    }

    // Left eye
    fill(255);               // white of the eye
    ellipse(350, 360, 80, eyeHeight);
    fill(0);                 // pupil
    ellipse(350, 360, 40, eyeHeight / 2);

    // Right eye
    fill(255);
    ellipse(550, 360, 80, eyeHeight);
    fill(0);
    ellipse(550, 360, 40, eyeHeight / 2);
}

// Nose
function drawNose() {
    fill(255, 200, 180);
    noStroke();
    triangle(
        460, 400,   // top
        430, 500,   // bottom left
        490, 500    // bottom right
    );
}

// Mouth
function drawMouth() {
    fill(225, 0, 0);
    noStroke();
    rectMode(650, 120, 40, 10);
}
