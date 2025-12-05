/**
 * Game Time
 * Author: Xueyi Xia
 *
 * A game have three different levels can play,
 * given play different gameplay experience.
 * With each level offering unique challenges and aesthetics.
 * The game starts with a gentle clouds part，bringing player into an otherworldly experience.

 * The central menu has three flower buttons arranged in a pink sun:
 * • Game 1 – After-Rain Holiday
 * • Game 2 – Meteor Garden
 * • Game 3 – Final Flight
 *
 * Controls:
 * Move mouse → control the plane
 * SPACE → shoot bullets
 *
 * Built with p5.js
 * https://p5js.org
 *
 */


"use strict";

// ====== GLOBAL SOUNDS ======
let bgm1; // Background music of game 1
let bgm2;// Background music of game 2
let bgm3; // Background music of game 3


let game2SplitEatCount = 0;// Counter for Game2: number of split objects eaten by player

// ====== GLOBAL IMAGES ======
let flameImg;// Stores the flame image used for the player effect

function preload() {
    flameImg = loadImage("assets/images/image.png");
    // Load flame image before the game starts
    bgm1 = loadSound("assets/sounds/game1.wav");
    bgm2 = loadSound("assets/sounds/game2.mp3");
    bgm3 = loadSound("assets/sounds/game3.wav");


    shootSound = loadSound(
        "assets/sounds/shoot.wav",  // Path to shoot sound file
        () => console.log("shootSound loaded successfully"),
        err => console.error("shootSound failed to load", err)
    );
}
// ===== GAME1 COMBO SYSTEM =====
let game1Combo = 0; // Current combo count
let game1MaxCombo = 0; // Highest combo achieved
let game1ComboTimer = 0; // Timer that tracks combo duration
let game1ComboDuration = 2500;   // Maximum time (ms) to continue a combo
let comboFlashAlpha = 0;  // Flash visual effect transparency
let comboScale = 1; // Combo number scaling animation

let shieldDurationMs = 5000;  // Duration of shield (5 seconds)

let score1 = 0; // Game1 score counter
let game2Lives = 3; // Game2 player health
let meteors = [];// Array storing meteor objects for Game2
let stars2 = []; // Background stars for Game2
let meteorNum = 4;    // Initial meteor count
let starNum = 100; // Number of stars in Game2 background
let wave; // Variable for wave animation (Game2)
let yoff = 0; // Noise offset
let vertices = []; // Stores wave shape vertices


let playerHit = false;           // Tracks if player was recently h
// ===== METEOR SYSTEM FOR GAME 2 =====
let game2LastBulletTime = 0;     // Timestamp of last bullet in Game2
let planeSpeed = 1;              // Speed of Game2 player movement
let bossBullets = []; // Bullets fired by the Game2 boss
let cloudLayers = [];// Decorative clouds for background motion
let level1Cleared = false;    // Whether Game2 level 1 is completed
let level2Cleared = false;      // Whether Game2 level 2 is completed




let game3KillCount = 0;
// Number of enemies killed in Game 3

// ===== GLOBAL =====
let stage = "intro";  // intro → sunAppear → rules → game1
let bgY1 = 0;
let bgY2 = -900;// Background scroll positions (used for moving background layers)
let game1KillCount = 0;// Number of enemies killed in Game 1
// ===== BULLET COOLDOWN =====
let lastBulletTime = 0;// Records when the last bullet was fired (used for cooldown)
let bulletCooldown = 500; // Minimum time interval between shots (500ms = 0.5 seconds)

// ===== GAME1 VARS =====
let game1Timer = 60;// Game 1 countdown timer in seconds
let game1StartTime = 0;// Records the timestamp when Game 1 starts
let elapsed = 0;// Time passed since Game 1 started
let remaining = game1Timer// Remaining time to display
let game1Stage = "start";  // start → play → end
let game1Score = 0;// Current score of Game 1
let game1BestScore = 0;// Highest score achieved by the player in Game 1
let baseTimeMs = 60000;
// Base time limit in milliseconds (60 seconds)

let bonusTimeMs = 0;
// Extra time gained by hitting yellow enemies

let timeOver = false;
// True if the countdown reaches 0

let gameOver = false;
// True if player dies from a red enemy

/* ===== GAME 2 VARS ===== */
// ===== GLOBAL VARIABLES =====

let sparkles = [];// Sparkle effects used in Game 2 background animation
let enemies = [];// Array storing all enemies in Game 1 and Game 2
let bullets = [];// Array for all bullets fired by the player (shared system)
let planeX, planeY;
// Player plane position (shared between Game 1 and Game 2)

let planeBoost = false;
// Used for special speed effects (not currently implemented)

let planeImmune = false;
// Temporary invincibility after getting hit in Game 2

let planeImmuneTimer = 0;
// Timestamp when invincibility started

let game2StartTime;
// Timestamp when Game 2 begins

let game2BaseTimeMs = 60000;
// Base time for Game 2 (60 seconds)

let game2BonusTimeMs = 0;
// Extra time added for hitting yellow enemies

let game2Score = 0;
// Current score in Game 2

let game2BestScore = 0;
// Highest score for Game 2

let game2KillCount = 0;
// Number of enemies killed in Game 2 (also used for level progress)

let game2EnemyCount = 0;
// Total number of enemies spawned so far (not killed)

let game2EnemySpawnInterval = 60;
// Spawn a new enemy every 60 frames (~1 second)

let game2Stage = "start";
// "start" → title screen
// "play" → gameplay
// "end" → result screen

let game2Over = false;
// True when player dies (lives reach 0)

let game2TimeOver = false;
// True when countdown reaches 0

let starDensity2 = 170 / (900 * 900);
function setupStars2() {

    stars2 = []; // Reset the star array before generating new stars
    for (let i = 0; i < 100; i++) {  // Create exactly 100 stars for the animated starfield
        stars2.push({
            x: random(width),  // Random horizontal position across the canvas
            y: random(height),    // Random vertical position
            size: random(1, 3),   // Random star size (small dots for a natural star effect)
            update: function () {   // Random star size (small dots for a natural star effect)
                this.y += 0.5;
                if (this.y > height) this.y = 0;
            },
            display: function () {
                // Draw the star as a small white dot
                fill(255);
                ellipse(this.x, this.y, this.size);
            }
        });
    }
    sparkles = [];
}

