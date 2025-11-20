/**
 * Title of Project
 * Author Name
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */



"use strict";

let stage = "intro";  // intro → sunAppear → rules → game

// clouds 
let armLeft = [
    { x: 450, y: -50 },
    { x: 420, y: 80 },
    { x: 480, y: 150 },
    { x: 600, y: 0.9 },
];

let armRight = [
    { x: 450, y: -50 },
    { x: 480, y: 80 },
    { x: 430, y: 150 },
    { x: 300, y: 60 },
];

let sunRadius = 20;
let glowSize = 0;
let glowGrow = 1;

function setup() {
    createCanvas(900, 900);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
}

function draw() {
    background(204, 229, 255);

    if (stage === "intro") {
        runIntroAnimation();
    }
    else if (stage === "sunAppear") {
        runSunAppear();
    }
    else if (stage === "rules") {
        runRulesScreen();
    }
    else if (stage === "game") {
        runGame();
    }
}
function drawArmsCircle(cx, cy, radius) {
    let ctx = drawingContext;

    let gradient = ctx.createLinearGradient(
        cx, cy - radius,
        cx, cy + radius
    );

    gradient.addColorStop(1, "rgba(148, 199, 244, 1)");
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
}
// -------------------- CLOUD INTRO ---------------------
function runIntroAnimation() {
    let cx = width / 2;
    let cy = height / 2;

    noStroke();

    let allOpened = true;

    // LEFT
    for (let c of armLeft) {
        drawArmsGradient(c.x, cy + c.y, 120);
        c.x -= 3;
        if (c.x > -300) allOpened = false;
    }

    // RIGHT
    for (let c of armRight) {
        drawArmsGradient(c.x, cy + c.y, 120);
        c.x += 3;
        if (c.x < width + 300) allOpened = false;
    }

    if (allOpened) stage = "sunAppear";
}
// -------------------- SUN APPEAR ---------------------
function runSunAppear() {
    let cx = width / 2;
    let cy = height / 2;

    noStroke();


    glowSize += glowGrow;
    if (glowSize > 60 || glowSize < 0) glowGrow *= -1;
    drawPinkGradientCircle(cx, cy, sunRadius + 100);

    if (sunRadius < 160) {
        sunRadius += 4;
    } else {
        stage = "rules";
    }
}

function drawPinkGradientCircle(cx, cy, radius) {
    let ctx = drawingContext;

    let gradient = ctx.createRadialGradient(
        cx, cy, radius * 0.2,
        cx, cy, radius
    );


    gradient.addColorStop(0, "rgba(255, 230, 255, 1)");
    gradient.addColorStop(0.5, "rgba(242, 203, 242, 1)");
    gradient.addColorStop(1, "rgba(250, 192, 241, 1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
}
// -------------------- RULES SCREEN ---------------------
function runRulesScreen() {
    let cx = width / 2;
    let cy = height / 2;

    fill(204, 0, 204);
    ellipse(cx, cy, sunRadius + glowSize + 290);

    drawPinkGradientCircle(cx, cy, sunRadius + 100);


    fill(0);
    textSize(36);
    text(
        "GAME RULES:\n\n• Avoid obstacles\n• Collect items\n• Don't run out of time\n\nClick anywhere to begin",
        cx,
        cy
    );
}

// -------------------- SWITCH TO GAME ---------------------
function mousePressed() {
    if (stage === "rules") {
        stage = "game";
    }
}

// -------------------- GAME ---------------------
function runGame() {
    background(255, 240, 120);

    fill(0);
    textSize(48);
    text("Game Start", width / 2, height / 2);
}

// -------------------- CLOUD SHAPE ---------------------
function drawArmsCircle(x, y) {
    ellipse(x, y, 180, 130);
    ellipse(x + 70, y, 110, 90);
    ellipse(x - 70, y, 110, 90);
}