frog
    body
        x = 320
        y = 460
        size = 150
        color = green
    tongue
        x = same as frog body x
        y = 400
        size = 20
        speed = 20
        state = idle   // idle, outbound, inbound

fly
    x = 0
    y = random(0, 300)
    size = 10
    speed = 3
    color = black     // every third fly is yellow
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
        show title and frog
        if mouse pressed
            resetGame()
            startTime = current time
            gameState = "play"

    else if gameState == "play"
        draw background
        moveFly()
        drawFly()
        moveFrog()
        moveTongue()
        drawFrog()   // tongue is drawn here because we are in "play"
        checkTongueFlyOverlap()
        show score and time
        if time <= 0 or winCondition met
            gameState = "end"

    else if gameState == "end"
        show win/lose message
        show score and bestScore
        temporarily move frog to screen center
        rotate and draw frog without tongue
        restore frog position
        if mouse pressed
            gameState = "start"


resetFly()
    flyCount += 1
    fly.x = 0
    fly.y = random(0, 300)
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
    draw wings
    draw fly body in fly.color


moveFrog()
    frog.body.x = mouseX


moveTongue()
    tongue.x = frog.body.x
    if state == outbound
        tongue.y -= tongue.speed
        if tongue reaches top
            state = inbound
    else if state == inbound
        tongue.y += tongue.speed
        if tongue reaches bottom
            state = idle


drawFrog()
    if gameState == "play"
        draw tongue line and tip from mouth position
    draw frog body in frog.body.color
    draw blinking eyes


checkTongueFlyOverlap()
    if distance(tongue, fly) is small
        score += 1
        if fly is yellow
            extraTime += 3 seconds
            frog.body.color = yellow
        else
            frog.body.color = green
        resetFly()
        tongue.state = inbound


mousePressed()
    if gameState == "play" and tongue.state == idle
        tongue.state = outbound