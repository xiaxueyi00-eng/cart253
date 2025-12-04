/**
 * Game Time
 * Author: xueyi
 */

"use strict";
let bgm1;
let shieldDurationMs = 5000;
let score1 = 0;
let flameImg;
let game2Lives = 3;
let meteors = [];
let stars2 = [];
let meteorNum = 4;
let starNum = 100;
let wave;
let yoff = 0;
let vertices = [];

let game2LastBulletTime = 0;
let playerHit = false;
// ===== METEOR SYSTEM FOR GAME 2 =====

let planeSpeed = 1;


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
let game3KillCount = 0;
// ===== GLOBAL =====
let stage = "intro";  // intro → sunAppear → rules → game1
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
// ===== GLOBAL VARIABLES =====

let sparkles = [];
let enemies = [];
let bullets = [];

let planeX, planeY;
let planeBoost = false;


let planeImmune = false;
let planeImmuneTimer = 0;
let game2StartTime;
let game2BaseTimeMs = 60000;
let game2BonusTimeMs = 0;

let game2Score = 0;
let game2BestScore = 0;
let game2KillCount = 0;
let game2EnemyCount = 0;

let game2EnemySpawnInterval = 60;
let game2Stage = "start";
let game2Over = false;
let game2TimeOver = false;


let starDensity2 = 170 / (900 * 900);
function setupStars2() {

    stars2 = [];
    for (let i = 0; i < 100; i++) {
        stars2.push({
            x: random(width),
            y: random(height),
            size: random(1, 3),
            update: function () {
                this.y += 0.5;
                if (this.y > height) this.y = 0;
            },
            display: function () {
                fill(255);
                ellipse(this.x, this.y, this.size);
            }
        });
    }


    sparkles = [];
}

// plane
let planeSize = 40;

// bullets & enemies

let enemyCount = 0;
let enemySpawnInterval = 40;

let speedLines = [];

let timedMonsters = [];


// --- Game2 bonus counter (number of yellow enemies collected) ---
let game2BonusEatCount = 0;

// --- Game2 falling rain-type enemy (triggered after enough bonuses) ---
let game2RainEnemy = null;


// ====== SOUNDS ======
let rainSound;
let shootSound;

function preload() {
    flameImg = loadImage("assets/images/image.png");

    bgm1 = loadSound("assets/sounds/game1.wav");

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
    stars = [];
    initPrettyStormClouds();

    planeX = width / 2;
    planeY = height - 100;

    meteors.push(new Meteor(100, 0, 5));
    meteors.push(new Meteor(300, -50, 3));

    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
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


        c.x += sin(frameCount * 20 + c.noiseOffset) * 20;


        if (c.x > width + 200) c.x = -200;
        if (c.x < -200) c.x = width + 200;
    }
}



// ===== CLOUDS =====
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

// ===== SUN =====
let sunRadius = 20;
let glowSize = 0;
let glowGrow = 1;

// ===== STARS ARRAY =====
let stars = [];



function draw() {
    background(204, 229, 255);

    if (stage === "intro") runIntroAnimation();
    else if (stage === "sunAppear") runSunAppear();
    else if (stage === "rules") runRulesScreen();
    else if (stage === "game1") runGame1();
    else if (stage === "game2") runGame2();
    else if (stage === "game3") runGame3();


    // ===== GAME1 END SCREEN =====
    if (game1Stage === "end") {
        background(0);
        textSize(55);
        if (gameOver) fill("red");
        else if (timeOver) fill("yellow");
        text(gameOver ? "YOU LOSE!" : "TRY AGAIN?", width / 2, height / 2 - 120);

        fill("white");
        textSize(40);
        text("Try Again", width / 2, height / 2 - 50);

        textSize(32);
        text("Final Score: " + game1Score, width / 2, height / 2 + 20);
        text("Best Score: " + game1BestScore, width / 2, height / 2 + 70);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
    }

    // ===== GAME2 END SCREEN =====
    if (stage === "game2" && game2Stage === "end") {
        background(0);
        textSize(55);
        textAlign(CENTER, CENTER);
        if (game2Over) fill("red");
        else if (game2TimeOver) fill("yellow");
        text(game2Over ? "YOU LOSE!" : "TIME'S UP!", width / 2, height / 2 - 120);

        fill("white");
        textSize(40);
        text("Try Again", width / 2, height / 2 - 50);

        textSize(32);
        text("Final Score: " + game2Score, width / 2, height / 2 + 20);
        text("Best Score: " + game2BestScore, width / 2, height / 2 + 70);

        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
    }
}

// ===== PLACEHOLDER FUNCTIONS =====
function runIntroAnimation() { }
function runSunAppear() { }
function runRulesScreen() { }
function runGame1() { }
function runGame2() { }
function runGame3() { }

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



