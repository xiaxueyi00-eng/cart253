/**
 * Game Time
 * Author: xueyi
 */

"use strict";

// ===== METEOR SYSTEM FOR GAME 2 =====
let meteors = [];
let meteorNum = 8;
let planeSpeed = 1;


let planeBoost = false;
let bossBullets = [];
let cloudLayers = [];
let level1Cleared = false;
let level2Cleared = false;
// ===== Game1 Monster =====
let monster = {
    x: 450,
    y: -60,
    size: 80,
    speed: 3,
    color: "#8800ff"
};

let game1KillCount = 0;
let game2KillCount = 0;
let game3KillCount = 0;

let game2EnemyCount = 0;
// ===== GLOBAL =====
let stage = "intro";  // intro → sunAppear → rules → game1
let planeX = 450;
let planeY = 750;
let bgY1 = 0;
let bgY2 = -900;

// ===== BULLET COOLDOWN =====
let lastBulletTime = 0;
let bulletCooldown = 500; // ms

// ===== GAME1 VARS =====
let game1Timer = 60;
let game1StartTime = 0;
let elapsed = 0;
let remaining = game1Timer
let game1Stage = "start";  // start → play → end
let game1Score = 0;
let game1BestScore = 0;
let baseTimeMs = 60000;
let bonusTimeMs = 0;

let timeOver = false;
let gameOver = false;


/* ===== GAME 2 VARS ===== */
let game2Stage = "start";
let game2Score = 0;
let game2BestScore = 0;

let game2StartTime = 0;
let game2BaseTimeMs = 40000;
let game2BonusTimeMs = 0;

let game2EnemySpawnInterval = 35;


let stars2 = [];
let starDensity2 = 170 / (900 * 900);


// plane
let planeSize = 40;

// bullets & enemies
let bullets = [];
let enemies = [];
let enemyCount = 0;
let enemySpawnInterval = 40;

let speedLines = [];

let timedMonsters = [];


// --- Game2 bonus counter (number of yellow enemies collected) ---
let game2BonusEatCount = 0;

// --- Game2 falling rain-type enemy (triggered after enough bonuses) ---
let game2RainEnemy = null;


// ====== SOUNDS ======
let flameImg;
let rainSound;
let shootSound;

function preload() {
    flameImg = loadImage("assets/images/image.png");

    rainSound = loadSound(
        "assets/sounds/rain.wav",
        () => console.log("rainSound loaded successfully"),
        (err) => console.error("rainSound failed to load", err)
    );

    shootSound = loadSound(
        "assets/sounds/shoot.wav",
        () => console.log("shootSound loaded successfully"),
        (err) => console.error("shootSound failed to load", err)
    );
}
// ====== SETUP ======
function setup() {
    createCanvas(900, 900);
    rectMode(CENTER);
    textAlign(CENTER, CENTER);

    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
    }


    initPrettyStormClouds();
    setupStars2();
    initSimplePinkClouds();

    if (rainSound.isLoaded()) {
        rainSound.loop();
    } else {
        console.log("rainSound not loaded yet");
    }

}
function drawStarBackground2() {
    background(0);

    noStroke();
    for (let s of stars2) {
        s.brightness = random(100, 255);
        fill(s.brightness);
        ellipse(s.x, s.y, s.size);
    }
}
// =================== RAIN BACKGROUND ===================
let a = 0;
let b = 0;
let speed = 0.5;
let offY = 0;
let Alpha = 15;


function runRainBackground() {



    // Rain
    for (let i = 0; i < width; i += 20) {
        let y = random(-height, height);
        stroke(255, 100);
        line(i, y - 50, i, y + 50);
    }

    noStroke();
    a += speed;
    if (a > width) a = -400;

    b += speed / 2;
    if (b > width) b = -200;

    // Rain
    for (var i = 0; i < width; i += 20) {
        var y = random(-height, height);
        stroke(255, 50);
        line(i, 0, i, y - 100);

        var Y2 = random(height * 0.6, height);
        strokeWeight(2);
        stroke(180, 210, 255, 40);
        strokeWeight(2);
        ellipse(i, Y2, 45, 4);
    }

    // Water wave
    noStroke();

    offY += 0.003;
    var Y = noise(offY) * 1000;
}
// =========Clouds ========= //


