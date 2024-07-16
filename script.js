document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.querySelector(".start-button");
    const gameArea = document.getElementById("game-area");
    const background = document.getElementById("background");
    const lineGrid = document.getElementById("line-grid");
    let gameRunning = false;
    let playerSize = 5;
    let player; // Variável para armazenar o jogador

    // Objeto para rastrear quais teclas estão pressionadas
    const keys = {
        'w': false,
        's': false,
        'a': false,
        'd': false
    };

    startButton.addEventListener('click', function () {
        const game = document.getElementById('game');
        game.style.display = 'none';
        gameArea.style.display = 'block';
        
        // Cria um novo elemento para representar o jogador (player)
        player = document.createElement('div');
        player.classList.add('player');
        
        // Posiciona o jogador no centro do gameArea
        player.style.left = `${gameArea.offsetWidth / 2 - player.offsetWidth / 2}px`;
        player.style.top = `${gameArea.offsetHeight / 2 - player.offsetHeight / 2}px`;
        gameArea.appendChild(player);
        
        // Adiciona eventos de controle com teclas WASD após iniciar o jogo
        window.addEventListener('keydown', keyDownHandler);
        window.addEventListener('keyup', keyUpHandler);
        
        // Inicia o loop do jogo
        requestAnimationFrame(updateGameArea);
        
        // Marca o jogo como iniciado
        gameRunning = true;
        spawnInitialFood();
        createGridLines();
    });

    function keyDownHandler(e) {
        if (gameRunning && keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault(); // Evita comportamentos padrão das teclas como rolagem da página
        }
    }

    function keyUpHandler(e) {
        if (gameRunning && keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault(); // Evita comportamentos padrão das teclas como rolagem da página
        }
    }

    function updateGameArea() {
        if (gameRunning) {
            // Atualiza a velocidade do gameArea com base nas teclas pressionadas
            let gameAreaVelocityX = 0;
            let gameAreaVelocityY = 0;
            const gameAreaSpeed = 2;
            const friction = 0.9; // Ajustei a fricção para reduzir a desaceleração
    
            if (keys['w']) gameAreaVelocityY = -gameAreaSpeed;
            if (keys['s']) gameAreaVelocityY = gameAreaSpeed;
            if (keys['a']) gameAreaVelocityX = -gameAreaSpeed;
            if (keys['d']) gameAreaVelocityX = gameAreaSpeed;
    
            // Aplica atrito para suavizar o movimento do gameArea
            gameAreaVelocityX *= friction;
            gameAreaVelocityY *= friction;
    
            // Atualiza a posição do gameArea com base na velocidade
            let newGameAreaX = gameArea.offsetLeft + gameAreaVelocityX;
            let newGameAreaY = gameArea.offsetTop + gameAreaVelocityY;
    
            // Limita o gameArea dentro dos limites do total-area
            const totalArea = document.getElementById('background');
            const maxGameAreaX = totalArea.clientWidth - gameArea.offsetWidth;
            const maxGameAreaY = totalArea.clientHeight - gameArea.offsetHeight;
    
            if (newGameAreaX < 0) {
                newGameAreaX = 0;
            } else if (newGameAreaX > maxGameAreaX) {
                newGameAreaX = maxGameAreaX;
            }
    
            if (newGameAreaY < 0) {
                newGameAreaY = 0;
            } else if (newGameAreaY > maxGameAreaY) {
                newGameAreaY = maxGameAreaY;
            }
    
            // Move o gameArea com base na nova posição calculada
            gameArea.style.left = `${newGameAreaX}px`;
            gameArea.style.top = `${newGameAreaY}px`;
    
            // Move o jogador dentro do gameArea
            let playerX = player.offsetLeft + gameAreaVelocityX;
            let playerY = player.offsetTop + gameAreaVelocityY;
    
            // Limita o jogador dentro dos limites do gameArea
            if (playerX < 0) {
                playerX = 0;
            } else if (playerX > gameArea.offsetWidth - player.offsetWidth) {
                playerX = gameArea.offsetWidth - player.offsetWidth;
            }
    
            if (playerY < 0) {
                playerY = 0;
            } else if (playerY > gameArea.offsetHeight - player.offsetHeight) {
                playerY = gameArea.offsetHeight - player.offsetHeight;
            }
    
            // Move o jogador para a nova posição calculada
            player.style.left = `${playerX}px`;
            player.style.top = `${playerY}px`;
    
            // Verifica colisão do jogador com a comida
            checkFoodCollision();
    
            // Solicita a próxima animação
            requestAnimationFrame(updateGameArea);
        }
    }
    
    

    // Função para verificar colisão com a comida
    function checkFoodCollision() {
        const food = document.querySelectorAll('.food');
        food.forEach(f => {
            if (isCollision(player, f)) {
                // Remove a comida
                f.remove();
                // Aumenta o tamanho do jogador
                playerSize += 0.02;
                player.style.width = `${playerSize}px`;
                player.style.height = `${playerSize}px`;
                // Gera nova comida
                spawnFood();
            }
        });
    }

    // Função para verificar colisão entre dois elementos
    function isCollision(obj1, obj2) {
        const rect1 = obj1.getBoundingClientRect();
        const rect2 = obj2.getBoundingClientRect();
        return !(rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom);
    }

    // Função para gerar comida em posições aleatórias dentro do game-area
    function spawnFood() {
        // Cria um novo elemento para representar a comida
        const newFood = document.createElement('div');
        newFood.classList.add('food');
        newFood.style.left = `${Math.floor(Math.random() * (gameArea.offsetWidth - 10))}px`;
        newFood.style.top = `${Math.floor(Math.random() * (gameArea.offsetHeight - 10))}px`;
        gameArea.appendChild(newFood);
    }

    // Função para gerar várias comidas iniciais no mapa
    function spawnInitialFood() {
        for (let i = 0; i < 300; i++) {
            spawnFood();
        }
    }

    // Função para criar a grade do jogo
    function createGridLines() {
        for (let i = 0; i < gameArea.offsetWidth; i += 10) {
            const verticalLine = document.createElement('div');
            verticalLine.classList.add('line', 'vertical-line');
            verticalLine.style.left = `${i}px`;
            lineGrid.appendChild(verticalLine);
        }

        for (let i = 0; i < gameArea.offsetHeight; i += 10) {
            const horizontalLine = document.createElement('div');
            horizontalLine.classList.add('line', 'horizontal-line');
            horizontalLine.style.top = `${i}px`;
            lineGrid.appendChild(horizontalLine);
        }
    }
});