function shootBulletGame1() {
    let b = new Bullet(planeX, planeY - 20, 12, 10);
    b.active = true;
    bullets.push(b);
}

/* ======================================================
   INPUT
====================================================== */
function keyPressed() {
    // ===== Game1 =====
    if (stage === "game1" && game1Stage === "play") {
        if (key === ' ' && millis() - lastBulletTime > bulletCooldown) {
            shootBulletGame1();
            lastBulletTime = millis();
            if (shootSound) shootSound.play();
        }
    }


    if (stage === "game2") {
        if (game2Stage === "start") {
            if (key === ' ') {
                game2Stage = "play";
                game2StartTime = millis();
                setupGame2();
            }
        }
        else if (game2Stage === "play") {
            if (key === ' ' && (!game2LastBulletTime || millis() - game2LastBulletTime > bulletCooldown)) {

                bullets.push(new Bullet(planeX, planeY - 20, 7));

                game2LastBulletTime = millis();


                if (shootSound) shootSound.play();
            }
        }
        else if (game2Stage === "end") {
            if (key === ' ') {
                game2Stage = "start";
            }
        }
    }
    if (stage === "game3" && game3Stage === "play") {
        if (key === ' ' && millis() - lastBulletTime3 > 200) {
            shootBulletGame3();
            lastBulletTime3 = millis();
            if (shootSound) shootSound.play();
        }
    }
    if (key === ' ' && millis() - lastBulletTime > bulletCooldown) {
        shootBulletGame1();
        lastBulletTime = millis();
        if (shootSound) shootSound.play();
    }
    if (stage === "game3" && game3Stage === "play") {
        if (key === ' ' && millis() - lastBulletTime3 > 200) {
            shootBulletGame3();
            lastBulletTime3 = millis();
            if (shootSound) shootSound.play();
        }
    }
}



function mousePressed() {

    // ===== RULES PAGE（）=====
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
                    setupGame2();
                }
                if (b.label === "game3") {
                    game3Stage = "start";
                    initGame3();     // ★ 正确启动 Game3
                }
                return;
            }
        }
    }

    // ===================== GAME 1 =====================
    if (stage === "game1" && game1Stage === "start") {
        game1Stage = "play";
        game1StartTime = millis();
        resetGame1();

        return;
    }
    if (stage === "game1" && game1Stage === "play") {

        // === Play BGM safely ===
        if (!bgm1.isPlaying()) {
            bgm1.setLoop(true);
            bgm1.play();
        }


    }
    if (stage === "game1" && game1Stage === "end") {
        stage = "rules";
        game1Stage = "start";
        bgm1.stop();
        return;
    }

    // ===================== GAME 2 =====================
    if (stage === "game2" && game2Stage === "start") {
        game2Stage = "play";
        game2StartTime = millis();
        setupGame2();
        return;
    }

    if (stage === "game2" && game2Stage === "end") {
        resetGame2();
        stage = "rules";
        return;
    }

    // ===================== GAME 3 =====================
    // START → PLAY
    if (stage === "game3" && game3Stage === "start") {
        game3Stage = "play";
        game3StartTime = millis();
        return;
    }

    // WIN / LOSE →
    if (stage === "game3" && (game3Stage === "win" || game3Stage === "lose")) {
        initGame3();
        game3Stage = "start";
        stage = "rules";
        return;
    }
}

// ---------------- HIT DETECTION ---------------- */
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
let enemy = {
    x: 100,
    y: 50,
    size: 40,
    type: "normal",
    alive: true,
    absorbing: false
};
enemies.push(enemy);

let bullet = {
    x: 120,
    y: 300,
    size: 10,
    speed: 5,
    toDelete: false
};
bullets.push(bullet);


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
function drawGradientBackground() {
    let ctx = drawingContext;
    let g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, "rgba(255, 180, 240, 1)");
    g.addColorStop(1, "rgba(180, 220, 255, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);
}

/* ---------------- GAME1  ---------------- */
function updateBulletsGame1() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.move();
        b.show();


        for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            if (!e.alive) continue;

            let d = dist(b.x, b.y, e.x, e.y);
            if (d < (b.size / 2 + e.size / 2)) {
                console.log("Bullet hit:", e.type);


                if (e.type === "yellow") {
                    game1Score += 1;
                    bonusTimeMs += 3000;
                } else if (e.type === "normal") {
                    game1Score += 1;
                } else if (e.type === "red") {
                    game1Stage = "end";
                }


                e.alive = false;


                bullets.splice(i, 1);
                break;
            }
        }
    }


    enemies = enemies.filter(e => e.alive);
}