// plane
let planeSize = 40;
// Player plane size

// bullets & enemies
let enemyCount = 0;
// How many enemies spawned (Game1)

let enemySpawnInterval = 40;
// Spawn enemy every 40 frames

let speedLines = [];
// Fast wind-line effects

let timedMonsters = [];
// Time-triggered monsters (unused placeholder)

// Game2 bonus (yellow enemies eaten)
let game2BonusEatCount = 0;

// Game2 special rain enemy
let game2RainEnemy = null;

// Sounds
let rainSound;
let shootSound;

function playWinMusic() {
    // stop all BGM first
    if (bgm1 && bgm1.isPlaying()) bgm1.stop();
    if (bgm2 && bgm2.isPlaying()) bgm2.stop();
    if (bgm3 && bgm3.isPlaying()) bgm3.stop();

}
// ====== SETUP ======

function setup() {
    createCanvas(900, 900); //Game canvans
    rectMode(CENTER);// Draw rectangles from center
    textAlign(CENTER, CENTER);// Center text alignment
    stars = [];// Reset stars array
    initPrettyStormClouds();// Setup intro clouds

    planeX = width / 2;
    planeY = height - 100;
    // Initial plane position
    meteors.push(new Meteor(100, 0, 5));
    meteors.push(new Meteor(300, -50, 3));
    // Add two preset meteors
    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());  // Add random meteors
    }
}

function drawStarBackground2() {
    background(0);

    noStroke();
    for (let s of stars2) {
        s.brightness = random(100, 255); // Flickering brightness effect
        // Draw star
        fill(s.brightness);
        ellipse(s.x, s.y, s.size);
    }
}
// =================== RAIN BACKGROUND ===================
let a = 0;
// Horizontal offset for rain animation

let b = 0;
// Secondary offset for layered rain

let speed = 0.5;
// Rain movement speed

let offY = 0;
// Noise offset for water wave effect

let Alpha = 15;
// Transparency value for rain graphics

function runRainBackground() {
    // First layer of rain (long streaks)
    for (let i = 0; i < width; i += 20) {
        let y = random(-height, height);
        stroke(255, 100);
        line(i, y - 50, i, y + 50);
    }

    noStroke();
    a += speed;// Move offset a
    if (a > width) a = -400;

    b += speed / 2; // Move offset b slower
    if (b > width) b = -200;

    // Second layer of rain (short streaks + splashes)
    for (var i = 0; i < width; i += 20) {
        var y = random(-height, height);
        stroke(255, 50);
        line(i, 0, i, y - 100); // Light rain streak

        var Y2 = random(height * 0.6, height);
        strokeWeight(2);
        stroke(180, 210, 255, 40);
        strokeWeight(2);
        ellipse(i, Y2, 45, 4);// Ground splash
    }

    // Water wave
    noStroke();

    offY += 0.003;
    var Y = noise(offY) * 1000; // Noise-based wave offset (used elsewhere)
}
// =========Clouds ========= //


function initPrettyStormClouds() {
    // Reset cloud layer list
    cloudLayers = [];
    for (let i = 0; i < 4; i++) {
        cloudLayers.push({
            y: random(80, 300), // Vertical position of this cloud layer
            speed: random(0.2, 1.0), // Horizontal drifting speed
            noiseOffset: random(1000),// Noise seed for floating animation
            color: color(60, 60, 80, random(150, 220)),// Cloud color with varying transparency
            scale: random(1.2, 2.0)// Size multiplier for each cloud layer
        });
    }
}

function drawPrettyStormClouds() {
    noStroke();
    // Clouds have soft edges
    for (let c of cloudLayers) {

        // Vertical floating motion using sine wave
        let floatY = c.y + sin(frameCount * 0.01 + c.noiseOffset) * 6;
        // Draw 3 layered cloud ellipses for depth
        for (let i = 0; i < 3; i++) {
            let r = 160 * c.scale * (1 - i * 0.2);
            let alpha = 70 - i * 20;
            // Inner layers are more transparent
            fill(255, 240, 255, alpha);
            ellipse(c.x, floatY, r * 2, r * 1.2);
        }

        // Horizontal drifting motion
        c.x += sin(frameCount * 20 + c.noiseOffset) * 20;


        // Wrap clouds horizontally across the screen
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
    // Default sky-blue background

    if (stage === "intro") runIntroAnimation();
    // Opening cloud animation

    else if (stage === "sunAppear") runSunAppear();
    // Sun expansion animation

    else if (stage === "rules") runRulesScreen();
    // Main menu with 3 game buttons

    else if (stage === "game1") runGame1();
    // Run Game 1

    else if (stage === "game2") runGame2();
    // Run Game 2

    else if (stage === "game3") runGame3();
    // Run Game 3


    // ===== GAME1 END SCREEN =====
    if (game1Stage === "end") {

        background(0);


        textAlign(CENTER, CENTER);

        textSize(55);
        if (gameOver) fill("red"); // Red = died by enemy
        else if (timeOver) fill("yellow");// Yellow = time ran out
        text(gameOver ? "YOU LOSE!" : "TRY AGAIN?", width / 2, height / 2 - 120);

        fill("white");
        textSize(40);

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
        if (game2Over) fill("red"); // Player died → red text
        else if (game2TimeOver) fill("yellow"); // Time up → yellow text
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
    let cx = width / 2; // Screen center X

    let cy = height / 2; // Screen center Y
    let opened = true; // Tracks if both cloud groups have fully moved away
    // Move left-side clouds to the left
    for (let c of cloudLeft) {
        drawCloudCircle(c.x, cy + c.y, 120);

        c.x -= 6;    // Slide left
        if (c.x > -100) opened = false; // If still on screen, not opened yet
    }
    // Move right-side clouds to the right
    for (let c of cloudRight) {
        drawCloudCircle(c.x, cy + c.y, 120);
        c.x += 6;    // Slide right
        if (c.x < width + 100) opened = false;  // If still on screen, not opened yet
    }
    // When both sides are fully open → go to next stage
    if (opened) stage = "sunAppear";
}

/* ---------------- SUN APPEAR ---------------- */
function runSunAppear() {
    let cx = width / 2;    // Center X
    let cy = height / 2;  // Center Y

    glowSize += glowGrow;    // Pulsing glow animation
    if (glowSize > 60 || glowSize < 0) glowGrow *= -1;

    drawPinkGradientCircle(cx, cy, sunRadius);

    if (sunRadius < 160) sunRadius += 5;// Grow the sun each frame
    else stage = "rules"; // When fully grown, go to the rules menu
}

/* ---------------- PINK SUN ---------------- */
function drawPinkGradientCircle(cx, cy, r) {
    let ctx = drawingContext;// Access the canvas 2D context
    let g = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r); // Radial gradient from center → edge
    g.addColorStop(0, "rgba(255, 230, 255, 1)");
    g.addColorStop(0.5, "rgba(242, 203, 242, 1)");
    g.addColorStop(1, "rgba(250, 192, 241, 1)");
    // Soft pink gradient steps
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TWO_PI); // Draw a circle with radius r
    ctx.fill(); // Render the gradient circle
}

