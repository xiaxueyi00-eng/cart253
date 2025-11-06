# Pseudocode for Frog Time!

frog
    body
        x: 320
        y: 460
        size: 150
        color: green
    tongue
        x: same as frog body x
        y: 400
        size: 20
        speed: 20
        state: idle  // idle, outbound, inbound

fly
    x: 0
    y: random between 0 and 300
    size: 10
    speed: 3
    color: black  // every third fly becomes yellow
flyCount = 0

score = 0
bestScore = 0
baseGameDuration = 8 seconds
extraTime = 0
gameState = "start"

winCondition = score >= 8


setup()
    create canvas
    load eat sound
    resetFly()


draw()
    if gameState == "start"
        show start screen
        if mouse pressed on frog
            resetGame()
            startTime = current time
            gameState = "play"

    else if gameState == "play"
        draw background  // gradient sky + clouds + lily pads
        moveFly()       
        drawFly()
        moveFrog() // includes eye blink animation
        moveTongue()
        drawFrog()
        checkTongueFlyOverlap()

        elapsedTime = current time - startTime
        remainingTime = baseGameDuration + extraTime - elapsedTime
        display score and remainingTime

        if remainingTime <= 0 or score >= 8
            gameState = "end"

    else if gameState == "end"
        draw rotating frog at screen center
        if score > bestScore
            bestScore = score
        show win or lose text
        show score and bestScore
      if mouse pressed anywhere
    resetGame()
    startTime = current time
    gameState = "play"

resetFly()
    flyCount += 1
    fly.x = left side
    fly.y = random vertical
    fly.captured = false
    if flyCount % 3 == 0
        fly.color = yellow
    else
        fly.color = black

moveFly()
    if fly.captured == false
        fly moves in sine-wave path
        if fly exits screen
            resetFly()
    else
        fly moves toward frog mouth using lerp
        if fly reaches mouth
            fly.captured = false
            resetFly()

checkTongueFlyOverlap()
    if distance(tongue tip, fly) < threshold and fly.captured == false
        play eat sound
        score += 1
        if fly is yellow
            extraTime += 3 seconds
            frog.color = yellow
        else
            frog.color = green
        fly.captured = true
        tongue.state = inbound

mousePressed()
    if gameState == "play" and tongue.state == idle
        tongue.state = outbound