function updateEnemies1() {
    for (let e of enemies) {
        if (!e.alive) continue;


        e.y += e.speed;

        if (e.type === "red") e.x = lerp(e.x, planeX, 0.02);


        fill(e.color);
        ellipse(e.x, e.y, 30, 60);
        fill(255, 150, 0, 150);
        ellipse(e.x, e.y + e.size * 0.5, e.size * 0.3, e.size * 0.6);


        if (e.y > height + 40) e.alive = false;


        if (e.type === "red" && dist(e.x, e.y, planeX, planeY) < planeSize / 2 + e.size / 2) {
            game1Stage = "end";
            return;
        }
    }
}

/* ---------------- RUN GAME1 ---------------- */
function runGame1() {
    drawGradientBackground();
    runRainBackground();

    if (game1Stage === "start") {
        background(255, 240, 200);
        fill(0);
        textSize(32);
        text("After-Rain Holiday ", width / 2, height / 2 - 120);
        textSize(20);
        text(" level one", width / 2, height / 2 - 80);

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

    if (game1Stage === "play") {
        updateBulletsGame1();


        planeX = constrain(lerp(planeX, mouseX, 0.1 * planeSpeed), 50, 850);
        drawPlane1();


        if (frameCount % enemySpawnInterval === 0) spawnEnemy1();
        updateEnemies1();

        // UI
        fill(255);
        textSize(22);
        textAlign(LEFT, TOP);
        text("Score: " + game1Score + " / 18", 20, 50);

        textAlign(RIGHT, TOP);
        fill(255, 255, 0);
        let elapsed = millis() - game1StartTime;
        let remaining = max(0, (game1Timer * 1000 - elapsed) / 1000);
        text("Time: " + remaining.toFixed(1) + "s", width - 20, 50);


        if (game1KillCount >= 18) {
            level1Cleared = true;
            stage = "game2";
            game2Stage = "start";
            enemies = [];
            bullets = [];
            return;
        }

        if (remaining <= 0) {
            timeOver = true;
            gameOver = false;
            game1Stage = "end";
        }
    }

    if (game1Stage === "end") {
        background(0);
        textAlign(CENTER, CENTER);
        textSize(55);
        if (gameOver) fill("red");
        else if (timeOver) fill("yellow");
        text(gameOver ? "YOU LOSE!" : "TIME'S UP!", width / 2, height / 2 - 120);

        fill("white");
        textSize(32);
        text("Final Score: " + game1Score, width / 2, height / 2 + 20);
        text("Best Score: " + game1BestScore, width / 2, height / 2 + 70);
        textSize(24);
        text("Click to Return", width / 2, height / 2 + 150);
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



//Game Two



// ===== SHOOT BULLET =====
function shootBullet() {
    bullets.push(new Bullet(planeX, planeY - 30));
}



function setupGame2() {
    let stars = [];
    let game2Score = 0;
    let game2KillCount = 0;
    let sparkles = [];
    let enemy;

    // --- RESET PLAYER ---
    planeX = width / 2;
    planeY = height - 100;

    // --- ALWAYS RESET ARRAYS ---
    bullets = [];
    enemies = [];
    meteors = [];
    stars2 = [];
    sparkles = [];

    // --- GAME VARIABLES ---
    game2Score = 0;
    game2KillCount = 0;
    game2EnemyCount = 0;
    game2BonusTimeMs = 0;
    game2LastBulletTime = 0;
    game2Lives = 3;
    game2Over = false;

    planeImmune = false;
    planeImmune = false;
    planeImmuneTimer = 0;
    // --- INITIALIZE ENVIRONMENT ---
    setupStars2();
    initMeteors();

    enemy = {
        x: random(50, width - 50),
        y: random(50, 300),
        size: 40,
        xspeed: random(-4, 4),
        yspeed: random(-4, 4),
        speed: random(3, 6),
        alive: true,
        hp: 3
    };


    stars = [];
    for (let i = 0; i < 20; i++) {
        stars.push(new Star(random(width), random(height)));
    }


    sparkles = [];
    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
    }

    for (let i = 0; i < starNum; i++) {
        stars2.push(new Star());
    }

    wave = new Wave();
}

function setupStars2() {
    stars2 = [];
    for (let i = 0; i < 100; i++) {
        stars2.push({
            x: random(width),
            y: random(height),
            size: random(1, 3),
            update: function () { this.y += 0.5; if (this.y > height) this.y = 0; },
            display: function () { fill(255); ellipse(this.x, this.y, this.size); }
        });
    }
    sparkles = [];
}


function initMeteors() {
    meteors = [];
    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
    }
}

function drawPlane2() {
    imageMode(CENTER);
    image(flameImg, planeX, planeY + 80, 80, 70);
    fill(30, 60, 140);
    ellipse(planeX, planeY, planeSize * 1, planeSize * 2.8);

    fill(30, 60, 140);
    triangle(
        planeX - planeSize, planeY + 25,
        planeX + planeSize, planeY + 25,
        planeX, planeY - 30
    );

    fill(30, 60, 140);
    triangle(
        planeX - planeSize / 2, planeY + 35,
        planeX + planeSize / 2, planeY + 35,
        planeX, planeY - 30
    );
}

// ===== GAME2 PLANE DRAW =====

function runGame2() {
    if (game2Stage === "start") {
        drawStartScreen();
    } else if (game2Stage === "play") {
        background(0);


        for (let s of stars2) {
            s.update();
            s.display();
        }

        planeY = height - 200;
        planeX = constrain(lerp(planeX, mouseX, 0.1 * planeSpeed), 50, width - 50);
        drawPlane2();


        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].move();
            bullets[i].show();


            for (let enemy of enemies) {
                if (!enemy.alive) continue;
                let d = dist(bullets[i].x, bullets[i].y, enemy.x, enemy.y);
                if (d < enemy.size / 2) {
                    handleHit(enemy);
                    bullets[i].toDelete = true;
                }
            }


            if (bullets[i].toDelete) bullets.splice(i, 1);
        }


        updateEnemies();


        checkMeteors();

        // UI
        drawUI();
    } else if (game2Stage === "end") {
        drawEndScreen();
    }
}