/* ---------------- RULES SCREEN ---------------- */
function runRulesScreen() {
    let cx = width / 2;
    let cy = height / 2;
    // Screen center

    drawPinkGradientCircle(cx, cy, 200);    // Big pink circle background

    fill(0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("Game Time", cx, cy - 200);

    drawCircularButtons(cx, cy, 300);// Draw 3 game-select buttons around a circle
}

/* ---------------- FLOWER BUTTON ---------------- */
function drawButton(x, y, label) {
    noStroke();
    fill(255, 153, 204);
    // Petal color
    let d = 40, s = 45;
    // Draw 6 flower petals around the center
    ellipse(x, y - d, s + 10, s);
    ellipse(x, y + d, s + 10, s);
    ellipse(x - d, y + 15, s, s);
    ellipse(x + d, y + 15, s, s);
    ellipse(x - d * 1.1, y - d * 0.5, s, s);
    ellipse(x + d * 1.1, y - d * 0.5, s, s);

    fill(255, 204, 229);
    ellipse(x, y, 80, 80);
    // Button center circle
    fill(0);
    textSize(20);
    text(label, x - 3, y);
    // Button label ("Game 1", etc.)
}

function drawCircularButtons(cx, cy, radius) {
    let display = ["Game 1", "Game 2", "Game 3"];
    let values = ["game1", "game2", "game3"];
    // Labels and identifiers

    for (let i = 0; i < 3; i++) {
        let ang = TWO_PI / 3 * i - PI / 2;
        // Divide circle into 3 equal angles
        let bx = cx + cos(ang) * radius;
        let by = cy + sin(ang) * radius;
        // Button position on the circle
        drawButton(bx, by, display[i]); // Draw one flower button
    }
}

/* ---------------- BUTTON INFO (FOR CLICK) ---------------- */
function getCircularButtons(cx, cy, radius) {
    let values = ["game1", "game2", "game3"];
    // Button identifiers

    let arr = [];
    // Will store button data (label + position)

    for (let i = 0; i < 3; i++) {
        let ang = TWO_PI / 3 * i - PI / 2;
        // Angle position around a circle

        arr.push({
            label: values[i],
            // Which game this button represents

            x: cx + cos(ang) * radius,
            // Button X position on circle

            y: cy + sin(ang) * radius
            // Button Y position on circle
        });
    }

    return arr;
    // Used in mousePressed() to detect clicks
}


function shootBulletGame1() {
    let b = new Bullet(planeX, planeY - 20, 12, 10);
    // Create a bullet slightly above the plane

    b.active = true;
    // Mark bullet as active

    bullets.push(b);
    // Add to bullet list
}
/* ======================================================
   INPUT
====================================================== */
function keyPressed() {
    // ===== Game1 =====
    if (stage === "game1" && game1Stage === "play") {
        // Shoot if space pressed + cooldown ready
        if (key === ' ' && millis() - lastBulletTime > bulletCooldown) {
            shootBulletGame1();
            lastBulletTime = millis();
            // Start BGM1 if not playing
            if (!bgm1.isPlaying()) {
                bgm1.setLoop(true);
                bgm1.play();
            }
            if (shootSound) shootSound.play();
        }
    }

    // ===== Game2 =====
    if (stage === "game2") {
        // Press space → start game
        if (game2Stage === "start") {
            if (key === ' ') {
                game2Stage = "play";
                game2StartTime = millis();
                setupGame2();
            }
        }
        else if (game2Stage === "play") {
            // Shoot if cooldown ready
            if (key === ' ' && (!game2LastBulletTime || millis() - game2LastBulletTime > bulletCooldown)) {
                bullets.push(new Bullet(planeX, planeY - 20, 7));
                game2LastBulletTime = millis();
                if (shootSound) shootSound.play();
            }
        }
        else if (game2Stage === "end") {
            // Press space → restart Game2
            if (key === ' ') game2Stage = "start";
        }
    }

    // ===== Game3 =====
    if (stage === "game3" && game3Stage === "play") {
        // Shoot if cooldown ready
        if (key === ' ' && millis() - lastBulletTime3 > 200) {
            shootBulletGame3();
            lastBulletTime3 = millis();
            if (shootSound) shootSound.play();
        }
    }
}



function mousePressed() {

    // ===== RULES PAGE — main menu via 3 flowers =====
    if (stage === "rules") {
        let buttons = getCircularButtons(450, 450, 300);
        for (let b of buttons) {
            if (insideButton(mouseX, mouseY, b.x, b.y)) {

                if (b.label === "game1") {
                    stage = "game1";
                    game1Stage = "start";
                    resetGame1();
                } else if (b.label === "game2") {
                    stage = "game2";
                    game2Stage = "start";
                    setupGame2();
                } else if (b.label === "game3") {
                    stage = "game3";
                    game3Stage = "start";
                    initGame3();
                }
                return;
            }
        }
    }


    // ===== GAME 1 — Start Page Buttons =====
    if (stage === "game1" && game1Stage === "start") {

        let startX = width / 2;
        let startY = height / 2 + 140;
        let startW = 220, startH = 80;

        let backX = width / 2;
        let backY = height / 2 + 240;
        let backW = 200, backH = 60;

        // Back to menu
        if (
            mouseX > backX - backW / 2 && mouseX < backX + backW / 2 &&
            mouseY > backY - backH / 2 && mouseY < backY + backH / 2
        ) {
            stage = "rules";
            game1Stage = "start";
            return;
        }

        // Start
        if (
            mouseX > startX - startW / 2 && mouseX < startX + startW / 2 &&
            mouseY > startY - startH / 2 && mouseY < startY + startH / 2
        ) {
            game1Stage = "play";
            game1StartTime = millis();
            resetGame1();
            return;
        }

        return;
    }


    // ===== GAME 1 — End Page =====
    if (stage === "game1" && game1Stage === "end") {
        stage = "rules";
        game1Stage = "start";
        if (bgm1?.isPlaying()) bgm1.stop();
        return;
    }



    // =====================================================
    // =============== GAME 2  — Start Buttons =============
    // =====================================================
    if (stage === "game2" && game2Stage === "start") {

        let startX = width / 2;
        let startY = height / 2 + 120;
        let startW = 200, startH = 70;

        let backX = width / 2;
        let backY = height / 2 + 210;
        let backW = 220, backH = 70;

        // Back to menu
        if (
            mouseX > backX - backW / 2 && mouseX < backX + backW / 2 &&
            mouseY > backY - backH / 2 && mouseY < backY + backH / 2
        ) {
            stage = "rules";
            game2Stage = "start";
            return;
        }

        // Start Game 2
        if (
            mouseX > startX - startW / 2 && mouseX < startX + startW / 2 &&
            mouseY > startY - startH / 2 && mouseY < startY + startH / 2
        ) {
            game2Stage = "play";
            game2StartTime = millis();
            setupGame2();

            if (bgm2 && !bgm2.isPlaying()) {
                bgm2.setLoop(true);
                bgm2.play();
            }
            return;
        }

        return;
    }


    // ===== GAME 2 — End Page =====
    if (stage === "game2" && game2Stage === "end") {
        resetGame2();
        stage = "rules";
        if (bgm2?.isPlaying()) bgm2.stop();
        return;
    }



    // =====================================================
    // =============== GAME 3 — Start Buttons =============
    // =====================================================
    if (stage === "game3" && game3Stage === "start") {

        let startX = width / 2;
        let startY = height / 2 + 160;
        let startW = 220, startH = 70;

        let backX = width / 2;
        let backY = height / 2 + 250;
        let backW = 220, backH = 70;

        // Back to menu
        if (
            mouseX > backX - backW / 2 && mouseX < backX + backW / 2 &&
            mouseY > backY - backH / 2 && mouseY < backY + backH / 2
        ) {
            stage = "rules";
            game3Stage = "start";
            return;
        }

        // Start Game 3
        if (
            mouseX > startX - startW / 2 && mouseX < startX + startW / 2 &&
            mouseY > startY - startH / 2 && mouseY < startY + startH / 2
        ) {
            game3Stage = "play";
            game3StartTime = millis();

            if (!bgm3.isPlaying()) {
                bgm3.setLoop(true);
                bgm3.play();
            }
            return;
        }

        return;
    }


    // ===== GAME 3 — End Page =====
    if (stage === "game3" && (game3Stage === "win" || game3Stage === "lose")) {
        if (bgm3?.isPlaying()) bgm3.stop();
        initGame3();
        game3Stage = "start";
        stage = "rules";
        return;
    }
}

// ---------------- HIT DETECTION ---------------- */
function insideButton(mx, my, bx, by) {
    return (
        mx > bx - 130 &&   // inside left boundary
        mx < bx + 130 &&   // inside right boundary
        my > by - 30 &&    // inside top boundary
        my < by + 30       // inside bottom boundary
    );
}

/* =====================================================
   GAME 1 FUNCTIONS
===================================================== */
// A sample enemy object (used as an initial placeholder)
let enemy = {
    x: 100,
    y: 50,
    size: 40,
    type: "normal",
    alive: true,
    absorbing: false
};
enemies.push(enemy);// Add this enemy to the enemy list
// A sample bullet object (also a placeholder)
let bullet = {
    x: 120,
    y: 300,
    size: 10,
    speed: 5,
    toDelete: false
};
bullets.push(bullet);// A sample bullet object (also a placeholder)


function drawPlane1() {
    imageMode(CENTER);
    image(flameImg, planeX, planeY + 80, 80, 70); // Flame image under the plane
    fill(30, 60, 140);
    ellipse(planeX, planeY, planeSize * 1, planeSize * 2.8);  // Main plane body

    // ---------------- PLANE ----------------
    fill(30, 60, 140);
    triangle(
        planeX - planeSize, planeY + 25,
        planeX + planeSize, planeY + 25,
        planeX, planeY - 30
    );
    // Large triangle wing/body

    // ---------------- PLANE ----------------
    fill(30, 60, 140);
    triangle(
        planeX - planeSize / 2, planeY + 35,
        planeX + planeSize / 2, planeY + 35,
        planeX, planeY - 30
    );
    // Smaller front triangle
}



/* ---------------- ENEMIES ---------------- */
function spawnEnemy1() {
    enemyCount++;
    // Increase enemy count (difficulty uses this)
    let difficulty = min(0.6, enemyCount * 0.01);
    // Difficulty slowly increases (max 60%)

    let r = random();

    let type = "normal";
    let color = "#000";

    // Every 5 enemies → yellow bonus enemy
    if (enemyCount % 5 === 0) {
        type = "yellow";
        color = "#ffe600";
    }

    // Random chance enemy becomes RED (dangerous)
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

    // 40% chance each frame to add a new streak
    for (let i = speedLines.length - 1; i >= 0; i--) {
        let l = speedLines[i];

        stroke(255, 255, 255, l.alpha);
        strokeWeight(2);
        line(l.x, l.y, l.x, l.y + l.length);
        // Draw streak
        l.y += l.speed;
        // Move downward
        if (l.y > height + 20) speedLines.splice(i, 1); // Remove when off-screen
    }

    noStroke();
}

function updateEnemies1() {
    for (let e of enemies) {
        if (!e.alive) continue;

        //  RED COLLISION WITH PLANE → DEATH
        let d = dist(e.x, e.y, planeX, planeY);
        if (e.type === "red" && d < e.size / 2 + planeSize / 2) {
            game1Combo = 0;
            if (game1Score > game1BestScore)
                game1BestScore = game1Score;
            game1Stage = "end";
            return;
        }
        // Absorbing motion (yellow being sucked)
        if (e.absorbing) {
            e.x = lerp(e.x, planeX, 0.2);
            e.y = lerp(e.y, planeY, 0.2);
            if (dist(e.x, e.y, planeX, planeY) < 10) {
                e.alive = false;
            }
            continue;
        }
        // Normal movement
        e.y += e.speed;
        if (e.type === "red") {
            e.x = lerp(e.x, planeX, 0.02);
        }
        // Draw enemy body
        fill(e.color);
        ellipse(e.x, e.y, 30, 60);
        fill(255, 150, 0, 150);  // Glow / tail
        ellipse(e.x, e.y + e.size * 0.5, e.size * 0.3, e.size * 0.6);
        // Remove if moved off-screen
        if (e.y > height + 40) e.alive = false;
    }
}



/* ---------------- RESET ---------------- */
function resetGame1() {
    game1Score = 0;        // Reset score
    bonusTimeMs = 0;       // Reset bonus time
    bullets = [];          // Clear bullets
    enemies = [];          // Clear enemies
    enemyCount = 0;        // Reset enemy counter
    game1KillCount = 0;    // Reset kill count
    timeOver = false;      // Timer state
    gameOver = false;      // Death state
}
function drawGradientBackground() {
    let ctx = drawingContext;
    let g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, "rgba(255, 180, 240, 1)");
    g.addColorStop(1, "rgba(180, 220, 255, 1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height); // Full-screen gradient
}

/* ---------------- GAME1  ---------------- */
function updateBulletsGame1() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        let b = bullets[i];
        b.move();   // Move bullet
        b.show();   // Draw bullet

        // Check collision against every enemy
        for (let j = enemies.length - 1; j >= 0; j--) {
            let e = enemies[j];
            if (!e.alive) continue;

            let d = dist(b.x, b.y, e.x, e.y);
            if (d < (b.size / 2 + e.size / 2)) {
                console.log("Bullet hit:", e.type);
                // ===== GAME1 COMBO =====
                game1Combo++;
                game1ComboTimer = millis();
                if (game1Combo > game1MaxCombo) game1MaxCombo = game1Combo;

                // ===== KILL COUNT HERE =====
                game1KillCount++;
                // Enemy scoring
                if (e.type === "yellow") {
                    game1Score += 1;
                    bonusTimeMs += 3000;
                } else if (e.type === "normal") {
                    game1Score += 1;
                } else if (e.type === "red") {
                    game1Stage = "end";
                }


                e.alive = false;           // Remove enemy
                bullets.splice(i, 1);      // Remove bullet
                break;
            }
        }
    }

    // Remove all dead enemies
    enemies = enemies.filter(e => e.alive);
}

