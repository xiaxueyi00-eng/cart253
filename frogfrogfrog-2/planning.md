# Planning

## Starting point

The initial idea:

> Frog eating flies

> I decide give the game added the 10 seconder timer machine , make game have more sense of urgency.

## Experience design

The experience:

> THe player control the frog at the end of the screen , use mouse can shoot out the frog's tongue and catch a fly which is moving on the screen. If the tongue hits the fly it gets eaten.

W ## Player Experience Goals 
> I try to make this game feel relaxed and funny, but at play  can feel a little nervous. When the player plays this game at first will feel easy , but as time goes on player will feeling time is not enough. This is a minor pressure and easy to play game.

## Game Pacing & Design Rationale 
> A countdown can bring nervousness, and a yellow fly can bring reward and hope. The target is to eat 8 flies, encouraging the player to try many times to play this game. 


## I added a score and timer to create a goal:

> The player must eat 8 flies before time runs out.

> Every third fly is yellow and adds +3 seconds when eaten.

## Breaking it down

Basic things to do:

- Draw the frog (circle body + blinking eyes).

- Draw the tongue (red line + round tip).

- Move the frog left and right with the mouse.

- Move the fly across the screen.

- Make the fly flap its wings and move up and down while flying.

- Detect when the tongue overlaps the fly

- Add score and countdown timer

- Check win or lose conditions

- Display the current score and best score on the end screen

- Show a rotating frog on the end screen for visual feedback



Questions:

- What does the frog look like?

- A green circle with blinking eyes. The frog turns yellow briefly if it eats a yellow fly.

- On the end screen, the frog reappears and rotates as a playful ending animation.

- How does the user control the frog?

- The frog follows the mouse’s x-position at the bottom of the screen.

- The player clicks the mouse, and the tongue will come out.

- How does the fly move?

- The fly starts on the left at a random y-position and moves to the right.

- The fly also moves up and down and randomly from left to right.

- Every third fly is yellow instead of black.

- Does the fly have wings?

- Yes! It has two white wings!

- What does the tongue look like?

- A red line to extend and recover.

- What does it all look like on the screen? Layout?

- The frog stays at the bottom.

- Flies move across the upper space, floating slightly up and down.

- The tongue shoots upward when the player clicks.

- What happens when the frog eats a fly?

- Score increases by 1.

- If the fly is yellow, +3 seconds are added to the timer and the frog turns yellow briefly.

- A new fly is spawned.

- How does the player win or lose?

- Win: Eat 8 flies before the timer reaches 0.

- Lose: Time runs out before reaching 8 flies.

## The program starts to form....

frog

body

x

y

size

color // changes to yellow briefly when eating yellow fly

tongue

x

y

size

speed

state // idle, outbound, inbound

rotateFrog // used in the end screen

angle // rotation angle changes every frame

scale // slightly smaller frog for final animation


fly

x

y

size

speed

color // black or yellow

wings // wing shapes

vertical motion // up and down wave movement


What happens in this project?

- Start (setup)

- Create a canvas

- Spawn the first fly

- Every frame (draw)

- Draw the background (sky + water + lily pads)

- Move and draw the fly

- Add the fly's speed to its x

- Make the fly move slightly up and down (sine wave motion).

- Draw the fly body (black or yellow).

- Draw two small white wings that flap

- Move and draw the frog

- Move the frog to the mouse's x position.

- Draw a green (or yellow if a yellow fly was just eaten) frog body.

- Draw blinking eyes

- Move and draw the tongue

- Move the tongue

- If the tongue isn't launched, do nothing.

- If launched, move it up until it reaches the top

- Then return the tongue downward

- If it reaches the bottom, set it back to idle.

- Draw a red tongue line and a tongue tip circle

- Check if the tongue hit the fly

- If collision:

- Increase score by 1

- If the fly was yellow, add +3 seconds to the timer.

- Reset the fly to the left

- If not, nothing happens.




- End condition

- If score reaches 8 → Win

- If the timer reaches 0 → Game Over

- On the end screen, redraw the frog and rotate it continuously for a visual animation effect.




Events

- If the user clicks the mouse

- If the tongue is still inside the frog's mouth (state is idle)

- Launch the tongue (state becomes outbound)