function Meteor() {
    this.x = random(width);
    this.y = random(-3, -10);
    this.speed = random(2, 4);
    this.w = random(10, 15);
    this.r = random(152, 255);
    this.g = random(152, 255);
    this.b = random(152, 255);
    this.origX = this.x;
    this.origY = this.y;
    this.tailAlpha = 100;

    this.show = function () {
        fill(250, 70);
        ellipse(this.x, this.y, this.w, this.w);
        ellipse(this.x, this.y, this.w / 3, this.w / 3);

        fill(250, 50);
        ellipse(this.x + 2, this.y - 2, 2 * (this.w / 3), 2 * (this.w / 3));
        ellipse(this.x + 4, this.y - 4, (this.w / 2), (this.w / 2));
        ellipse(this.x + 7, this.y - 7, (this.w / 3), (this.w / 3));

        this.tailAlpha = map(this.y, 0, height, 70, 10);
        fill(this.r, this.g, this.b, this.tailAlpha);
        beginShape();
        vertex(this.x - this.w / 4, this.y - this.w / 4);
        vertex(this.x + this.w / 4, this.y + this.w / 4);
        vertex(this.origX + this.w / 4, this.origY + this.w / 4);
        vertex(this.origX - this.w / 4, this.origY - this.w / 4);
        endShape(CLOSE);
    }

    this.move = function () {
        this.x -= this.speed;
        this.y += this.speed;
    }
    this.reset = function () {
        this.x = random(width);
        this.y = random(-200, -50);
        this.origX = this.x;
        this.origY = this.y;
    }
}
function drawStartScreen() {
    background(4, 159, 266);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(50);
    text("GAME 2", width / 2, height / 2 - 120);

    textSize(24);
    text(
        "Rules:\n" +
        "• Avoid red enemies—they are deadly\n" +
        "• You have 3 lives in Level 2\n" +
        "• Try your best!",
        width / 2, height / 2 - 40
    );

    // Start 
    fill(255, 204, 255);
    rectMode(CENTER);
    rect(width / 2, height / 2 + 60, 160, 50, 10);
    fill(255);
    textSize(28);
    text("START", width / 2, height / 2 + 60);
}

function drawEndScreen() {
    background(0);
    textSize(55);
    textAlign(CENTER, CENTER);
    if (game2Over) fill("red");
    else if (game2TimeOver) fill("yellow");
    text(game2Over ? "YOU LOSE!" : "TIME'S UP!", width / 2, height / 2 - 120);

    fill("white");
    textSize(40);
    text("Try Again", width / 2, height / 2 - 50);

    textSize(32);
    text("Final Score: " + game2Score, width / 2, height / 2 + 20);
    text("Best Score: " + game2BestScore, width / 2, height / 2 + 70);

    textSize(24);
    text("Click to Return", width / 2, height / 2 + 150);
}
class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 40;
        this.speed = 3;
    }

    move() {
        this.y += this.speed;
    }

    show() {
        fill("red");
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}
class Star {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.a = random(0, PI);
        this.speed = random(PI / 30);
    }
    update() { this.a += this.speed; }
    display() {
        let brightness = map(sin(this.a), -1, 1, 10, 250);
        fill(255, brightness);
        ellipse(this.x, this.y, 3, 3);
    }
}