function updateEnemies1() {
    for (let e of enemies) {
        if (!e.alive) continue;


        e.y += e.speed;   // Move downward

        if (e.type === "red") e.x = lerp(e.x, planeX, 0.02);

        // Draw enemy
        fill(e.color);
        ellipse(e.x, e.y, 30, 60);
        fill(255, 150, 0, 150);
        ellipse(e.x, e.y + e.size * 0.5, e.size * 0.3, e.size * 0.6);

        // Remove enemy once it moves off-screen
        if (e.y > height + 40) e.alive = false;

        // Red enemy collision → Game Over
        if (e.type === "red" && dist(e.x, e.y, planeX, planeY) < planeSize / 2 + e.size / 2) {
            game1Stage = "end";
            return;
        }
    }
}

/* ---------------- RUN GAME1 ---------------- */
function runGame1() {
    rectMode(CORNER);
    drawGradientBackground();
    runRainBackground();

    // ===== START SCREEN =====
    if (game1Stage === "start") {

        background(255, 240, 200);
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("After-Rain Holiday", width / 2, height / 2 - 120);

        textSize(20);
        text("Level One", width / 2, height / 2 - 80);

        text("Move mouse to control plane", width / 2, height / 2 - 40);
        text("Press SPACE to shoot", width / 2, height / 2 - 10);
        text("Yellow enemy = +3s", width / 2, height / 2 + 20);
        text("Red enemy = deadly", width / 2, height / 2 + 50);


        rectMode(CENTER);

        // Start 
        let startX = width / 2;
        let startY = height / 2 + 140;
        fill(255, 180, 220);
        rect(startX, startY, 220, 80, 20);
        fill(0);
        textSize(28);
        text("Start", startX, startY);

        // Back to Menu 
        let backX = width / 2;
        let backY = height / 2 + 240;
        fill(255, 180, 180);
        rect(backX, backY, 200, 60, 15);
        fill(0);
        textSize(26);
        text("Back to Menu", backX, backY);

        rectMode(CORNER);

        return;
    }

    // ======== PLAY SCREEN ========
    if (game1Stage === "play") {
        updateBulletsGame1();
        updateEnemies1();
    }

    // Move plane (smooth)
    planeX = constrain(lerp(planeX, mouseX, 0.1 * planeSpeed), 50, 850);
    drawPlane1();

    if (frameCount % enemySpawnInterval === 0) spawnEnemy1();
    updateEnemies1();

    // ===== COMBO TIMEOUT =====
    if (game1Combo > 0 && millis() - game1ComboTimer > game1ComboDuration) {
        game1Combo = 0;
    }

    // ===== BIG COMBO EFFECT =====
    if (game1Combo > 1) {
        // screen flash
        comboFlashAlpha = 120;

        // enlarge combo text
        comboScale = 1.5;
    }

    // decay flash
    comboFlashAlpha = max(0, comboFlashAlpha - 4);
    comboScale = lerp(comboScale, 1, 0.1);

    // ===== SCREEN FLASH =====
    if (comboFlashAlpha > 0) {
        noStroke();
        fill(255, 220, 0, comboFlashAlpha);
        rect(0, 0, width, height);
    }

    // ===== COMBO TEXT =====
    if (game1Combo > 1) {
        push();
        textAlign(CENTER, CENTER);
        textSize(40 * comboScale);
        fill(255, 180, 0);
        text("COMBO x" + game1Combo, width / 2, 80);
        pop();
    }

    // ===== UI =====
    fill(255);
    textSize(22);
    textAlign(LEFT, TOP);
    text("Score: " + game1Score + " / 18", 20, 50);

    textAlign(RIGHT, TOP);
    fill(255, 255, 0);
    let elapsed = millis() - game1StartTime;
    let remaining = max(0, (game1Timer * 1000 - elapsed) / 1000);
    text("Time: " + remaining.toFixed(1) + "s", width - 20, 50);

    // ===== CLEAR LEVEL =====
    // ===== ENTER MONSTER STAGE =====

    // ===== TIME OUT =====
    if (remaining <= 0) {
        timeOver = true;
        gameOver = false;
        game1Stage = "end";
    }
}

