
<title>Blishing Girl</title>
AUTHOR NAME:  xueyi

[View this project online] GitHub Pages Link : https://github.com/xiaxueyi00-eng/cart253/tree/main/air-jam

## Description
This project creates a humorous self-portrait using p5.js.
 It combines ideas discussed in class with experiments using recently learned functions.
 The face has a heart-shaped background and is made up of basic geometric shapes like triangles, quads, ellipses, and arcs.


 - Blush
Using `lerpColor()`, the blush color progressively shifts over time. By gradually increasing the variable t, the blush color smoothly transitions from skinColor to blushColor.

-	Blinking eyes
Using a conditional (`if`) and `frameCount`, the eyes blink every few seconds. The Week 3 group project give me this idea. I made the eyes blink naturally instead of moving the character.

-	Interactivity
The mouth ts width follows `mouseX`, and its height follows `mouseY`. This makes the portrait more playful and interactive.

-	Hair
 I had never used the `arc()` function for the hair before. `triangles（）` and semicircles are used to create the hair.  Triangles are used for hair on the sides, and semicircles are used for bangs.  By changing the angles, curved shapes were created that more naturally frame the face.

- Heart background
The heart is made of two circles and one triangle. I used` scale()` with `mouseWheel()` for the first time to make it dynamically resize.it automatically resizes with the mouse wheel.

— Nose
I used triangles made a cute nose.

- Shouder and Neck
I made  the neck using a `quad() `to join the head and body.  I used an `ellipse()` to be the shoulders.
## Screenshot(s)

This bit should have some images of the program running so that the reader has a sense of what it looks like. 

![Self-portrait screenshot](./assets/images/portrait.png)

## Attribution

This bit should attribute any code, assets or other elements used taken from other sources. For example:

> - This project uses [p5.js](https://p5js.org).
> - The Week 3 group assignment inspired the blinking eyes concept (using frameCount with conditionals).
> - Using `scale()` and `mouseWheel()`, dynamic resizing was added to the heart shape, which was inspired by basic geometric combinations (two circles and one triangle). 
> - Usine `lerpColor()` from [p5.js](https://p5js.org).




This bit should include the license you want to apply to your work. 

> This project is licensed under a Creative Commons Attribution ([CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.en)) license with the exception of libraries and other components with their own licenses.