class Sparkle {
    constructor(w, h) {
        this.canvasWidth = w;
        this.canvasHeight = h;
        this.reset();
        this.size = random(1, 6);
        this.speed = random(1, 3);
        this.r = 255; this.g = 255; this.b = 0;
    }
    show() {
        fill(255, 120); ellipse(this.x, this.y, this.size);
        fill(this.r, this.g, this.b, 80); ellipse(this.x, this.y, this.size / 2);
    }
    move() { this.x -= this.speed * 0.3; this.y += this.speed; }
    reset() { this.x = random(this.canvasWidth); this.y = random(-200, -50); }
}

// ===== ENEMIES =====

function spawnEnemy() {
    console.log("spawnEnemy called");
    game2EnemyCount++;


    if (random() < 0.25) {
        enemies.push(new RedSplitEnemy(random(50, width - 50), -40, 50, 0));
        return;
    }


    let r = random();
    let type, color;

    if (game2EnemyCount % 6 === 0) {
        type = "yellow";
        color = "#ffe600";

    } else if (r < 0.3) {
        type = "red";
        color = "#ff0033";

    } else {
        type = "normal";
        color = "#ffffff";
    }

    let enemy = {
        x: random(50, width - 50),
        y: random(-40, -100),
        size: 40,
        xspeed: random(-4, 4),
        yspeed: random(-4, 4),
        speed: random(2, 5),
        alive: true,
        absorbing: false,
        type: type,
        color: color,
        hp: type === "red" ? 3 : 1
    };

    if (abs(enemy.xspeed) < 1) enemy.xspeed = 2;
    if (abs(enemy.yspeed) < 1) enemy.yspeed = -2;

    enemies.push(enemy);
}


function updateEnemies() {
    if (frameCount % 60 === 0) {
        spawnEnemy();
    }


    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (!e.alive) { enemies.splice(i, 1); continue; }

        if (e.type === "redSplit") {
            e.move();
            e.show();
            continue;
        }

        if (e.type === "normal") {
            e.x += e.xspeed; e.y += e.yspeed;
            if (e.x > width - e.size / 2 || e.x < e.size / 2) e.xspeed *= -1;
            if (e.y > height - e.size / 2 || e.y < e.size / 2) e.yspeed *= -1;
        } else if (e.type === "red") {
            e.y += e.speed;
            e.x = lerp(e.x, planeX, 0.03);
            if (dist(e.x, e.y, planeX, planeY) < 40) {
                game2Over = true;
                game2Stage = "end";
            }
            if (e.y > height + 50) e.alive = false;
        } else if (e.type === "yellow") {
            e.y += e.speed;
            if (e.y > height + 50) e.alive = false;
        }


        if (dist(e.x, e.y, planeX, planeY) < 40 && e.type !== "yellow" && !planeImmune) {
            game2Lives--;
            planeImmune = true;
            planeImmuneTimer = millis();
            if (game2Lives <= 0) {
                game2Over = true;
                game2Stage = "end";
            }
        }

        fill(e.color);
        ellipse(e.x, e.y, e.size);
    }
}

function resetGame2() {
    bullets = [];
    enemies = [];
    game2KillCount = 0;
    game2Score = 0;
    game2Over = false;
    game2Stage = "play";
    planeX = width / 2;
    planeY = height - 200;
    game2StartTime = millis();

    initMeteors();
}

function initMeteors() {
    meteors = [];
    for (let i = 0; i < meteorNum; i++) meteors.push(new Meteor());
}

function Wave() {
    this.show = function () {
        vertices.splice(0, vertices.length);
        push();
        if (frameCount % 4 === 0) yoff += 0.01;
        let xoff = 10;
        colorMode(HSB);
        fill(248, 71, 150);
        beginShape();
        for (let x = 0; x < width; x += 17) {
            let offset = map(noise(xoff, yoff), 0, 1, -60, 60);
            let y = 520 + offset;
            vertex(x, y);
            xoff += 0.03;
            vertices.push(createVector(x, y));
        }
        vertex(width, height);
        vertex(0, height);
        endShape(CLOSE);
        pop();
    }
}


// ===== METEORS =====
function checkMeteors() {
    for (let m of meteors) {
        m.show();
        m.move();
        if (dist(m.x, m.y, planeX, planeY) < 40 && !planeImmune) {
            game2Lives--;
            planeImmune = true;
            planeImmuneTimer = millis();
            if (game2Lives <= 0) {
                game2Over = true;
                game2Stage = "end";
            }
            m.y = -200;
        }
        if (m.y > height + 120) m.reset();
    }


    if (planeImmune && millis() - planeImmuneTimer > 2000) planeImmune = false;
}
// ===== TIME =====
function checkTime() {
    let elapsed = millis() - game2StartTime;
    let remaining = max(0, (game2BaseTimeMs + game2BonusTimeMs - elapsed) / 1000);
    if (remaining <= 0) { game2TimeOver = true; game2Stage = "end"; }
}


