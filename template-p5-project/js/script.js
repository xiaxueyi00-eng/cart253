/**
 * Game Menu + Intro Animation
 * Author: xueyi
 */

"use strict";

let stage = "intro";  // intro → sunAppear → rules → gameX
let game1Started = false;  // whether the plane game has started
let planeX = 450;   // initial X-position of the plane
let planeY = 750;   // fixed Y-position of the plane near the bottom
/* ---------------- CLOUD POSITIONS ---------------- */
let cloudLeft = [
    { x: 450, y: -50 },
    { x: 420, y: 80 },
    { x: 480, y: 150 },
    { x: 600, y: 0 },
];

let cloudRight = [
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

    if (stage === "intro") runIntroAnimation();
    else if (stage === "sunAppear") runSunAppear();
    else if (stage === "rules") runRulesScreen();
    else if (stage === "game1") runGame1();
    else if (stage === "game2") runGame2();
    else if (stage === "game3") runGame3();
}

/* ---------------- CLOUD GRADIENT CIRCLE ---------------- */
function drawCloudCircle(cx, cy, radius) {
    let ctx = drawingContext;

    let gradient = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
    gradient.addColorStop(1, "rgba(148, 199, 244, 1)");
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
}

/* ---------------- INTRO CLOUD ANIMATION ---------------- */
function runIntroAnimation() {
    let cx = width / 2;
    let cy = height / 2;

    let allOpened = true;

    for (let c of cloudLeft) {
        drawCloudCircle(c.x, cy + c.y, 120);
        c.x -= 6;
        if (c.x > -100) allOpened = false;
    }

    for (let c of cloudRight) {
        drawCloudCircle(c.x, cy + c.y, 120);
        c.x += 6;
        if (c.x < width + 100) allOpened = false;
    }

    if (allOpened) stage = "sunAppear";
}

/* ---------------- SUN APPEAR ---------------- */
function runSunAppear() {
    let cx = width / 2;
    let cy = height / 2;

    glowSize += glowGrow;
    if (glowSize > 60 || glowSize < 0) glowGrow *= -1;

    drawPinkGradientCircle(cx, cy, sunRadius);

    if (sunRadius < 160) {
        sunRadius += 5;
    } else {
        stage = "rules";
    }
}

/* ---------------- PINK GRADIENT SUN ---------------- */
function drawPinkGradientCircle(cx, cy, radius) {
    let ctx = drawingContext;

    let gradient = ctx.createRadialGradient(
        cx, cy, radius * 0.2, cx, cy, radius
    );

    gradient.addColorStop(0, "rgba(255, 230, 255, 1)");
    gradient.addColorStop(0.5, "rgba(242, 203, 242, 1)");
    gradient.addColorStop(1, "rgba(250, 192, 241, 1)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
}

/* ---------------- RULES SCREEN ---------------- */
function runRulesScreen() {
    let cx = width / 2;
    let cy = height / 2;

    drawPinkGradientCircle(cx, cy, 200);

    fill(0);
    textSize(36);
    text("Game Time", cx, cy - 200);

    drawCircularButtons(cx, cy, 300);
}

/* ---- DRAW BUTTON (FLOWER) ---------------- */
function drawButton(x, y, label) {

    noStroke();
    fill(255, 153, 204);

    let petalDist = 40;
    let petalSize = 45;


    ellipse(x, y - petalDist, petalSize + 10, petalSize);

    ellipse(x, y + petalDist, petalSize + 10, petalSize);

    ellipse(x - petalDist, y + 15, petalSize, petalSize);

    ellipse(x + petalDist, y + 15, petalSize, petalSize);

    ellipse(x - petalDist * 1.1, y - petalDist * 0.5, petalSize, petalSize);

    ellipse(x + petalDist * 1.1, y - petalDist * 0.5, petalSize, petalSize);


    fill(255, 204, 229);
    ellipse(x, y, 80, 80);


    fill(0);
    textSize(20);
    text(label, x, y);
}

/* ---------------- BUTTON HIT DETECTION ---------------- */
function insideButton(mx, my, bx, by) {
    return (
        mx > bx - 130 &&
        mx < bx + 130 &&
        my > by - 30 &&
        my < by + 30
    );
}

/* ---------------- CIRCULAR BUTTONS ---------------- */
function drawCircularButtons(cx, cy, radius) {
    let displayLabels = ["Game 1", "Game 2", "Game 3"];
    let valueLabels = ["game1", "game2", "game3"];

    for (let i = 0; i < 3; i++) {

        let angle = TWO_PI / 3 * i - PI / 2;
        let bx = cx + cos(angle) * radius;
        let by = cy + sin(angle) * radius;

        drawButton(bx, by, displayLabels[i]);
    }
}

function getCircularButtons(cx, cy, radius) {
    let valueLabels = ["game1", "game2", "game3"];
    let arr = [];

    for (let i = 0; i < 3; i++) {
        let angle = TWO_PI / 3 * i - PI / 2;
        arr.push({
            label: valueLabels[i],
            x: cx + cos(angle) * radius,
            y: cy + sin(angle) * radius
        });
    }
    return arr;
}
/* ---------------- CLICK HANDLER ---------------- */
function mousePressed() {
    // Start button for game1
    if (stage === "game1" && !game1Started) {
        // check if Start button is clicked
        if (
            mouseX > width / 2 - 100 &&
            mouseX < width / 2 + 100 &&
            mouseY > height / 2 - 10 &&
            mouseY < height / 2 + 50
        ) {
            game1Started = true; // start the plane game
            return;
        }
    }

    if (stage === "rules") {
        let cx = width / 2;
        let cy = height / 2;
        let buttons = getCircularButtons(cx, cy, 300);

        for (let b of buttons) {
            if (insideButton(mouseX, mouseY, b.x, b.y)) {
                stage = b.label;

                if (b.label === "game1") {
                    game1Started = false;
                    planeX = 450;
                }
            }
        }


        if (stage === "game1" || stage === "game2" || stage === "game3") {
            if (insideBackButton(mouseX, mouseY)) {
                stage = "rules";
            }
        }
    }
}
function drawBackButton() {
    fill(192, 192, 192);
    rect(80, 50, 120, 50, 15);

    fill(0);
    textSize(20);
    text("Back", 80, 50);
}

function insideBackButton(mx, my) {
    return (mx > 20 && mx < 140 && my > 25 && my < 75);
}

/* ---------------- GAME VARIATIONS ---------------- */
function runGame1() {

    // If game not started → show START button
    if (!game1Started) {
        background(255, 240, 200);

        fill(255, 200, 200);
        rect(width / 2, height / 2 + 20, 200, 60, 20);

        fill(0);
        textSize(28);
        text("Start", width / 2, height / 2 + 20);

        drawBackButton();
        return;
    }

    // ---------------- GAME PLAY ----------------
    background(180, 210, 255);  // slightly darker background to see plane

    // Draw Airplane
    fill(30, 60, 140); // darker blue
    triangle(
        planeX - 25, planeY + 20,
        planeX + 25, planeY + 20,
        planeX, planeY - 30
    );

    // Movement
    // plane follows mouse X
    planeX = mouseX;
    planeX = constrain(planeX, 50, 850);

    // Keep inside canvas
    planeX = constrain(planeX, 50, 850);

    drawBackButton();
}

function runGame2() {
    background(200, 255, 220);
    textSize(50);
    text("Game 2 Start!", width / 2, height / 2);

    drawBackButton();
}

function runGame3() {
    background(220, 200, 255);
    textSize(50);
    text("Game 3 Start!", width / 2, height / 2);

    drawBackButton();
}