// ===== GAME 2 =====//
// ===== SHOOT BULLET =====
function shootBullet() {
    bullets.push(new Bullet(planeX, planeY - 30));// Shoot upward
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
    bullets = [];      // Clear bullets
    enemies = [];      // Clear enemies
    meteors = [];      // Clear meteors
    stars2 = [];       // Clear stars
    sparkles = [];     // Clear sparkles

    // --- GAME VARIABLES ---
    game2Score = 0;
    game2KillCount = 0;
    game2EnemyCount = 0;
    game2BonusTimeMs = 0;
    game2LastBulletTime = 0;
    game2Lives = 3;
    game2Over = false;
    game2SplitEatCount = 0;
    planeImmune = false;
    planeImmune = false;
    planeImmuneTimer = 0;
    // --- INITIALIZE ENVIRONMENT ---
    setupStars2();     // Background stars
    initMeteors();     // Falling meteors

    // Random enemy placeholder (not used during gameplay)
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
    // Extra star visuals

    stars = [];
    for (let i = 0; i < 20; i++) {
        stars.push(new Star(random(width), random(height)));
    }

    // Meteor setup
    sparkles = [];
    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
    }
    // More background stars
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
            update: function () {  // Move star downward
                this.y += 0.5; if (this.y > height) this.y = 0;
            },
            display: function () {// Draw star
                fill(255); ellipse(this.x, this.y, this.size);
            }
        });
    }
    sparkles = [];// Reset sparkles
}