// ===== UI =====
function drawUI() {
    let elapsed = millis() - game2StartTime;
    let remaining = max(0, (game2BaseTimeMs + game2BonusTimeMs - elapsed) / 1000);

    fill(255, 255, 0);
    textAlign(CENTER, TOP);
    textSize(30);
    textSize(22);
    text("Time: " + remaining.toFixed(1) + "s", width / 2, 50);

    textAlign(LEFT, TOP);
    text("Kills: " + game2KillCount + " / 18", 20, 50);

    if (game2KillCount >= 7 && game2KillCount < 18) {
        push();
        noStroke();
        fill(255, 255, 0, 80);
        ellipse(planeX, planeY - 80, 120, 40);
        pop();
        textSize(24);
        fill(255, 255, 0);
        textAlign(CENTER, TOP);
        text("Almost there!", width / 2, 90);
    }

    if (game2KillCount >= 18) {
        textSize(32);
        fill(255, 255, 0);
        text("Level Clear!", width / 2 - 50, height / 2 - 30);
    }
    textAlign(RIGHT, TOP);
    fill(255);
    textSize(28);
    text("Lives: " + "❤️".repeat(game2Lives), width - 20, 50);
}

// ===== BULLET CLASS=====
class Bullet {
    constructor(x, y, speed = 10, size = 10) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.size = size;
        this.toDelete = false;
    }

    move() {
        this.y -= this.speed;
        if (this.y < 0) this.toDelete = true;
    }

    show() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}
class RedSplitEnemy {
    constructor(x, y, size = 40, generation = 0) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.generation = generation;
        this.speedY = random(2, 4);
        this.speedX = random(-2, 2);
        this.color = "#ff0033";
        this.type = "redSplit";
        this.alive = true;
    }

    move() {
        this.y += this.speedY;
        this.x += this.speedX;


        if (this.x < this.size / 2 || this.x > width - this.size / 2) {
            this.speedX *= -1;
        }

        if (this.y > height + 50) this.alive = false;
    }

    show() {
        noStroke();


        if (this.generation === 0) {
            fill("#ad417eff");
            ellipse(this.x, this.y, this.size);
        } else {
            noStroke();
            strokeWeight(3);
            fill("#f86986");
            ellipse(this.x, this.y, this.size * 1.2);
        }
    }
}
function handleHit(enemy) {
    if (!enemy.alive) return;


    if (enemy.type === "redSplit") {


        if (enemy.generation === 0) {
            let childSize = enemy.size * 0.6;

            enemies.push(new RedSplitEnemy(enemy.x - 20, enemy.y, childSize, 1));
            enemies.push(new RedSplitEnemy(enemy.x + 20, enemy.y, childSize, 1));
        }


        enemy.alive = false;

        game2Score += 10;
        game2KillCount++;

        return;
    }


    enemy.alive = false;
    enemy.absorbing = true;

    if (enemy.type === "normal" || enemy.type === "yellow") {
        game2Score += 10;
        game2KillCount++;
    }

    if (enemy.type === "yellow") {
        game2BonusTimeMs += 3000;
    }

    if (enemy.type === "red") {
        if (!planeImmune) {
            game2Lives--;
            planeImmune = true;
            planeImmuneTimer = millis();
            if (game2Lives <= 0) {
                game2Over = true;
                game2Stage = "end";
            }
        }
    }
}
function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        if (!b) continue;

        b.move();
        b.show();

        for (let e of enemies) {
            if (!e.alive) continue;

            let hitRadius = e.size / 2 + b.size / 2;
            if (dist(b.x, b.y, e.x, e.y) < hitRadius) {
                handleHit(e);
                b.toDelete = true;
            }
        }

        if (b.toDelete || b.y < 0) bullets.splice(i, 1);
    }
}






// ===== GAME 3 VARS =====
let game3Lives = 6;
let plane3Size = 40;
let game3Score = 0;
let game3StartTime = 0;
let game3Target = 20;
let game3Time = 80;
let game3Stage = "start";   // start → play → win/lose
let game3BestScore = 0;
let bgMeteors = [];
let planeX3, planeY3;
let bullets3 = [];
let enemies3 = [];
let lastBulletTime3 = 0;





// ===== INIT =====
function initGame3() {
    game3Stage = "start";
    planeX3 = width / 2;
    planeY3 = height - 150;
    bullets3 = [];
    enemies3 = [];
    game3Score = 0;
    game3Lives = 6;
    setupBackgroundMeteors();

}

