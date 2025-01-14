$(document).ready(function () {
    var animationId;
    var score = $('#score');
    var highestScore = $('#highestScore');
    var scoreCounter = 1;

    var gameArea = $('#gameArea');
    var myCar = $('#myCar');
    var opponentCar1 = $('#opponentCar1');
    var opponentCar2 = $('#opponentCar2');
    var opponentCar3 = $('#opponentCar3');

    var line1 = $('#divider_1');
    var line2 = $('#divider_2');
    var line3 = $('#divider_3');

    var restartButton = $('#restart');
    var controlButtons = $('#controls button');

    var speed = 2;
    var dividerSpeed = 10;

    var isGameOver = false;

    var moveLeft = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;

    // Set up high score from localStorage
    var highScore = localStorage.getItem('highScore') || 0;
    highestScore.text(highScore);

    // Handle keyboard controls
    $(document).on('keydown', function (e) {
        if (!isGameOver) {
            var key = e.keyCode;
            if (key === 37) moveLeft = true; // Left arrow
            else if (key === 39) moveRight = true; // Right arrow
            else if (key === 38) moveUp = true; // Up arrow
            else if (key === 40) moveDown = true; // Down arrow
        }
    });

    $(document).on('keyup', function (e) {
        if (!isGameOver) {
            var key = e.keyCode;
            if (key === 37) moveLeft = false; // Left arrow
            else if (key === 39) moveRight = false; // Right arrow
            else if (key === 38) moveUp = false; // Up arrow
            else if (key === 40) moveDown = false; // Down arrow
        }
    });

    // Car movement functions
    function left() {
        var currentLeft = parseInt(myCar.css('left'));
        if (currentLeft > 0) {
            myCar.css('left', currentLeft - 5);
        }
    }

    function right() {
        var currentLeft = parseInt(myCar.css('left'));
        var gameAreaWidth = gameArea.width();
        var carWidth = myCar.width();
        if (currentLeft < gameAreaWidth - carWidth) {
            myCar.css('left', currentLeft + 5);
        }
    }

    function up() {
        var currentBottom = parseInt(myCar.css('bottom'));
        if (currentBottom < gameArea.height()) {
            myCar.css('bottom', currentBottom + 5);
        }
    }

    function down() {
        var currentBottom = parseInt(myCar.css('bottom'));
        if (currentBottom > 0) {
            myCar.css('bottom', currentBottom - 5);
        }
    }

    // Update movement in the game loop
    function repeat() {
        if (!isGameOver) {
            if (checkCollision(myCar, opponentCar1) || checkCollision(myCar, opponentCar2) || checkCollision(myCar, opponentCar3)) {
                stopGame();
                return;
            }

            scoreCounter++;
            if (scoreCounter % 10 === 0) {
                score.text(parseInt(score.text()) + 3);
            }
            if (scoreCounter % 500 === 0) {
                speed += 1;
                dividerSpeed += 1;
            }

            if (scoreCounter % 900 === 0) {
                speed += 1.5;
                dividerSpeed += 2;
            }

            // Move opponent cars and dividers
            carDown(opponentCar1);
            carDown(opponentCar2);
            carDown(opponentCar3);

            lineDown(line1);
            lineDown(line2);
            lineDown(line3);

            // Move the player's car based on input
            if (moveLeft) left();
            if (moveRight) right();
            if (moveUp) up();
            if (moveDown) down();

            animationId = requestAnimationFrame(repeat);
        }
    }

    // Start the game loop
    animationId = requestAnimationFrame(repeat);

    // Function to move opponent cars downwards
    function carDown(car) {
        var currentTop = parseInt(car.css('top'));
        if (currentTop > gameArea.height()) {
            currentTop = -200;
            var carLeft = Math.random() * (gameArea.width() - car.width());
            car.css('left', carLeft);
        }
        car.css('top', currentTop + speed);
    }

    // Function to move dividers downwards
    function lineDown(line) {
        var lineCurrentTop = parseInt(line.css('top'));
        if (lineCurrentTop > gameArea.height()) {
            lineCurrentTop = -300;
        }
        line.css('top', lineCurrentTop + dividerSpeed);
    }

    // Function to stop the game
    function stopGame() {
        isGameOver = true;
        cancelAnimationFrame(animationId);

        // Update and save high score
        var finalScore = parseInt(score.text());
        if (finalScore > highScore) {
            highScore = finalScore;
            localStorage.setItem('highScore', highScore);
            highestScore.text(highScore);
        }
    }

    // Restart the game
    restartButton.click(function () {
        location.reload();
    });

    // Collision detection function
    function checkCollision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;

        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);

        var b1 = y1 + h1;
        var r1 = x1 + w1;

        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);

        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }
});