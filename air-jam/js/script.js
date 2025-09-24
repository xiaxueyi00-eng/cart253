/**
 * Self-Portrait
 * xueyi xia
 * This is a self-portrait from the code. 
 * I used p5.js to make the simple motifs combine with the face hallmark.
 * Blush gradient effect and the place little test shows both learning and creativity
 */

"use strict";

let blush = {
    // Position and size
    xLeft: 300,
    xRight: 600,
    y: 480,
    size: 120,

    // Blush: using fill() to create a soft pink tone on the cheeks
    fill: {
        r: 250,
        g: 170,
        b: 170
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
    ellipse(450, 450, 400, 600);

    // Eyes
    drawEyes();
    // Nose
    drawNose();
    // Mouth
    drawMouth();
    //Neck
    drawNeck();
    //Hair
    drawHair();

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

// Draw blinking Eyes
function drawEyes() {
    let eyeHeight = 80; // default: open

    // Blink every 40 frames, close for 10 frames
    if (frameCount % 40 < 10) {
        eyeHeight = 20; // closed
    }

    // Left eye
    fill(255);               // white of the eye
    ellipse(350, 360, 80, eyeHeight);
    fill(0);
    ellipse(350, 360, 40, eyeHeight / 2);

    // Right eye
    fill(255);
    ellipse(550, 360, 80, eyeHeight);
    fill(0);
    ellipse(550, 360, 40, eyeHeight / 2);
}

// Draw a simple triangular nose
function drawNose() {
    fill(255, 200, 180);
    noStroke();
    triangle(
        460, 400,
        430, 500,
        490, 500
    );
}

// Draw a rectangular mouth
function drawMouth() {
    fill(225, 0, 0);
    noStroke();
    rect(410, 580, 100, 40, 10);
}
// Draw the neck using a quad and ellipse for the base
function drawNeck() {
    fill(255, 220, 200);
    noStroke();
    quad(
        400, 700,
        500, 700,
        590, 900,
        320, 900,
    )
    ellipse(460, 900, 600, 140);
}
// Draw stylized hair using arc and triangle shapes

function drawHair() {
    fill(0, 0, 0)
    arc(450, 280, 360, 300, PI, TWO_PI, CHORD);
    // Left 
    triangle(280, 230, 150, 520, 260, 550);

    //Right
    triangle(620, 230, 750, 500, 650, 550);
}
