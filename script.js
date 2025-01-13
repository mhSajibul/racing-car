$(document).ready(function () {
    
    const gameArea = $('#gameArea');
    const myCar = $('#myCar');
    const opponentCars = [$('#opponentCar1'), $('#opponentCar2'), $('#opponentCar3')];
    const dividers = [$('#divider_1'), $('#divider_2'), $('#divider_3')];
    const scoreBoard = $('#scoreBoard span');
    const restartButton = $('#restart button');

    let gameInterval;
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let speed = 5;
    let dividerSpeed =20;
    let isGameOver = false;

    // Initialize High Score
    scoreBoard.eq(1).text(highScore);

    // Start Game
    restartButton.click(() => {
        restartGame();
    });

    function restartGame() {
        score = 0;
        isGameOver = false;
        scoreBoard.eq(0).text(score);
        myCar.css('left', '55%');
        opponentCars.forEach((car, index) => {
            car.css({ top: `${-200 * (index + 1)}px`, left: `${15 + index * 30}%` });
        });
        startGameLoop();
    }

    function startGameLoop() {
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            moveOpponentCars();
            dividersRun();
            checkCollision();
            updateScore();
        }, 30);
    }

    function moveOpponentCars() {
        opponentCars.forEach((car) => {
            let carTop = parseInt(car.css('top'));
            if (carTop > gameArea.height()) {
                carTop = -150;
                car.css('left', `${Math.random() * (gameArea.width() - car.width())}px`);
            }
            car.css('top', `${carTop + speed}px`);
        });
    }

    function dividersRun(){
        dividers.forEach((lan) => {
            let lan_1 =parseInt(lan.css('top'));
            if (lan_1 > gameArea.height()){
                lan_1 = -150;
            }
            lan.css('top',`${lan_1+ dividerSpeed}`);
        });
    }


    function checkCollision() {
        const myCarPos = myCar[0].getBoundingClientRect();
        opponentCars.forEach((car) => {
            const opponentCarPos = car[0].getBoundingClientRect();
            if (
                myCarPos.left < opponentCarPos.right &&
                myCarPos.right > opponentCarPos.left &&
                myCarPos.top < opponentCarPos.bottom &&
                myCarPos.bottom > opponentCarPos.top
            ) {
                endGame();
            }
        });
    }

    function updateScore() {
        if (!isGameOver) {
            score++;
            scoreBoard.eq(0).text(score);
            if (score > highScore) {
                highScore = score;
                scoreBoard.eq(1).text(highScore);
                localStorage.setItem('highScore', highScore);
            }
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        isGameOver = true;
        alert('Game Over! Your Score: ' + score);
    }

    // Move myCar with arrow keys
    $(document).on('keydown', function (e) {
        if (isGameOver) return;

        const myCarPos = myCar.position();
        const step = 15;

        switch (e.key) {
            case 'ArrowLeft':
                if (myCarPos.left > 0) myCar.css('left', `${myCarPos.left - step}px`);
                break;
            case 'ArrowRight':
                if (myCarPos.left + myCar.width() < gameArea.width()) myCar.css('left', `${myCarPos.left + step}px`);
                break;
            case 'ArrowUp':
                if (myCarPos.top > 0) myCar.css('top', `${myCarPos.top - step}px`);
                break;
            case 'ArrowDown':
                if (myCarPos.top + myCar.height() < gameArea.height()) myCar.css('top', `${myCarPos.top + step}px`);
                break;
        }
    });
});
