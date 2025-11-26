/**
 * Game Menu + Intro Animation
 * Author: xueyi
 */

"use strict";

let stage = "intro";  // intro → sunAppear → rules → gameX
let game1Started = false;  // whether the plane game has started
let planeX = 450;   // initial X-position of the plane
let planeY = 750;   // fixed Y-position of the plane near the bottom
let bgY1 = 0;      // first background Y-position
let bgY2 = -900;   // second background starts above the canvas

/* ---------------- GAME1 VARIABLES ---------------- */
let game1Stage = "start";  // start → play → end
let game1Score = 0;
let game1BestScore = 0;

let game1StartTime = 0;
let baseTimeMs = 40000;
let bonusTimeMs = 0;

// plane
let planeSize = 40;

// bullets
let bullets = [];

// enemies
let enemies = [];
let enemyCount = 0;
let enemySpawnInterval = 40;
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
    text(label, x - 3, y);
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

function mousePressed() {

    /* ------------------------------------------------------
       RULES PAGE: Click flower buttons
       ------------------------------------------------------ */
    if (stage === "rules") {
        let cx = 450;
        let cy = 450;
        let radius = 300;

        let buttons = getCircularButtons(cx, cy, radius);
        for (let b of buttons) {
            if (insideButton(mouseX, mouseY, b.x, b.y)) {
                stage = b.label;

                if (b.label === "game1") {
                    game1Stage = "start";
                    resetGame1();
                }
                return;
            }
        }
        return;
    }

    /* ------------------------------------------------------
       GAME 1 : START SCREEN
       ------------------------------------------------------ */
    if (stage === "game1" && game1Stage === "start") {
        if (
            mouseX > width / 2 - 110 &&
            mouseX < width / 2 + 110 &&
            mouseY > height / 2 + 100 &&
            mouseY < height / 2 + 180
        ) {
            console.log("START CLICKED");
            game1Started = true;
            game1Stage = "play";
            resetGame1();
            resetGame1();
            game1StartTime = millis();
        }
        return;
    }

    /* ------------------------------------------------------
       GAME 1 : PLAY
       ------------------------------------------------------ */
    if (stage === "game1" && game1Stage === "play") {
        bullets.push({
            x: planeX,
            y: planeY - 20,
            size: 10,
            speed: 12,
            active: true,
        });
        return;
    }

    /* ------------------------------------------------------
       GAME 1 : END
       ------------------------------------------------------ */
    if (stage === "game1" && game1Stage === "end") {
        if (
            mouseX > width / 2 - 140 &&
            mouseX < width / 2 + 140 &&
            mouseY > height / 2 + 40 &&
            mouseY < height / 2 + 120
        ) {
            game1Stage = "start";
            stage = "rules";
        }
        return;
    }

    /* ------------------------------------------------------
       BACK BUTTON
       ------------------------------------------------------ */
    if (
        (stage === "game1" || stage === "game2" || stage === "game3") &&
        insideBackButton(mouseX, mouseY)
    ) {
        stage = "rules";
        return;
    }

}

function drawPlane1() {
    fill(30, 60, 140);
    triangle(
        planeX - planeSize / 2, planeY + 20,
        planeX + planeSize / 2, planeY + 20,
        planeX, planeY - 30
    );
}
/* ---------------- BULLET UPDATE ---------------- */
function updateBullets1() {
    for (let b of bullets) {
        if (!b.active) continue;

        b.y -= b.speed;
        fill("#ff0000");
        ellipse(b.x, b.y, b.size);

        if (b.y < 0) b.active = false;

        for (let e of enemies) {
            if (!e.alive || e.absorbing) continue;
            let d = dist(b.x, b.y, e.x, e.y);
            if (d < e.size / 2 + b.size / 2) {
                b.active = false;
                handleHit1(e);
            }
        }
    }
}
function spawnEnemy1() {
    enemyCount++;

    let type = "normal";
    let color = "#000";

    if (enemyCount % 3 === 0) {
        type = "yellow";
        color = "#ffe600";
    }
    if (enemyCount % 4 === 0) {
        type = "red";
        color = "#ff0033";
    }

    enemies.push({
        x: random(50, 850),
        y: -20,
        size: 40,
        speed: random(2, 4),
        alive: true,
        absorbing: false,
        type,
        color
    });
}