// ===== START SCREEN =====
function drawGame3Start() {
    background(0);
    fill(255);
    textSize(50);
    textAlign(CENTER, CENTER);
    text("GAME 3", width / 2, height / 2 - 280);

    textSize(28);
    fill(200);
    text(
        "Rules:\n" +
        "• Pink enemies – touching them will deduct 1 point.\n" +
        "• Blue enemies – touching them will deduct 1 point.\n" +
        "• Red enemies – instant death.\n\n" +
        "You have 6 lives.\n" +
        "The final boss is extremely tough. Be patient and keep shooting.",
        width / 2,
        height / 2 - 40
    );
}
function drawPlane3() {

    imageMode(CENTER);
    image(flameImg, planeX3, planeY3 + 80, 80, 70);

    noStroke();
    fill(30, 60, 140);

    ellipse(planeX3, planeY3, plane3Size * 1, plane3Size * 2.8);

    triangle(
        planeX3 - plane3Size, planeY3 + 25,
        planeX3 + plane3Size, planeY3 + 25,
        planeX3, planeY3 - 30
    );

    triangle(
        planeX3 - plane3Size / 2, planeY3 + 35,
        planeX3 + plane3Size / 2, planeY3 + 35,
        planeX3, planeY3 - 30
    );
}

function runGame3() {

    // ===== START =====
    if (game3Stage === "start") {
        drawGame3Start();
        return;
    }

    // ===== PLAY =====
    if (game3Stage === "play") {

        drawGame3Background();

        // Timer
        let elapsed = (millis() - game3StartTime) / 1000;
        let remaining = game3Time - elapsed;
        if (remaining <= 0) game3Stage = "lose";

        // Plane movement
        planeX3 = constrain(lerp(planeX3, mouseX, 0.15), 50, width - 50);
        planeY3 = height - 150;

        // Draw plane 
        drawPlane3();

        // Spawn enemy
        if (frameCount % 45 === 0) spawnEnemy3();

        // ======== ENEMY LOOP ========
        for (let i = enemies3.length - 1; i >= 0; i--) {

            let e = enemies3[i];
            e.move();
            e.show();

            // ------ collision with player ------
            let d = dist(planeX3, planeY3, e.x, e.y);

            if (d < e.size / 2 + plane3Size / 2) {

                if (e.type === "boss") {
                    game3Stage = "lose";
                    return;
                }


                game3Lives--;
                enemies3.splice(i, 1);

                if (game3Lives <= 0) game3Stage = "lose";
                continue;
            }

            // ------ collision with bullets ------
            for (let j = bullets3.length - 1; j >= 0; j--) {
                let b = bullets3[j];
                let d2 = dist(b.x, b.y, e.x, e.y);

                if (d2 < e.size / 2 + b.size / 2) {

                    if (e.type === "boss") {
                        // Boss 
                        e.hp--;
                        bullets3.splice(j, 1);

                        if (e.hp <= 0) {
                            enemies3.splice(i, 1);
                            game3Score += 3;
                            if (game3Score >= game3Target) game3Stage = "win";
                        }
                    } else {

                        enemies3.splice(i, 1);
                        bullets3.splice(j, 1);
                        game3Score++;
                        if (game3Score >= game3Target) game3Stage = "win";
                    }

                    break;
                }
            }

            if (!e.alive) enemies3.splice(i, 1);
        }

        // ===== BULLETS =====
        for (let i = bullets3.length - 1; i >= 0; i--) {
            let b = bullets3[i];
            b.move();
            b.show();
            if (!b.active) bullets3.splice(i, 1);
        }

        // ===== UI =====
        fill(255);
        textSize(24);

        textAlign(LEFT, TOP);
        text("Score: " + game3Score + " / " + game3Target, 20, 20);
        text("Lives: " + "❤️".repeat(game3Lives), 20, 60);

        textAlign(RIGHT, TOP);
        text("Time: " + remaining.toFixed(1), width - 20, 20);
    }

    // ===== WIN =====
    else if (game3Stage === "win") {

        if (game3Score > game3BestScore) {
            game3BestScore = game3Score;
        }

        background(0, 200, 100);

        fill(255);
        textAlign(CENTER, CENTER);

        textSize(70);
        text("YOU WIN!", width / 2, height / 2 - 120);

        textSize(40);
        text("Score: " + game3Score, width / 2, height / 2 - 40);

        textSize(32);
        text("Best: " + game3BestScore, width / 2, height / 2 + 20);

        textSize(28);
        text("Click to return", width / 2, height / 2 + 120);
    }

    // ===== LOSE =====
    else if (game3Stage === "lose") {

        if (game3Score > game3BestScore) {
            game3BestScore = game3Score;
        }

        background(200, 0, 0);

        fill(255);
        textAlign(CENTER, CENTER);

        textSize(70);
        text("YOU LOSE", width / 2, height / 2 - 120);

        textSize(40);
        text("Score: " + game3Score, width / 2, height / 2 - 40);

        textSize(32);
        text("Best: " + game3BestScore, width / 2, height / 2 + 20);

        textSize(28);
        text("Click to retry", width / 2, height / 2 + 120);
    }
}

