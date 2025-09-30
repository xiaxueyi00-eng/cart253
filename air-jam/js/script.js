/**
 * Self-Portrait
 * xueyi xia
 * This is a self-portrait from the code. 
 * I used p5.js to make the simple motifs combine with the face hallmark.
 * Blush gradient effect and the place little test shows both learning and creativity
 */

"use strict";

// --- Global variables --
let skinColor;
let blushColor;
let t = 0;
let speed;
// Controls the scaling of the heart
let heartScale = 1;


function setup() {
    createCanvas(900, 900);
    skinColor = color(255, 220, 200);//skin
    blushColor = color(255, 170, 170);//pink blush
}

function draw() {
    background(255, 204, 204)

    // --- Heart (with original coordinates, scalable) ---
    push();
    translate(width / 2, height / 2);
    scale(heartScale);
    translate(-width / 2, -height / 2);
    //rad heart
    fill(225, 0, 0);
    ellipse(350, 355, 580, 580);//left 
    ellipse(550, 370, 580, 600)//right
    triangle(145, 560, 820, 487, 450, 990);
    pop();

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

    // Facial features
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
// --- Mouse wheel: zoom in/out heart ---
function mouseWheel(event) {
    heartScale += event.delta * -0.001;// Control scaling with mouse wheel
    heartScale = constrain(heartScale, 0.5, 2);// Limit scaling range
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
    triangle(300, 200, 100, 520, 260, 550);

    //Right
    triangle(620, 230, 800, 500, 650, 550);
}