function initPrettyStormClouds() {
    cloudLayers = [];
    for (let i = 0; i < 4; i++) {
        cloudLayers.push({
            y: random(80, 300),
            speed: random(0.2, 1.0),
            noiseOffset: random(1000),
            color: color(60, 60, 80, random(150, 220)),
            scale: random(1.2, 2.0)
        });
    }
}

function drawPrettyStormClouds() {
    noStroke();

    for (let c of cloudLayers) {


        let floatY = c.y + sin(frameCount * 0.01 + c.noiseOffset) * 6;

        for (let i = 0; i < 3; i++) {
            let r = 160 * c.scale * (1 - i * 0.2);
            let alpha = 70 - i * 20;

            fill(255, 240, 255, alpha);
            ellipse(c.x, floatY, r * 2, r * 1.2);
        }


        c.x += sin(frameCount * 0.005 + c.noiseOffset) * 0.3;


        if (c.x > width + 200) c.x = -200;
        if (c.x < -200) c.x = width + 200;
    }
}
class Star2 {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(1, 4);
        this.brightness = random(100, 255);
    }

    update() {

        this.brightness = random(100, 255);
    }

    display() {
        noStroke();
        fill(this.brightness);
        ellipse(this.x, this.y, this.size, this.size);
    }
}
// ===== INTRO ANIMATION CLOUDS =====
let cloudLeft = [
    { x: 450, y: -50 },
    { x: 420, y: 80 },
    { x: 480, y: 150 },
    { x: 600, y: 0 },
];
let cloudRight = [
    { x: 450, y: -50 },
    { x: 480, y: 80 },
    { x: 400, y: 200 },
    { x: 300, y: 60 },
];

// SUN
let sunRadius = 20;
let glowSize = 0;
let glowGrow = 1;


function draw() {
    background(204, 229, 255);

    if (stage === "intro") runIntroAnimation();
    else if (stage === "sunAppear") runSunAppear();
    else if (stage === "rules") runRulesScreen();
    else if (stage === "game1") runGame1();
    else if (stage === "game2") runGame2();
    else if (stage === "game3") runGame3();

    if (game1Stage === "end") {
        background(0);
        textAlign(CENTER, CENTER);

        textSize(55);
        if (gameOver) {
            fill("red");
            text("YOU LOSE!", width / 2, height / 2 - 120);
        } else if (timeOver) {
            fill("yellow");
            text("TIME'S UP!", width / 2, height / 2 - 120);
        }

        fill("white");
        textSize(40);
        text("Try Again", width / 2, height / 2 - 50);

        fill("white");
        textSize(32);
        text("Final Score: " + game1Score, width / 2, height / 2 + 20);
        text("Best Score: " + game1BestScore, width / 2, height / 2 + 70);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
    }

    if (stage === "game2" && game2Stage === "end") {
        background(0);
        textAlign(CENTER, CENTER);

        textSize(55);
        if (game2Over) {
            fill("red");
            text("YOU LOSE!", width / 2, height / 2 - 120);
        } else if (game2TimeOver) {
            fill("yellow");
            text("TIME'S UP!", width / 2, height / 2 - 120);
        }

        fill("white");
        textSize(40);
        text("Try Again", width / 2, height / 2 - 50);

        fill("white");
        textSize(32);
        text("Final Score: " + game2Score, width / 2, height / 2 + 20);
        text("Best Score: " + game2BestScore, width / 2, height / 2 + 70);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
    }
}

