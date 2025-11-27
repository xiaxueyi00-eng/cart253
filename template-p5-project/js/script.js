/**
 * Game Time
 * Author: xueyi
 */

"use strict";
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
let game1Stage = "start";  // start → play → end
let game1Score = 0;
let game1BestScore = 0;

let game1StartTime = 0;
let baseTimeMs = 40000;
let bonusTimeMs = 0;
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
let rainSound;
let shootSound;
// ====== PRELOAD ======
function preload() {
    rainSound = loadSound("assets/sounds/rain.wav");
    shootSound = loadSound("assets/sounds/shoot.wav");
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

    background(50, 255, 255, Alpha);

    a = a + speed;
    if (a > width) {
        a = -400;
    }

    b = b + speed / 2;
    if (b > width) {
        b = -200;
    }

    // CLOUDS — super simple version
    noStroke();
    fill(255);

    ellipse(a, 130, 90, 70);          // left
    ellipse(a + 60, 120, 110, 80);    // middle (largest)
    ellipse(a + 120, 135, 90, 70);    // right

    // Cloud B — slightly different shape
    ellipse(a + 260, 160, 80, 60);    // left
    ellipse(a + 320, 150, 100, 75);   // middle (largest)
    ellipse(a + 380, 165, 80, 60);    // right

    // Cloud C — different spacing
    ellipse(b + 110, 180, 85, 65);    // left
    ellipse(b + 170, 170, 115, 85);   // middle (largest)
    ellipse(b + 230, 190, 85, 65);    // right


    // Rain
    for (var i = 0; i < width; i += 20) {
        var y = random(-height, height);
        stroke(255, 50);
        line(i, 0, i, y - 100);

        var Y2 = random(height * 0.6, height);
        strokeWeight(2);
        stroke(0, 255, 255, 60);
        ellipse(i, Y2, 50, 5);
    }

    // Water wave
    fill(50, 50, 255, 5);
    offY += 0.003;
    var Y = noise(offY) * 1000;

    beginShape();
    vertex(0, Y);
    vertex(0, height);
    vertex(width, height);
    vertex(width, Y);
    endShape();
}

// ⭐ Game2 
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

// ===== SETUP =====
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
        game1Stage = "start";
        stage = "rules";
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
        game2Stage = "start";
        stage = "rules";
        return;
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
    fill(30, 60, 140);
    triangle(
        planeX - planeSize / 2, planeY + 20,
        planeX + planeSize / 2, planeY + 20,
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
        ellipse(e.x, e.y, e.size);

        if (e.y > height + 40) e.alive = false;
    }
}

/* ---------------- ON HIT ---------------- */
function handleHit1(e) {
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
}

function runGame1() {

    /* ======================
       START PAGE
    ====================== */
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

    /* ======================
       END PAGE
    ====================== */
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

        return;
    }

    /* ======================
       PLAY SECTION
    ====================== */
    if (game1Stage === "play") {


        let elapsed = millis() - game1StartTime;
        let t = floor(elapsed / 1000);
        let remaining = max(0, (baseTimeMs + bonusTimeMs - elapsed) / 1000);

        push();


        runRainBackground();


        // ======== ONE MONSTER ========
        let monster = {
            x: width / 2,
            y: -60,
            size: 80,
            speed: 3,
            color: "#8800ff"
        };

        for (let m of timedMonsters) {
            fill(m.color);
            ellipse(m.x, m.y, m.size);
            m.y += m.speed;
        }


        planeX = constrain(mouseX, 50, 850);
        drawPlane1();


        noStroke();
        for (let i = 0; i < 3; i++) {
            fill(255, 200, 240, 120 - i * 40);
            ellipse(planeX, planeY, planeSize + 40 + i * 20);
        }


        fill(monster.color);
        ellipse(monster.x, monster.y, monster.size);
        monster.y += monster.speed;


        if (monster.y > height + 50) {
            monster.y = -50;
            monster.x = random(50, 850);
        }
        if (frameCount % enemySpawnInterval === 0) spawnEnemy1();
        updateBullets1();
        updateEnemies1();

        // UI
        fill(0);
        textSize(30);
        text("Score: " + game1Score, width / 2, 55);

        textSize(22);
        textAlign(CENTER);
        text("Time: " + remaining.toFixed(1) + "s", width / 2, 20);


        if (remaining <= 0) {
            if (game1Score > game1BestScore)
                game1BestScore = game1Score;

            game1Stage = "end";
        }

        pop();
    }
}
//* GAME 2*//
function runGame2() {

    // ======== START SCREEN ========
    if (game2Stage === "start") {
        background(200, 255, 220);

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
function runGame3() {
    background(220, 200, 255);
    textSize(50);
    text("Game 3 Start!", width / 2, height / 2);
}
