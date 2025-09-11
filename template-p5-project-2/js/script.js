/**
 * Title of Project
 * Author Name
 * 
 * HOW EMBARRASSING! I HAVE NO DESCRIPTION OF MY PROJECT!
 * PLEASE REMOVE A GRADE FROM MY WORK IF IT'S GRADED!
 */

/**
 * 
 */

function setup() {
    createCanvas(640, 480);
}


/**
 * OOPS I DIDN'T DESCRIBE WHAT MY DRAW DOES!
*/
function draw() {
    drawSky();
    drawSun();
    drawGround();
    drawFlysheet();
    drawFlysheetDoor();
    drawHumanHead();
    drawHumanBody();
    drawHumanArms();
    drawHumanLegs();
}


/**
 * Draws the sky    
 */
function drawSky() {
    background(150, 200, 250);

}

/**
 * Draws the sun
 */
function drawSun() {
    push();
    noStroke();
    fill(255, 255, 0);
    circle(80, 80, 130);
    pop();
}
/**
 * Draws the ground
 */
function drawGround() {
    push();
    noStroke();
    fill(34, 139, 34);
    rect(0, 400, 640, 80);
    pop();
}
/**
 * Draws the flysheet
 */
function drawFlysheet() {
    push();
    fill(255, 180, 0);
    noStroke();
    triangle(200, 400, 300, 150, 400, 400);
    pop();
}

function drawFlysheetDoor() {
    push();
    fill(255, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(300, 370, 50, 60);
    pop();

}

function drawHumanHead() {
    push();
    fill(255, 220, 177);
    circle(320, 180, 80);
    pop();
}

function drawHumanBody() {
    push();
    fill(0, 0, 255);
    rectMode(CENTER);
    rect(320, 280, 80, 120);
    pop();
}

function drawHumanArms() {
    push();
    stroke(255, 220, 177);
    strokeWeight(20);
    line(280, 260, 240, 300);
    line(360, 260, 400, 300);
    pop();
}

function drawHumanLegs() {
    push();
    stroke(0, 0, 255);
    strokeWeight(20);
    line(300, 320, 300, 400);
    line(340, 320, 340, 400);
    pop();
}   