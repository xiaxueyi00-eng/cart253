/*
 * The Blank Page
 * xueyi xia
 * 
 * An exploration of the existentia angst of a novelist 
 * who must sit down at their pink desk and confront the 
 * abyss that is a blank page of paper.
 * 
 * The program is non-interactive to convey the inability
 * to get started on the project. Try typing! 
*/

"use strict";

/** 
 * Creates a square canvas
 */
function setup() {
    createCanvas(640, 640);
}

/**
  * Displays the record
  */
function draw() {
    //Yellow background
    background(255, 204, 0);

    // The main part of the record
    push()
    fill(255, 182, 193);
    stroke(0);
    ellipse(320, 320, 480);
    pop();

    // The label on the record
    push();
    fill(0, 0, 255);
    noStroke();
    ellipse(320, 320, 140);
    pop();

    //The hole in the recors
    push()
    fill("000000");
    nostroke();
    ellipse(320, 320, 20)
    pop();
}







