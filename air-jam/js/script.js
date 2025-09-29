/**
 * Self-Portrait
 * xueyi xia
 * This is a self-portrait from the code. 
 * I used p5.js to make the simple motifs combine with the face hallmark.
 * Blush gradient effect and the place little test shows both learning and creativity
 */

"use strict";

let skinColor;
let blushColor;
let t = 0;
let speed;



function setup() {
    createCanvas(900, 900);
    skinColor = color(255, 220, 200);//skin
    blushColor = color(255, 170, 170);//pink blush

    // Face
    fill(255, 220, 200);
    ellipse(450, 420, 400, 600);

    // Draw blush (two sides)
    speed = 1.0 / 120.0
    t += speed;
    if (t < 0.20)
        t += speed;

    let currentBlush = lerpColor(skinColor, blushColor, t);
    fill(currentBlush);
    noStroke();
    ellipse(330, 480, 120, 100);// left brush
    ellipse(580, 480, 120, 100);//right brush

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

}

// Draw blinking eyes (no mouse tracking)
function drawEyes() {
    let eyeHeight = 80; // default: open

    // Blink every 40 frames, close for 10 frames
    if (frameCount % 40 < 10) {
        eyeHeight = 20; // closed
    }

    // Left eye
    fill(255); // white of the eye
    ellipse(350, 350, 80, eyeHeight);
    fill(0);
    ellipse(350, 350, 30, eyeHeight / 2);

    // Right eye
    fill(255);
    ellipse(550, 350, 80, eyeHeight);
    fill(0);
    ellipse(550, 350, 30, eyeHeight / 2);
}



// Draw a simple triangular nose
function drawNose() {
    fill(255, 200, 180);
    noStroke();
    triangle(
        450, 390,
        400, 500,
        500, 500
    );

}

// Draw a rectangular mouth
function drawMouth() {

    // mouth interior
    fill(225, 0, 0);
    noStroke();

    let mouthWidth = map(mouseX, 0, width, 30, 110);
    let mouthHeight = map(mouseY, 0, height, 20, 90);

    ellipse(450, 600, mouthWidth, mouthHeight);
}


// Draw the neck using a quad and ellipse for the base
function drawNeck() {
    fill(255, 220, 200);
    noStroke();
    quad(
        380, 700,
        520, 700,
        590, 900,
        320, 900,
    )
    ellipse(450, 900, 680, 200);
}
// Draw stylized hair using arc and triangle shapes

function drawHair() {
    fill(0, 0, 0)
    arc(450, 280, 360, 330, PI, TWO_PI, CHORD);
    // Left 
    triangle(280, 230, 150, 520, 260, 550);

    //Right
    triangle(620, 230, 750, 500, 650, 550);
}