// ===== BULLET =====
class Bullet3 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 12;
        this.size = 10;
        this.active = true;
    }

    move() {
        this.y -= this.speed;
        if (this.y < -20) this.active = false;
    }

    show() {
        fill(255, 60, 60);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

function shootBulletGame3() {
    bullets3.push(new Bullet3(planeX3, planeY3 - 40));
}



function setupBackgroundMeteors() {
    bgMeteors = [];
    for (let i = 0; i < 6; i++) {
        bgMeteors.push(new BackgroundMeteor());
    }
}
// ===== BACKGROUND =====
function drawGame3Background() {

    for (let y = 0; y < height; y++) {
        let c = map(y, 0, height, 0, 255);
        stroke(c);
        line(0, y, width, y);
    }

    for (let m of bgMeteors) {
        m.update();
        m.show();
    }
}

class BackgroundMeteor {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.size = random(120, 200);
        this.speedY = random(0.2, 0.6);
        this.speedX = random(-0.5, 0.5);
        this.offset = random(TWO_PI);
        this.craters = [];


        let craterCount = floor(random(4, 10));
        for (let i = 0; i < craterCount; i++) {
            this.craters.push({
                ox: random(-this.size * 0.3, this.size * 0.3),
                oy: random(-this.size * 0.3, this.size * 0.3),
                r: random(this.size * 0.1, this.size * 0.3)
            });
        }
    }

    update() {

        this.y += this.speedY;


        this.x += this.speedX;


        this.x += sin(frameCount * 0.01 + this.offset) * 0.5;


        if (this.y > height + this.size) {
            this.y = -this.size;
            this.x = random(width);
        }


        this.x = constrain(this.x, -50, width + 50);
    }

    show() {
        noStroke();


        fill(130);
        ellipse(this.x, this.y, this.size);


        fill(90);
        for (let c of this.craters) {
            ellipse(this.x + c.ox, this.y + c.oy, c.r);
        }
    }
}




// ===== ENEMY =====
class Enemy3 {
    constructor() {
        this.y = random(80, 250);
        this.x = random(50, width - 50);
        this.size = 40;

        this.speedY = random(2.0, 3.0);
        this.speedX = random(2.0, 3.5);

        this.alive = true;
        this.angle = 0;          // for spin enemy
        this.hp = 1;             // default hp

        let r = random();

        if (r < 0.25) {
            //  Spin enemy
            this.type = "spin";
            this.color = "#ff0033";
            this.rotationSpeed = random(0.15, 0.35);

        } else if (r < 0.65) {

            this.type = "pink";
            this.color = "#f8c7db";
            this.baseX = this.x;
            this.phase = random(TWO_PI);
            this.amplitude = random(80, 140);

        } else if (r < 0.95) {

            this.type = "blue";
            this.color = "#66ccff";
            this.jumpTimer = 0;

        } else {

            this.type = "boss";
            this.color = "#aa88ff";
            this.size = 70;
            this.hp = 3;  // 3 hits to kill
            this.speedY = random(0.8, 1.5);
            this.speedX = random(1.5, 2.5) * (random() < 0.5 ? -1 : 1);
        }
    }

    move() {
        if (this.type === "spin") {

            this.y += this.speedY;
            this.x += cos(this.angle) * 1.5;
            this.angle += this.rotationSpeed;

        } else if (this.type === "pink") {
            this.y += this.speedY;
            this.x = this.baseX + sin(this.phase + this.y * 0.05) * this.amplitude;

        } else if (this.type === "blue") {
            this.y += this.speedY;
            this.jumpTimer++;
            if (this.jumpTimer > random(15, 25)) {
                this.x += random(-120, 120);
                this.x = constrain(this.x, 40, width - 40);
                this.jumpTimer = 0;
            }

        } else if (this.type === "boss") {

            this.y += this.speedY;
            this.x += this.speedX;

            if (this.x < 60 || this.x > width - 60) {
                this.speedX *= -1;
            }
        }

        if (this.y > height + 60) this.alive = false;
    }

    show() {
        noStroke();
        if (this.type === "spin") {

            push();
            translate(this.x, this.y);
            rotate(this.angle);
            fill(this.color);
            ellipse(0, 0, this.size);

            stroke(255);
            strokeWeight(3);
            line(0, 0, this.size / 2, 0);
            pop();
        } else if (this.type === "boss") {

            fill(this.color);
            ellipse(this.x, this.y, this.size);
            fill(255, 255, 255, 70);
            ellipse(this.x, this.y, this.size * 1.3);
        } else {
            fill(this.color);
            ellipse(this.x, this.y, this.size);
        }
    }
}

function spawnEnemy3() {
    enemies3.push(new Enemy3());
}