/* ---------------- CLOUD GRADIENT CIRCLE ---------------- */
function drawCloudCircle(cx, cy, radius) {
    let ctx = drawingContext;
    let g = ctx.createLinearGradient(cx, cy - radius, cx, cy + radius);
    g.addColorStop(1, "rgba(148, 199, 244, 1)");
    g.addColorStop(0, "rgba(255, 255, 255, 1)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, TWO_PI);
    ctx.fill();
}

/* ---------------- INTRO CLOUD ANIMATION ---------------- */
function runIntroAnimation() {
    let cx = width / 2;
    let cy = height / 2;
    let opened = true;

    for (let c of cloudLeft) {
        drawCloudCircle(c.x, cy + c.y, 120);
        c.x -= 6;
        if (c.x > -100) opened = false;
    }
    for (let c of cloudRight) {
        drawCloudCircle(c.x, cy + c.y, 120);
        c.x += 6;
        if (c.x < width + 100) opened = false;
    }

    if (opened) stage = "sunAppear";
}

/* ---------------- SUN APPEAR ---------------- */
function runSunAppear() {
    let cx = width / 2;
    let cy = height / 2;

    glowSize += glowGrow;
    if (glowSize > 60 || glowSize < 0) glowGrow *= -1;

    drawPinkGradientCircle(cx, cy, sunRadius);

    if (sunRadius < 160) sunRadius += 5;
    else stage = "rules";
}

/* ---------------- PINK SUN ---------------- */
function drawPinkGradientCircle(cx, cy, r) {
    let ctx = drawingContext;
    let g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    g.addColorStop(0, "rgba(255, 230, 255, 1)");
    g.addColorStop(0.5, "rgba(242, 203, 242, 1)");
    g.addColorStop(1, "rgba(250, 192, 241, 1)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI);
    ctx.fill();
}

/* ---------------- RULES SCREEN ---------------- */
function runRulesScreen() {
    let cx = width / 2;
    let cy = height / 2;

    drawPinkGradientCircle(cx, cy, 200);

    fill(0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("Game Time", cx, cy - 200);

    drawCircularButtons(cx, cy, 300);
}

/* ---------------- FLOWER BUTTON ---------------- */
function drawButton(x, y, label) {
    noStroke();
    fill(255, 153, 204);

    let d = 40, s = 45;
    ellipse(x, y - d, s + 10, s);
    ellipse(x, y + d, s + 10, s);
    ellipse(x - d, y + 15, s, s);
    ellipse(x + d, y + 15, s, s);
    ellipse(x - d * 1.1, y - d * 0.5, s, s);
    ellipse(x + d * 1.1, y - d * 0.5, s, s);

    fill(255, 204, 229);
    ellipse(x, y, 80, 80);

    fill(0);
    textSize(20);
    text(label, x - 3, y);
}

function drawCircularButtons(cx, cy, radius) {
    let display = ["Game 1", "Game 2", "Game 3"];
    let values = ["game1", "game2", "game3"];

    for (let i = 0; i < 3; i++) {
        let ang = TWO_PI / 3 * i - PI / 2;
        let bx = cx + cos(ang) * radius;
        let by = cy + sin(ang) * radius;
        drawButton(bx, by, display[i]);
    }
}

/* ---------------- BUTTON INFO (FOR CLICK) ---------------- */
function getCircularButtons(cx, cy, radius) {
    let values = ["game1", "game2", "game3"];
    let arr = [];
    for (let i = 0; i < 3; i++) {
        let ang = TWO_PI / 3 * i - PI / 2;
        arr.push({
            label: values[i],
            x: cx + cos(ang) * radius,
            y: cy + sin(ang) * radius
        });
    }
    return arr;
}

/* ======================================================
   INPUT
====================================================== */

function keyPressed() {
    if (stage === "game1" && game1Stage === "play") {
        if (key === ' ' && millis() - lastBulletTime > bulletCooldown) {
            bullets.push({
                x: planeX,
                y: planeY - 20,
                size: 10,
                speed: 12,
                active: true
            });
            lastBulletTime = millis();
            shootSound.play();
        }
    }
    // ========== Game 2 ========== 
    if (stage === "game2" && game2Stage === "play") {
        if (key === ' ' && millis() - lastBulletTime > bulletCooldown) {
            bullets.push({
                x: planeX,
                y: planeY - 20,
                size: 10,
                speed: 12,
                active: true
            });
            lastBulletTime = millis();
            shootSound.play();
        }
    }

}

function mousePressed() {
    // ==== Back Button ====
    if (mouseX > 20 && mouseX < 140 && mouseY > 35 && mouseY < 85) {
        if (stage === "game1" && game1Stage === "end") {
            game1Stage = "start";
            stage = "rules";
            // Stop background vosic
            if (rainSound.isPlaying()) rainSound.stop();
            return;
        }
        if (stage === "game2End") {
            stage = "rules";
            return;
        }
    }

    // ------- RULES PAGE -------
    if (stage === "rules") {
        let buttons = getCircularButtons(450, 450, 300);
        for (let b of buttons) {
            if (insideButton(mouseX, mouseY, b.x, b.y)) {
                stage = b.label;
                if (b.label === "game1") {
                    game1Stage = "start";
                    resetGame1();
                }
                if (b.label === "game2") {
                    game2Stage = "start";
                }
                return;
            }
        }
        return;
    }

    // ------- GAME 1 : START -------
    if (stage === "game1" && game1Stage === "start") {
        if (
            mouseX > width / 2 - 110 &&
            mouseX < width / 2 + 110 &&
            mouseY > height / 2 + 100 &&
            mouseY < height / 2 + 180
        ) {
            game1Stage = "play";
            resetGame1();
            game1StartTime = millis();
            if (!rainSound.isPlaying()) {
                rainSound.setLoop(true);
                rainSound.setVolume(0.3);
                rainSound.play();
            }
        }
        return;
    }

    // ------- GAME 1 : END -------
    if (stage === "game1" && game1Stage === "end") {
        // click Try Again
        if (
            mouseX > width / 2 - 100 &&
            mouseX < width / 2 + 100 &&
            mouseY > height / 2 - 70 &&
            mouseY < height / 2 - 30
        ) {
            game1Stage = "start";
            resetGame1();

            if (rainSound.isPlaying()) rainSound.stop();
            return;
        }

        if (
            mouseX > width / 2 - 120 &&
            mouseX < width / 2 + 120 &&
            mouseY > height / 2 + 130 &&
            mouseY < height / 2 + 170
        ) {
            game1Stage = "start";
            stage = "rules";
            if (rainSound.isPlaying()) rainSound.stop();
            return;
        }
        return;
    }

    // ------- GAME 2 : START -------
    if (stage === "game2" && game2Stage === "start") {
        if (
            mouseX > width / 2 - 110 &&
            mouseX < width / 2 + 110 &&
            mouseY > height / 2 + 100 &&
            mouseY < height / 2 + 180
        ) {
            game2Stage = "play";
            game2StartTime = millis();
            game2Score = 0;
            game2BonusTimeMs = 0;
            game2BonusEatCount = 0;
            enemies = [];
            bullets = [];
            setupStars2();
        }
        return;
    }

    // ------- GAME 2 : END -------
    if (stage === "game2" && game2Stage === "end") {


        if (
            mouseX > width / 2 - 100 &&
            mouseX < width / 2 + 100 &&
            mouseY > height / 2 - 70 &&
            mouseY < height / 2 - 30
        ) {
            game2Stage = "start";
            game2Score = 0;
            game2BonusTimeMs = 0;
            game2BonusEatCount = 0;
            enemies = [];
            bullets = [];
            setupStars2();
            if (rainSound.isPlaying()) rainSound.stop();
            return;
        }


        if (
            mouseX > width / 2 - 120 &&
            mouseX < width / 2 + 120 &&
            mouseY > height / 2 + 130 &&
            mouseY < height / 2 + 170
        ) {
            game2Stage = "start";
            stage = "rules";
            if (rainSound.isPlaying()) rainSound.stop();
            return;
        }
    }
}
/* ---------------- HIT DETECTION ---------------- */
function insideButton(mx, my, bx, by) {
    return (
        mx > bx - 130 &&
        mx < bx + 130 &&
        my > by - 30 &&
        my < by + 30
    );
}

/* =====================================================
   GAME 1 FUNCTIONS
===================================================== */

function drawPlane1() {


    imageMode(CENTER);
    image(flameImg, planeX, planeY + 80, 80, 70);
    fill(30, 60, 140);
    ellipse(planeX, planeY, planeSize * 1, planeSize * 2.8);

    // ---------------- PLANE ----------------
    fill(30, 60, 140);
    triangle(
        planeX - planeSize, planeY + 25,
        planeX + planeSize, planeY + 25,
        planeX, planeY - 30
    );

    // ---------------- PLANE ----------------
    fill(30, 60, 140);
    triangle(
        planeX - planeSize / 2, planeY + 35,
        planeX + planeSize / 2, planeY + 35,
        planeX, planeY - 30
    );
}
/* ---------------- BULLETS ---------------- */
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

/* ---------------- ENEMIES ---------------- */
function spawnEnemy1() {
    enemyCount++;

    let difficulty = min(0.6, enemyCount * 0.01);


    let r = random();

    let type = "normal";
    let color = "#000";


    if (enemyCount % 5 === 0) {
        type = "yellow";
        color = "#ffe600";
    }


    if (r < difficulty) {
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

function drawSpeedLines() {
    if (random() < 0.4) {
        speedLines.push({
            x: random(0, width),
            y: -20,
            length: random(50, 120),
            speed: random(8, 20),
            alpha: random(80, 150)
        });
    }


    for (let i = speedLines.length - 1; i >= 0; i--) {
        let l = speedLines[i];

        stroke(255, 255, 255, l.alpha);
        strokeWeight(2);
        line(l.x, l.y, l.x, l.y + l.length);

        l.y += l.speed;

        if (l.y > height + 20) speedLines.splice(i, 1);
    }

    noStroke();
}
function shootBossBullet() {

    // Boss fires a bullet every 120 frames
    if (frameCount % 120 === 0) {

        // Give the boss a horizontal dash movement
        monster.xSpeed = random([-10, -7, 7, 10]);
        monster.x += monster.xSpeed;

        // Bounce back when reaching edges
        if (monster.x < 50 || monster.x > 850) {
            monster.xSpeed *= -1;
        }

        // Create a new bullet
        bossBullets.push({
            x: monster.x,
            y: monster.y + monster.size / 2,
            size: 12,
            speed: 8
        });
    }

    // Draw and update boss bullets
    for (let b of bossBullets) {
        fill(180, 80, 255);   // purple bullet
        b.y += b.speed;
        ellipse(b.x, b.y, b.size);

        // Hit detection → Game Over
        let d = dist(b.x, b.y, planeX, planeY);
        if (d < b.size / 2 + planeSize / 2) {
            game1Stage = "end";
        }
    }

    // Remove bullets that leave the screen
    bossBullets = bossBullets.filter(b => b.y < height + 50);
}
function updateEnemies1() {
    for (let e of enemies) {
        if (!e.alive) continue;

        //  RED COLLISION WITH PLANE → DEATH
        let d = dist(e.x, e.y, planeX, planeY);
        if (e.type === "red" && d < e.size / 2 + planeSize / 2) {
            if (game1Score > game1BestScore)
                game1BestScore = game1Score;
            game1Stage = "end";
            return;
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
        if (e.type === "red") {
            e.x = lerp(e.x, planeX, 0.02);
        }
        fill(e.color);
        ellipse(e.x, e.y, 30, 60);
        fill(255, 150, 0, 150);
        ellipse(e.x, e.y + e.size * 0.5, e.size * 0.3, e.size * 0.6);

        if (e.y > height + 40) e.alive = false;
    }
}

/* ---------------- ON HIT ---------------- */
function handleHit1(e) {
    game1KillCount++;
    if (game1KillCount === 8) {
        planeBoost = true;
    }
    e.absorbing = true;
    game1Score++;

    if (e.type === "yellow") bonusTimeMs += 3000;

    if (e.type === "red") {
        game1Stage = "end";
    }
}

/* ---------------- RESET ---------------- */
function resetGame1() {
    game1Score = 0;
    bonusTimeMs = 0;
    bullets = [];
    enemies = [];
    enemyCount = 0;
    game1KillCount = 0;
    timeOver = false;
    gameOver = false;
}

function runGame1() {

    // ---- LEVEL CLEAR ----
    if (game1KillCount >= 18) {
        level1Cleared = true;
        stage = "game2";
        game2Stage = "start";
        enemies = [];
        bullets = [];
        return;
    }

    // ---- TIME CALCULATION ----
    let elapsed = millis() - game1StartTime;
    let remaining = max(0, (game1Timer * 1000 - elapsed) / 1000);

    if (remaining <= 0 && !gameOver) {

        timeOver = true;
        gameOver = false;
        game1Stage = "end";
    }

    // ---- PLAYER LOSE ----
    if (playerHit) {
        gameOver = true;
        timeOver = false;
        game1Stage = "end";
    }

    /* ============= START PAGE ============= */
    if (game1Stage === "start") {
        background(255, 240, 200);
        fill(0);
        textSize(32);
        text("Plane Time!", width / 2, height / 2 - 120);
        textSize(20);
        text("Move mouse to control plane", width / 2, height / 2 - 40);
        text("Press SPACE to shoot", width / 2, height / 2 - 10);
        text("Yellow enemy = +3s", width / 2, height / 2 + 20);
        text("Red enemy = deadly", width / 2, height / 2 + 50);

        fill(255, 200, 200);
        rect(width / 2, height / 2 + 140, 220, 80, 20);
        fill(0);
        textSize(28);
        text("Start", width / 2, height / 2 + 140);
        return;
    }

    /* ============= END PAGE ============= */
    if (game1Stage === "end") {
        background(0);
        textAlign(CENTER, CENTER);

        textSize(55);

        if (gameOver) {
            fill("red");
            text("YOU LOSE!", width / 2, height / 2 - 120);

            fill("white");
            textSize(40);
            text("Try Again", width / 2, height / 2 - 50);
        } else if (timeOver) {
            fill("yellow");
            text("TIME'S UP!", width / 2, height / 2 - 120);

            fill("white");
            textSize(40);
            text("Try Again", width / 2, height / 2 - 50);
        }

        fill("white");
        textSize(32);
        text("Final Score: " + game1Score, width / 2, height / 2 + 20);
        text("Best Score: " + game1BestScore, width / 2, height / 2 + 70);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
    }

    /* ============= PLAYING ============= */

    if (game1Stage === "play") {

        drawGradientBackground();
        runRainBackground();
        drawSimplePinkClouds();


        if (planeBoost) {
            planeX = lerp(planeX, mouseX, 0.25);
        } else {
            planeX = constrain(lerp(planeX, mouseX, 0.1 * planeSpeed), 50, 850);
        }
        drawPlane1();

        // Boss
        fill(monster.color);
        ellipse(monster.x, monster.y, monster.size);
        monster.y += monster.speed;
        if (monster.y > height + 50) {
            monster.y = -50;
            monster.x = random(50, 850);
        }
        shootBossBullet();


        if (frameCount % enemySpawnInterval === 0) spawnEnemy1();
        updateBullets1();
        updateEnemies1();

        // UI
        fill(255);
        textSize(22);
        textAlign(LEFT, TOP);
        text("Kills: " + game1KillCount + " / 18", 20, 50);

        textAlign(RIGHT, TOP);
        fill(255, 255, 0);
        text("Time: " + remaining.toFixed(1) + "s", width - 20, 50);


        if (game1KillCount >= 7 && game1KillCount < 18) {
            push();
            noStroke();
            fill(255, 255, 0, 80);
            ellipse(planeX, planeY - 80, 120, 40);
            pop();

            textSize(24);
            fill(0);
            textAlign(CENTER, TOP);
            text("Almost there!", width / 2, 90);
        }


        if (game1KillCount >= 18) {
            textSize(32);
            fill(255, 255, 0);
            textAlign(CENTER, CENTER);
            text("Level Clear!", width / 2, height / 2 - 100);
        }
    }
}

let simpleClouds = [];
function initSimplePinkClouds() {
    simpleClouds = [];

    for (let i = 0; i < 5; i++) {
        simpleClouds.push({
            x: random(100, 800),
            y: random(80, 300),
            size: random(120, 180),
            offset: random(1000)
        });
    }
}

function drawGradientBackground() {
    let ctx = drawingContext;

    let g = ctx.createLinearGradient(0, 0, 0, canvas.height);
    g.addColorStop(0, "rgba(255, 180, 240, 1)");
    g.addColorStop(1, "rgba(180, 220, 255, 1)");

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
function drawSimplePinkClouds() {
    noStroke();

    for (let c of simpleClouds) {

        //  Light floating up & down
        let floatY = c.y + sin(frameCount * 0.01 + c.offset) * 6;

        // Move from left to right (increase 0.3 → faster)
        c.x += 0.5;


        if (c.x > width + 200) {
            c.x = -200;
        }

        let floatX = c.x;

        //  Pink radial gradient
        let ctx = drawingContext;
        let g = ctx.createRadialGradient(floatX, floatY, c.size * 0.2, floatX, floatY, c.size);
        g.addColorStop(0, "rgba(255, 230, 250, 1)");
        g.addColorStop(0.5, "rgba(255, 180, 240, 0.85)");
        g.addColorStop(1, "rgba(255, 150, 230, 0.6)");

        ctx.fillStyle = g;

        // 3-circle cloud
        ellipse(floatX, floatY, c.size * 1.5, c.size);
        ellipse(floatX - c.size * 0.5, floatY + 10, c.size, c.size * 0.8);
        ellipse(floatX + c.size * 0.5, floatY + 10, c.size, c.size * 0.8);
    }
}
//* GAME 2*//
function runGame2() {


    // ---- LEVEL CLEAR ----
    if (game2KillCount >= 20) {
        stage = "game3";
        game3Stage = "start";
        enemies = [];
        bullets = [];
        return;
    }

    // ---- TIME CALCULATION ----
    let elapsed = millis() - game2StartTime;
    let remaining = max(0, (game2Timer * 1000 - elapsed) / 1000);

    if (remaining <= 0 && !game2Over) {

        game2TimeOver = true;
        game2Over = false;
        game2Stage = "end";
    }

    // ---- PLAYER LOSE ----
    if (playerHit2) {
        game2Over = true;
        game2TimeOver = false;
        game2Stage = "end";
    }

    // ======== START SCREEN ========
    if (game2Stage === "start") {
        drawGradientBackground();

        fill(0);
        textSize(36);
        text("Level 2: Hard Mode", width / 2, height / 2 - 120);

        fill(255, 150, 150);
        rect(width / 2, height / 2 + 140, 220, 80, 20);
        fill(0);
        textSize(28);
        text("Start", width / 2, height / 2 + 140);

        return;
    }
    // ======== END SCREEN ========
    if (game2Stage === "end") {
        background(0);

        fill("yellow");
        textSize(50);
        text("TIME'S UP!", width / 2, height / 2 - 120);

        fill("white");
        textSize(32);
        text("Final Score: " + game2Score, width / 2, height / 2 - 30);
        text("Best Score: " + game2BestScore, width / 2, height / 2 + 20);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 100);
        return;
    }
    // ------- GAME 2 : END -------
    if (stage === "game2" && game2Stage === "end") {
        game2Stage = "start";
        stage = "rules";
        return;
    }
    // ======== PLAY MODE ========
    if (game2Stage === "play") {

        drawStars2();

        drawSparkles();
        // ====== RAIN ENEMY TRIGGER ======
        if (game2BonusEatCount === 8 && game2RainEnemy === null) {
            game2RainEnemy = {
                x: random(50, 850),
                y: -60,
                w: 6,
                h: 40,
                speed: 12,
                alpha: 255
            };
        }

        if (game2RainEnemy !== null) {
            noStroke();
            fill(150, 255, 255, game2RainEnemy.alpha);
            rect(game2RainEnemy.x, game2RainEnemy.y, game2RainEnemy.w, game2RainEnemy.h, 10);
            game2RainEnemy.y += game2RainEnemy.speed;

            if (game2RainEnemy.y > height + 80) {
                game2RainEnemy = null;
            }
        }

        // Plane
        planeX = constrain(mouseX, 50, 850);
        drawPlane1();

        if (planeBoost) {
            fill(255, 100, 0, 180);
            ellipse(planeX, planeY + 40, 20, 40);
        }
        // Bullets
        updateBullets2();

        // Enemies
        if (frameCount % game2EnemySpawnInterval === 0) spawnEnemy2();
        updateEnemies2();

        // Time UI
        let elapsed = millis() - game2StartTime;
        let remaining = max(0, (game2BaseTimeMs + game2BonusTimeMs - elapsed) / 1000);

        fill(0);
        textSize(30);
        text("Score: " + game2Score, width / 2, 55);
        textSize(22);
        text("Time: " + remaining.toFixed(1) + "s", width / 2, 20);

        if (remaining <= 0) {
            if (game2Score > game2BestScore) game2BestScore = game2Score;
            game2Stage = "end";
        }
    }
    // ===== METEORS (will kill player) =====
    for (let m of meteors) {
        m.show();
        m.move();

        // If hit player → game over
        let d = dist(m.x, m.y, planeX, planeY);
        if (d < 40) {
            game2Stage = "end";
        }

        // Reset meteor if out of screen
        if (m.y > height + 120) {
            m.reset();
        }
    }
}
function updateBullets2() {
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
                handleHit2(e);
            }
        }
    }
}
function updateEnemies2() {
    for (let e of enemies) {
        if (!e.alive) continue;

        // ⛔ Red enemy hits the player → Game Over
        let d = dist(e.x, e.y, planeX, planeY);
        if (e.type === "red" && d < e.size / 2 + planeSize / 2) {
            game2Stage = "end";
            return;
        }

        // Absorbing state (same logic as Game1)
        if (e.absorbing) {
            e.x = lerp(e.x, planeX, 0.2);
            e.y = lerp(e.y, planeY, 0.2);
            if (dist(e.x, e.y, planeX, planeY) < 10) {
                e.alive = false;
            }
            continue;
        }

        //  NORMAL enemy — uses full “bouncing ball” movement
        if (e.type === "normal") {
            e.x += e.xspeed;
            e.y += e.yspeed;

            // Bounce horizontally
            if (e.x > width - e.size / 2 || e.x < e.size / 2) {
                e.xspeed = -e.xspeed;
            }
            // Bounce vertically
            if (e.y > height - e.size / 2 || e.y < e.size / 2) {
                e.yspeed = -e.yspeed;
            }
        }

        //  Red enemy — tracking behavior
        if (e.type === "red") {
            e.y += e.speed;
            e.x = lerp(e.x, planeX, 0.03);
        }

        // Yellow enemy — simple falling behavior
        if (e.type === "yellow") {
            e.y += e.speed;
        }

        fill(e.color);
        ellipse(e.x, e.y, e.size);

        // Remove falling-type enemies when they leave screen
        if (e.y > height + 40 && e.type !== "normal") {
            e.alive = false;
        }
    }
}
function spawnEnemy2() {

    game2EnemyCount++;

    let difficulty = min(0.8, game2EnemyCount * 0.02);
    let r = random();

    let type = "normal";
    let color = "#ffffff";   // ⭐ normal enemies are visible white

    // Yellow bonus enemy
    if (game2EnemyCount % 6 === 0) {
        type = "yellow";
        color = "#ffe600";
    }

    // Red dangerous enemy
    if (r < difficulty) {
        type = "red";
        color = "#ff0033";
    }

    // ⭐ Spawn enemy (safe area, always visible)
    let enemy = {
        x: random(50, 850),
        y: random(50, 300),
        size: 40,
        xspeed: random(-4, 4),
        yspeed: random(-4, 4),
        speed: random(3, 6),
        alive: true,
        absorbing: false,
        type,
        color
    };

    // ⭐ Prevent zero-speed bouncing
    if (abs(enemy.xspeed) < 1) enemy.xspeed = 2;
    if (abs(enemy.yspeed) < 1) enemy.yspeed = -2;

    enemies.push(enemy);
}

function setupStars2() {
    stars2 = [];
    let numStars = floor(starDensity2 * (width * height));

    for (let i = 0; i < numStars; i++) {
        stars2.push(new Star2());
    }
}


function drawStars2() {
    background(0);
    for (let s of stars2) {
        s.update();
        s.display();
    }
}
function handleHit2(e) {
    game2KillCount++;
    e.absorbing = true;
    game2Score++;


    if (e.type === "yellow") {
        game2BonusTimeMs += 3000;
        game2BonusEatCount++;
    }


    if (e.type === "red") {
        game2Stage = "end";
    }
}
function drawSparkles() {

    let sparkle = {
        x: random(width),
        y: random(height),
        size: random(1, 6)
    };

    noStroke();
    fill(255, 255, 0, random(150, 255));
    ellipse(sparkle.x, sparkle.y, sparkle.size, sparkle.size);
    ellipse(mouseX, mouseY, random(2, 6));
}

class Meteor {
    constructor() {
        this.x = random(width);
        this.y = random(-200, -50);
        this.speed = random(4, 7);
        this.w = random(18, 28);

        this.origX = this.x;
        this.origY = this.y;

        this.tailAlpha = 100;

        this.r = random(150, 255);
        this.g = random(150, 255);
        this.b = random(150, 255);
    }

    show() {
        // head
        fill(250, 120);
        ellipse(this.x, this.y, this.w, this.w);

        // small glow
        fill(250, 80);
        ellipse(this.x, this.y, this.w / 2, this.w / 2);

        // tail
        this.tailAlpha = map(this.y, 0, height, 100, 10);
        fill(this.r, this.g, this.b, this.tailAlpha);
        beginShape();
        vertex(this.x - this.w / 3, this.y - this.w / 3);
        vertex(this.x + this.w / 3, this.y + this.w / 3);
        vertex(this.origX + this.w / 3, this.origY + this.w / 3);
        vertex(this.origX - this.w / 3, this.origY - this.w / 3);
        endShape(CLOSE);
    }

    move() {
        this.x -= this.speed * 0.3;
        this.y += this.speed;
    }

    reset() {
        this.x = random(width);
        this.y = random(-200, -50);
        this.origX = this.x;
        this.origY = this.y;
        this.speed = random(4, 7);
    }
}
function runGame3() {
    background(220, 200, 255);
    textSize(50);
    text("Game 3 Start!", width / 2, height / 2);
}




