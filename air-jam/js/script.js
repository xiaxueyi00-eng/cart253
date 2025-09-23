/**
 * Self-Portrait
 * xueyi xia
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

"use strict";

let frameNumber = 0;

let cheeks = {
    // Position and size
    xLeft: 300,
    xRight: 600,
    y: 480,
    size: 120,

    // Initial color
    fill: {
        r: 255,
        g: 180,
        b: 180
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
    ellipse(width / 2, height / 2, 400, 600);


    // Change cheeks color gradually

    cheeks.fill.g -= 0.5;
    cheeks.fill.b -= 0.5;

    let g = constrain(cheeks.fill.g, 80, 180);
    let b = constrain(cheeks.fill.b, 80, 180);


    let offset = 10;
    if (frameCount % 40 === 0) {
        cheeks.xLeft += offset;
        cheeks.xRight -= offset;
    } else if (frameCount % 40 === 20) {
        cheeks.xLeft -= offset;
        cheeks.xRight += offset;
    }

    noStroke();
    fill(255, g, b);
    ellipse(cheeks.xLeft, cheeks.y, cheeks.size, cheeks.size / 1.5);
    ellipse(cheeks.xRight, cheeks.y, cheeks.size, cheeks.size / 1.5);
}