function updateEnemies1() {
    for (let e of enemies) {
        if (!e.alive) continue;

        if (e.type === "red") {
            if (dist(e.x, e.y, planeX, planeY) < 40) {
                if (game1Score > game1BestScore) game1BestScore = game1Score;
                game1Stage = "end";
            }
        }

        if (e.absorbing) {
            e.x = lerp(e.x, planeX, 0.2);
            e.y = lerp(e.y, planeY, 0.2);
            if (dist(e.x, e.y, planeX, planeY) < 10) {
                e.alive = false;
            }
            continue;
        }

        e.y += e.speed;

        fill(e.color);
        ellipse(e.x, e.y, e.size);

        if (e.y > height + 40) e.alive = false;
    }
}

function handleHit1(e) {
    e.absorbing = true;
    game1Score++;

    if (e.type === "yellow") bonusTimeMs += 3000;

    if (e.type === "red") {
        if (game1Score > game1BestScore) game1BestScore = game1Score;
        game1Stage = "end";
    }
}
function resetGame1() {
    game1Score = 0;
    bonusTimeMs = 0;
    bullets = [];
    enemies = [];
    enemyCount = 0;

}
/* ---------------- GAME 1 MAIN LOOP ---------------- */

function runGame1() {

    /* =============== START PAGE =============== */
    if (game1Stage === "start") {

        background(255, 240, 200);

        fill(0);
        textSize(32);
        text("Plane Time!", width / 2, height / 2 - 120);

        textSize(20);
        text("Move mouse to control plane", width / 2, height / 2 - 40);
        text("Click to shoot", width / 2, height / 2 - 10);
        text("Yellow enemy = +3s", width / 2, height / 2 + 20);
        text("Red enemy = deadly", width / 2, height / 2 + 50);

        // Start Button
        fill(255, 200, 200);
        rect(width / 2, height / 2 + 140, 220, 80, 20);

        fill(0);
        textSize(28);
        text("Start", width / 2, height / 2 + 140);

        drawBackButton();
        return;
    }

    /* =============== END PAGE =============== */
    if (game1Stage === "end") {

        background(0);

        fill("yellow");
        textSize(50);
        text("TIME'S UP!", width / 2, height / 2 - 120);

        fill("white");
        textSize(32);
        text("Final Score: " + game1Score, width / 2, height / 2 - 30);
        text("Best Score: " + game1BestScore, width / 2, height / 2 + 20);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 100);

        drawBackButton();
        return;
    }

    /* =============== PLAYING =============== */
    if (game1Stage === "play") {
        push();

        // background scrolling
        fill(170, 200, 255);
        rect(450, bgY1 + 450, 900, 900);

        fill(180, 210, 255);
        rect(450, bgY2 + 450, 900, 900);

        bgY1 += 5;
        bgY2 += 5;

        if (bgY1 > 900) bgY1 = -900;
        if (bgY2 > 900) bgY2 = -900;

        // plane follows mouse
        planeX = constrain(mouseX, 50, 850);
        drawPlane1();

        // spawn enemies
        if (frameCount % enemySpawnInterval === 0) spawnEnemy1();

        // update bullets & enemies
        updateBullets1();
        updateEnemies1();

        // UI
        fill(0);
        textSize(30);
        text("Score: " + game1Score, width / 2, 55);

        let elapsed = millis() - game1StartTime;
        let remaining = max(0, (baseTimeMs + bonusTimeMs - elapsed) / 1000);

        textSize(22);
        textAlign(LEFT, TOP);
        text("Time: " + remaining.toFixed(1) + "s", width / 2, 20);

        // time up
        if (remaining <= 0) {
            if (game1Score > game1BestScore) game1BestScore = game1Score;
            game1Stage = "end";
        }
        pop();
        drawBackButton();
    }
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

function drawBackButton() {
    fill(255, 150, 150);
    rect(80, 60, 120, 50, 20);

    fill(0);
    textSize(22);
    text("Back", 80, 60);
}