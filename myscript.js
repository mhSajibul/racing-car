$(document).ready(function () {
    var animationId;
    var score = $('#score');
    var highScore = $('#highestScore');
    var scoreCounter = 0;

    var gameArea = $('#gameArea');
    var myCar = $('#myCar');
    var opponentCars = [$('#opponentCar1'), $('#opponentCar2'), $('#opponentCar3')];

    var dividerLines = $('.divider');
    var restartButton = $('#restart button');

    var speed = 2;
    var dividerSpeed = 10;

    var isGameOver = false;

    var moveLeft = false;
    var moveRight = false;
    var moveUp = false;
    var moveDown = false;

    function moveCarLeft() {
        if (isGameOver === false && parseInt(myCar.css('left')) > 0) {
            myCar.css('left', parseInt(myCar.css('left')) - 5);
            moveLeft = requestAnimationFrame(moveCarLeft);
        }
    }

    function moveCarRight() {
        if (isGameOver === false && parseInt(myCar.css('left')) < gameArea.width() - myCar.width()) {
            myCar.css('left', parseInt(myCar.css('left')) + 5);
            moveRight = requestAnimationFrame(moveCarRight);
        }
    }

    function moveCarUp() {
        if (isGameOver === false && parseInt(myCar.css('top')) > 0) {
            myCar.css('top', parseInt(myCar.css('top')) - 5);
            moveUp = requestAnimationFrame(moveCarUp);
        }
    }

    function moveCarDown() {
        if (isGameOver === false && parseInt(myCar.css('top')) < gameArea.height() - myCar.height()) {
            myCar.css('top', parseInt(myCar.css('top')) + 5);
            moveDown = requestAnimationFrame(moveCarDown);
        }
    }

    $(document).on('keydown', function (e) {
        if (isGameOver) return;
        var key = e.keyCode;
        if (key === 37 && !moveLeft) moveLeft = requestAnimationFrame(moveCarLeft);
        if (key === 39 && !moveRight) moveRight = requestAnimationFrame(moveCarRight);
        if (key === 38 && !moveUp) moveUp = requestAnimationFrame(moveCarUp);
        if (key === 40 && !moveDown) moveDown = requestAnimationFrame(moveCarDown);
    });

    $(document).on('keyup', function (e) {
        var key = e.keyCode;
        if (key === 37) {
            cancelAnimationFrame(moveLeft);
            moveLeft = false;
        }
        if (key === 39) {
            cancelAnimationFrame(moveRight);
            moveRight = false;
        }
        if (key === 38) {
            cancelAnimationFrame(moveUp);
            moveUp = false;
        }
        if (key === 40) {
            cancelAnimationFrame(moveDown);
            moveDown = false;
        }
    });

    function moveOpponentCars() {
        opponentCars.forEach(function (car) {
            var currentTop = parseInt(car.css('top'));
            if (currentTop > gameArea.height()) {
                car.css('top', -200);
                car.css('left', Math.random() * (gameArea.width() - car.width()));
            } else {
                car.css('top', currentTop + speed);
            }
        });
    }

    function moveDividers() {
        dividerLines.each(function () {
            var line = $(this);
            var currentTop = parseInt(line.css('top'));
            if (currentTop > gameArea.height()) {
                line.css('top', -150);
            } else {
                line.css('top', currentTop + dividerSpeed);
            }
        });
    }

    function checkCollision($div1, $div2) {
        var rect1 = $div1[0].getBoundingClientRect();
        var rect2 = $div2[0].getBoundingClientRect();

        return !(
            rect1.top > rect2.bottom ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right ||
            rect1.right < rect2.left
        );
    }

    function gameLoop() {
        if (isGameOver) return;

        if (
            opponentCars.some(function (car) {
                return checkCollision(myCar, car);
            })
        ) {
            stopGame();
            return;
        }

        scoreCounter++;
        if (scoreCounter % 20 === 0) score.text(parseInt(score.text()) + 1);
        if (scoreCounter % 500 === 0) {
            speed++;
            dividerSpeed++;
        }

        moveOpponentCars();
        moveDividers();

        animationId = requestAnimationFrame(gameLoop);
    }

    function stopGame() {
        isGameOver = true;
        cancelAnimationFrame(animationId);
        cancelAnimationFrame(moveLeft);
        cancelAnimationFrame(moveRight);
        cancelAnimationFrame(moveUp);
        cancelAnimationFrame(moveDown);
        restartButton.focus();
    }

    restartButton.click(function () {
        location.reload();
    });

    animationId = requestAnimationFrame(gameLoop);
});