function initMeteors() {
    meteors = [];
    for (let i = 0; i < meteorNum; i++) {
        meteors.push(new Meteor());
    }
}

function drawPlane2() {
    imageMode(CENTER);
    image(flameImg, planeX, planeY + 80, 80, 70); // Flame
    fill(30, 60, 140);
    ellipse(planeX, planeY, planeSize * 1, planeSize * 2.8);// Body

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

    // =====================================
    //  GAME 2 — START SCREEN
    // =====================================
    if (game2Stage === "start") {

        background(240, 240, 255);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(32);
        text("Meteor Garden", width / 2, height / 2 - 120);

        textSize(20);
        text("Level Two", width / 2, height / 2 - 80);

        text("Move mouse to dodge meteors", width / 2, height / 2 - 40);
        text("Press SPACE to shoot", width / 2, height / 2 - 10);
        text("You have 3 lives", width / 2, height / 2 + 20);

        // ===== Start Button =====
        rectMode(CENTER);
        fill(200, 220, 255);
        rect(width / 2, height / 2 + 120, 200, 70, 20);

        fill(0);
        textSize(26);
        text("Start", width / 2, height / 2 + 120);

        // ===== Back to Menu =====
        fill(180, 240, 180);
        rect(width / 2, height / 2 + 210, 220, 70, 20);

        fill(0);
        textSize(24);
        text("Back to Menu", width / 2, height / 2 + 210);

        rectMode(CORNER);

        return;
    } else if (game2Stage === "play") {
        background(0);

        // Background stars
        for (let s of stars2) {
            s.update();
            s.display();
        }

        planeY = height - 200;
        planeX = constrain(lerp(planeX, mouseX, 0.1 * planeSpeed), 50, width - 50);
        drawPlane2();

        // Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
            bullets[i].move();
            bullets[i].show();

            // Bullet hits enemy
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
        updateEnemies();     // Enemy movement + collision
        checkMeteors();      // Meteor collision

        // ===== WIN AND AUTO GO TO GAME3 =====
        if (game2SplitEatCount >= 18) {
            game2Stage = "end";
            game2Over = false;
            game2TimeOver = false;

            setTimeout(() => {
                stage = "game3";
                initGame3();
            }, 1500);
        }
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
        // Meteor tail
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
    text("GAME 2", width / 2, height / 2 - 180);

    textSize(24);
    text(
        "Rules:\n" +
        "• Avoid red enemies — they kill instantly\n" +
        "• Other enemies reduce your lives (you have 3)\n" +
        "• Yellow enemies give bonus time\n" +
        "• Eat 18 split balls to clear the level!",
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
    game2EnemyCount++; // Count total enemies spawned

    // 25% chance → red-split enemy
    if (random() < 0.25) {
        enemies.push(new RedSplitEnemy(random(50, width - 50), -40, 50, 0));
        return;
    }


    let r = random();
    let type, color;
    // Every 6th enemy → yellow bonus
    if (game2EnemyCount % 6 === 0) {
        type = "yellow";
        color = "#ffe600";
        // 30% chance → red homing enemy
    } else if (r < 0.3) {
        type = "red";
        color = "#ff0033";
        // Otherwise → normal bouncing enemy
    } else {
        type = "normal";
        color = "#ffffff";
    }
    // Enemy object
    let enemy = {
        x: random(50, width - 50),
        y: random(-40, -100),
        size: 40,
        xspeed: random(-4, 4),
        yspeed: random(-4, 4),
        speed: random(4, 8),
        alive: true,
        absorbing: false,
        type: type,
        color: color,
        hp: type === "red" ? 3 : 1 // Red enemies take more hits
    };
    // Prevent too-slow movement
    if (abs(enemy.xspeed) < 1) enemy.xspeed = 2;
    if (abs(enemy.yspeed) < 1) enemy.yspeed = -2;

    enemies.push(enemy);
}


function updateEnemies() {
    // Spawn enemy every 60 frames
    if (frameCount % 60 === 0) {
        spawnEnemy();
    }


    for (let i = enemies.length - 1; i >= 0; i--) {
        let e = enemies[i];
        if (!e.alive) { enemies.splice(i, 1); continue; }
        // Red-split special enemy
        if (e.type === "redSplit") {
            e.move();
            e.show();
            continue;
        }
        // Normal enemy bounces around screen
        if (e.type === "normal") {
            e.x += e.xspeed; e.y += e.yspeed;
            if (e.x > width - e.size / 2 || e.x < e.size / 2) e.xspeed *= -1;
            if (e.y > height - e.size / 2 || e.y < e.size / 2) e.yspeed *= -1;
            // Red enemy → chases player + deadly on touch
        } else if (e.type === "red") {
            e.y += e.speed;
            e.x = lerp(e.x, planeX, 0.03);
            // Red hits player → immediate lose
            if (dist(e.x, e.y, planeX, planeY) < 40) {
                game2Over = true;
                game2Stage = "end";
            }
            if (e.y > height + 50) e.alive = false;
            // Yellow → simple falling bonus
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
        // Draw enemy
        fill(e.color);
        ellipse(e.x, e.y, e.size);
    }
}

function resetGame2() {
    bullets = [];          // Clear bullets
    enemies = [];          // Clear enemies
    game2KillCount = 0;
    game2Score = 0;
    game2Over = false;
    game2Stage = "play";
    planeX = width / 2;
    planeY = height - 200;
    game2StartTime = millis();

    initMeteors(); // Reset meteors
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
        fill(248, 71, 150);// Pink wave color
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
        m.show();     // Draw meteor
        m.move();     // Update position
        // Meteor hits player (unless immune)
        if (dist(m.x, m.y, planeX, planeY) < 40 && !planeImmune) {
            game2Lives--;                 // Lose one life
            planeImmune = true;// Temporary invincibility
            planeImmuneTimer = millis();
            if (game2Lives <= 0) {// Game over
                game2Over = true;
                game2Stage = "end";
            }
            m.y = -200;
        }
        // Off-screen → reset
        if (m.y > height + 120) m.reset();
    }

    // Remove invincibility after 2 seconds
    if (planeImmune && millis() - planeImmuneTimer > 2000) planeImmune = false;
}
// ===== TIME =====
function checkTime() {
    let elapsed = millis() - game2StartTime;
    let remaining = max(0, (game2BaseTimeMs + game2BonusTimeMs - elapsed) / 1000);
    // Time runs out → end game
    if (remaining <= 0) {
        game2TimeOver = true; game2Stage = "end";
    }
}


// ===== UI =====
function drawUI() {
    let elapsed = millis() - game2StartTime;
    let remaining = max(0, (game2BaseTimeMs + game2BonusTimeMs - elapsed) / 1000);
    //Time 
    fill(255, 255, 0);
    textAlign(CENTER, TOP);
    textSize(30);
    textSize(22);
    text("Time: " + remaining.toFixed(1) + "s", width / 2, 50);
    // Kill coun
    textAlign(LEFT, TOP);
    text("Kills: " + game2KillCount + " / 18", 20, 50);
    // Encouragement message
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
    // Level complete message
    if (game2KillCount >= 18) {
        textSize(32);
        fill(255, 255, 0);
        text("Level Clear!", width / 2 - 50, height / 2 - 30);
    }
    // Lives
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
        this.speed = speed; // Bullet speed upward
        this.size = size;
        this.toDelete = false; // Mark for removal
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

        this.speedY = random(4, 7);
        this.speedX = random(-4, 4);

        this.type = "redSplit";
        this.alive = true;

        // Color varies by generation
        if (generation === 0) this.color = "#673b43ff";
        else if (generation === 1) this.color = "#ff55b2ff";
        else this.color = "#ff99aa";
    }

    move() {
        this.y += this.speedY;
        this.x += this.speedX;
        // Bounce horizontally
        if (this.x < this.size / 2 || this.x > width - this.size / 2) {
            this.speedX *= -1;
        }

        if (this.y > height + 50) this.alive = false;
    }

    show() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }
}
function handleHit(enemy) {
    game2SplitEatCount++;// Count all kills (for level clear)
    if (!enemy.alive) return;

    // ===== RED SPLIT ENEMY =====
    if (enemy.type === "redSplit") {


        // Split into 2 smaller ones (max generation = 2)
        if (enemy.generation < 2) {
            let newGen = enemy.generation + 1;
            let newSize = enemy.size * 0.6;

            enemies.push(new RedSplitEnemy(enemy.x - 20, enemy.y, newSize, newGen));
            enemies.push(new RedSplitEnemy(enemy.x + 20, enemy.y, newSize, newGen));
        }

        // kill original enemy
        enemy.alive = false;
        game2Score += 10;
        game2KillCount++;

        return;
    }

    // ===== NORMAL & YELLOW ENEMY =====
    enemy.alive = false;
    enemy.absorbing = true;

    if (enemy.type === "yellow") {
        enemy.alive = false;
        game2BonusTimeMs += 3000; // Add time bonus
        return;
    }


    // ===== RED ENEMY =====
    if (enemy.type === "red") {
        enemy.alive = false;
        // Only damage player if not immune
        if (!planeImmune) {
            game2Lives--;
            planeImmune = true;
            planeImmuneTimer = millis();
            if (game2Lives <= 0) {
                game2Over = true;
                game2Stage = "end";
            }
        }
        return;
    }
}






