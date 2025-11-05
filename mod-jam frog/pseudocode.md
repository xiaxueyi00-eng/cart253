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
    create 640x480 canvas
    resetFly()

draw()
    if gameState == "start"
        draw start screen
        if mouse pressed
            resetGame()
            record startTime
            gameState = "play"

    else if gameState == "play"
        draw background
        moveFly()
        drawFly()
        moveFrog()
        moveTongue()
        drawFrog()
        checkTongueFlyOverlap()
        display score
        display remaining time
        if time <= 0
            gameState = "end"
        if score >= winCondition
            gameState = "end"

    else if gameState == "end"
        display win/lose message
        display score and bestScore
        display rotating frog
        if mouse pressed
            gameState = "start"


resetFly()
    flyCount += 1
    fly.x = 0
    fly.y = random between 0 and 300
    if flyCount % 3 == 0
        fly.color = yellow
    else
        fly.color = black

moveFly()
    fly.x += fly.speed
    fly.y = 200 + sin(frameCount * 0.1) * 80
    if fly.x > canvas width
        resetFly()

drawFly()
    draw wings (white)
    draw body (fly.color)

moveFrog()
    frog.body.x = mouseX

moveTongue()
    tongue.x = frog.body.x
    if state == idle
        do nothing
    else if state == outbound
        tongue.y -= tongue.speed
        if tongue reaches top
            state = inbound
    else if state == inbound
        tongue.y += tongue.speed
        if tongue reaches bottom
            state = idle

drawFrog()
    draw tongue tip
    draw tongue line
    draw frog body in frog.body.color
    draw blinking eyes

checkTongueFlyOverlap()
    if distance between tongue and fly < contact threshold
        score += 1
        if fly.color == yellow
            extraTime += 3 seconds
            frog.body.color = yellow
        else
            frog.body.color = green
        resetFly()
        tongue.state = inbound

mousePressed()
    if gameState == "play" and tongue.state == idle
        tongue.state = outbound