// ===== GAME 3 VARS =====
let game3Lives = 6;          // Player lives
let plane3Size = 40;         // Plane size
let game3Score = 0;          // Current score
let game3StartTime = 0;      // Game start time (for timer)
let game3Target = 20;        // Score needed to win
let game3Time = 80;          // Time limit (seconds)
let game3Stage = "start";    // Game stage: start → play → win/lose
let game3BestScore = 0;      // Best score
let bgMeteors = [];          // Background meteors

let planeX3, planeY3;        // Plane position
let bullets3 = [];           // Bullets array
let enemies3 = [];           // Enemy array
let lastBulletTime3 = 0;     // Bullet cooldown

this.isRage = false;         // Boss rage mode
this.fireTimer = 0;          // Boss attack timer
let game3BackgroundImg;



function initGame3() {
    game3Stage = "start";       // Go to start page
    planeX3 = width / 2;        // Reset plane X
    planeY3 = height - 150;     // Reset plane Y
    bullets3 = [];              // Clear bullets
    enemies3 = [];              // Clear enemies
    game3Score = 0;             // Reset score
    game3Lives = 6;             // Reset lives
    setupBackgroundMeteors();   // Initialize background
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
        "• Pink enemies – touching them will cost 1 life.\n" +
        "• Blue enemies – touching them will cost 1 life.\n" +
        "• Red enemies – instant death.\n\n" +
        "You have 6 lives.\n" +
        "The final boss is very tough. Be patient and keep shooting!",
        width / 2,
        height / 2 - 40
    );
}
function drawPlane3() {

    imageMode(CENTER);
    image(flameImg, planeX3, planeY3 + 80, 80, 70);

    noStroke();
    fill(30, 60, 140);
    // Plane body
    ellipse(planeX3, planeY3, plane3Size * 1, plane3Size * 2.8);
    // Wings
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

    // ================================
    //        GAME 3 START SCREEN
    // ================================
    if (game3Stage === "start") {

        background(230);

        fill(0);
        textAlign(CENTER, CENTER);
        textSize(36);
        text("Boss Garden", width / 2, height / 2 - 140);

        textSize(22);
        text("Level Three", width / 2, height / 2 - 100);

        textSize(18);
        text("Move mouse to control your ship", width / 2, height / 2 - 40);
        text("Press SPACE to shoot", width / 2, height / 2 - 10);
        text("Defeat the Boss to win!", width / 2, height / 2 + 20);

        // ===== Start Button =====
        rectMode(CENTER);
        fill(200, 255, 200);
        rect(width / 2, height / 2 + 160, 220, 70, 20);

        fill(0);
        textSize(28);
        text("Start", width / 2, height / 2 + 160);

        // ===== Back to Menu =====
        fill(255, 190, 120);
        rect(width / 2, height / 2 + 250, 220, 70, 20);

        fill(0);
        textSize(24);
        text("Back to Menu", width / 2, height / 2 + 250);

        rectMode(CORNER);

        return;
    }

    // ===== PLAY =====
    if (game3Stage === "play") {

        drawGame3Background();// Draw gradient + meteors

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
                        // ====== Rage Mode Trigger ======
                        if (e.hp === 1 && !e.isRage) {
                            e.isRage = true;
                            e.speedX *= 1.8;
                            e.speedY *= 1.8;
                        }
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
        if (bgm3.isPlaying()) bgm3.stop();
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
        if (bgm3.isPlaying()) bgm3.stop();
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
        this.speed = 12;// Fast bullet
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
    // Vertical gradient (black → white)
    for (let y = 0; y < height; y++) {
        let c = map(y, 0, height, 0, 255);
        stroke(c);
        line(0, y, width, y);
    }
    // Background meteors
    for (let m of bgMeteors) {
        m.update();
        m.show();
    }
    noStroke();
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

        // Random crater holes
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

        this.y += this.speedY; // Fall


        this.x += this.speedX;  // Drift


        this.x += sin(frameCount * 0.01 + this.offset) * 0.5;// Wobble

        // Reset when off screen
        if (this.y > height + this.size) {
            this.y = -this.size;
            this.x = random(width);
        }

        // Keep slightly off screen margins
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

        this.speedY = random(4.0, 6.0);
        this.speedX = random(3.0, 5.0);

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
            // Pink sinus movement
            this.type = "blue";
            this.color = "#66ccff";
            this.jumpTimer = 0;

        } else {
            // Boss enemy
            this.type = "boss";
            this.color = "#aa88ff";
            this.size = 70;
            this.hp = 3;  // 3 hits to kill
            this.speedY = random(2.5, 3.8);
            this.speedX = random(4.0, 6.0) * (random() < 0.5 ? -1 : 1);
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

        // ===== Spin Enemy =====
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
            return;
        }

        // ===== Boss =====
        if (this.type === "boss") {
            // Movement
            this.y += this.speedY;
            this.x += this.speedX;

            if (this.x < 60 || this.x > width - 60) {
                this.speedX *= -1;
            }

            // ===== Rage Attack =====
            if (this.isRage) {
                this.fireTimer++;

                if (this.fireTimer > 45) {
                    spawnHomingBullet(this.x, this.y);
                    this.fireTimer = 0;
                }
            }

            // Draw boss
            fill(this.color);
            ellipse(this.x, this.y, this.size);
            return;
        }

        // ===== Other enemies =====
        fill(this.color);
        ellipse(this.x, this.y, this.size);
    }
}
function spawnEnemy3() {
    enemies3.push(new Enemy3());
}
