// ============================================================
// GAME SYSTEM
// js/game.js
// ============================================================

let gameState = "loading";

let gameRunning = false;
let gamePaused = false;
let gameOver = false;
let gameVictory = false;
let bossFightStarted = false;

let gameTime = 0;
let deltaTime = 0;
let lastFrameTime = 0;

let waveNumber = 1;
let waveActive = false;
let waveTransitionTimer = 0;
let waveTransitionDuration = 1.5;

let levelStarted = false;
let levelComplete = false;

let currentLevelData = null;

let totalEnemiesKilled = 0;
let totalCoinsEarned = 0;
let totalScoreEarned = 0;

const GAME_CONFIG = {
    maxDelta: 0.05,

    waveStartDelay: 1.2,
    waveCompleteDelay: 1.3,

    bossStartDelay: 1.5,

    levelCompleteDelay: 2.5,

    cameraFollowSpeed: 5,

    worldLength: 180,

    autoStartFirstWave: true,

    enemyWaveClearBuffer: 0.5
};

// ------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------

function initializeGame() {

    gameState = "loading";

    gameRunning = false;
    gamePaused = false;
    gameOver = false;
    gameVictory = false;
    bossFightStarted = false;

    gameTime = 0;
    deltaTime = 0;
    lastFrameTime = performance.now();

    waveNumber = 1;
    waveActive = false;

    levelStarted = false;
    levelComplete = false;

    totalEnemiesKilled = 0;
    totalCoinsEarned = 0;
    totalScoreEarned = 0;

    currentLevelData =
        typeof getLevelData === "function"
            ? getLevelData(getCurrentLevel())
            : null;

    if (typeof initializeUpgradeSystem === "function") {
        initializeUpgradeSystem();
    }

    if (typeof resetRunUpgrades === "function") {
        resetRunUpgrades();
    }

    if (typeof resetPlayer === "function") {
        resetPlayer();
    }

    if (typeof resetGun === "function") {
        resetGun();
    }

    if (typeof clearEnemies === "function") {
        clearEnemies();
    }

    if (typeof clearGates === "function") {
        clearGates();
    }

    if (typeof clearBullets === "function") {
        clearBullets();
    }

    if (typeof clearEffects === "function") {
        clearEffects();
    }

    if (typeof resetBoss === "function") {
        resetBoss();
    }

    if (typeof initializeUI === "function") {
        initializeUI();
    }

    if (typeof hideLoadingScreen === "function") {
        hideLoadingScreen();
    }

    setGameUIState("start");

    gameState = "start";
}

// ------------------------------------------------------------
// START GAME
// ------------------------------------------------------------

function startGame() {

    if (gameRunning) {
        return;
    }

    gameOver = false;
    gameVictory = false;
    gamePaused = false;
    levelComplete = false;

    gameState = "playing";

    gameRunning = true;

    gameTime = 0;
    waveNumber = 1;
    waveActive = false;

    levelStarted = true;

    currentLevelData =
        typeof getLevelData === "function"
            ? getLevelData(getCurrentLevel())
            : null;

    if (typeof resetRunUpgrades === "function") {
        resetRunUpgrades();
    }

    if (typeof resetPlayer === "function") {
        resetPlayer();
    }

    if (typeof resetGun === "function") {
        resetGun();
    }

    if (typeof clearEnemies === "function") {
        clearEnemies();
    }

    if (typeof clearGates === "function") {
        clearGates();
    }

    if (typeof clearBullets === "function") {
        clearBullets();
    }

    if (typeof clearEffects === "function") {
        clearEffects();
    }

    if (typeof resetBoss === "function") {
        resetBoss();
    }

    if (typeof hideAllScreens === "function") {
        hideAllScreens();
    }

    if (typeof hideBossHUD === "function") {
        hideBossHUD();
    }

    if (typeof updateFullUI === "function") {
        updateFullUI();
    }

    showMessage(
        "LEVEL " + getCurrentLevel(),
        1200,
        "normal"
    );

    waveTransitionTimer = GAME_CONFIG.waveStartDelay;

    if (typeof setGameUIState === "function") {
        setGameUIState("playing");
    }
}

// ------------------------------------------------------------
// RESTART
// ------------------------------------------------------------

function restartGame() {

    gameRunning = false;

    if (typeof clearEnemies === "function") {
        clearEnemies();
    }

    if (typeof clearGates === "function") {
        clearGates();
    }

    if (typeof clearBullets === "function") {
        clearBullets();
    }

    if (typeof clearEffects === "function") {
        clearEffects();
    }

    if (typeof resetBoss === "function") {
        resetBoss();
    }

    startGame();
}

// ------------------------------------------------------------
// PAUSE / RESUME
// ------------------------------------------------------------

function pauseGame() {

    if (!gameRunning || gameOver || gameVictory) {
        return;
    }

    if (gamePaused) {
        return;
    }

    gamePaused = true;
    gameState = "paused";

    if (typeof setGameUIState === "function") {
        setGameUIState("paused");
    }
}

function resumeGame() {

    if (!gamePaused) {
        return;
    }

    gamePaused = false;
    gameState = "playing";

    lastFrameTime = performance.now();

    if (typeof setGameUIState === "function") {
        setGameUIState("playing");
    }
}

function togglePause() {

    if (gamePaused) {
        resumeGame();
    } else {
        pauseGame();
    }
}

// ------------------------------------------------------------
// MAIN GAME UPDATE
// ------------------------------------------------------------

function updateGame(time) {

    if (!gameRunning || gamePaused) {
        return;
    }

    if (!Number.isFinite(time)) {
        time = performance.now();
    }

    deltaTime = (time - lastFrameTime) / 1000;

    if (!Number.isFinite(deltaTime) || deltaTime < 0) {
        deltaTime = 0;
    }

    deltaTime = Math.min(
        deltaTime,
        GAME_CONFIG.maxDelta
    );

    lastFrameTime = time;

    gameTime += deltaTime;

    // --------------------------------------------------------
    // GAME OVER / VICTORY
    // --------------------------------------------------------

    if (gameOver || gameVictory) {
        return;
    }

    // --------------------------------------------------------
    // BOSS FIGHT
    // --------------------------------------------------------

    if (bossFightStarted) {

        updateBossGame(deltaTime);

        updateCommonSystems(deltaTime);

        return;
    }

    // --------------------------------------------------------
    // PLAYER RUN
    // --------------------------------------------------------

    updatePlayerGame(deltaTime);

    updateEnemyGame(deltaTime);

    updateGateGame(deltaTime);

    updateBulletGame(deltaTime);

    updateCommonSystems(deltaTime);

    updateWaveLogic(deltaTime);
}

// ------------------------------------------------------------
// PLAYER GAME UPDATE
// ------------------------------------------------------------

function updatePlayerGame(delta) {

    if (!player || !isPlayerAlive()) {
        return;
    }

    if (typeof updatePlayer === "function") {
        updatePlayer(delta);
    }

    if (typeof updatePlayerShooting === "function") {
        updatePlayerShooting(delta);
    }

    if (typeof updateGun === "function") {
        updateGun(delta);
    }
}

// ------------------------------------------------------------
// ENEMY GAME UPDATE
// ------------------------------------------------------------

function updateEnemyGame(delta) {

    if (typeof updateEnemies !== "function") {
        return;
    }

    updateEnemies(delta);
}

// ------------------------------------------------------------
// GATE GAME UPDATE
// ------------------------------------------------------------

function updateGateGame(delta) {

    if (typeof updateGates !== "function") {
        return;
    }

    updateGates(delta);
}

// ------------------------------------------------------------
// BULLET GAME UPDATE
// ------------------------------------------------------------

function updateBulletGame(delta) {

    if (typeof updateBullets !== "function") {
        return;
    }

    updateBullets(delta);
}

// ------------------------------------------------------------
// COMMON SYSTEMS
// ------------------------------------------------------------

function updateCommonSystems(delta) {

    if (typeof updateEffects === "function") {
        updateEffects(delta);
    }

    if (typeof updateScreenShake === "function") {
        updateScreenShake(delta);
    }

    if (typeof updateUpgradeSystem === "function") {
        updateUpgradeSystem(delta);
    }

    if (typeof updateUIFrame === "function") {
        updateUIFrame();
    }
}

// ------------------------------------------------------------
// WAVE SYSTEM
// ------------------------------------------------------------

function startNextWave() {

    if (!gameRunning ||
        gamePaused ||
        bossFightStarted ||
        levelComplete) {
        return;
    }

    if (!currentLevelData) {
        currentLevelData =
            typeof getLevelData === "function"
                ? getLevelData(getCurrentLevel())
                : null;
    }

    const totalWaves =
        currentLevelData?.waves ||
        currentLevelData?.waveCount ||
        5;

    if (waveNumber > totalWaves) {
        startBossPhase();
        return;
    }

    waveActive = true;

    if (player) {
        player.wave = waveNumber;
    }

    if (typeof spawnEnemyWave === "function") {

        const wave =
            generateGameWave(waveNumber);

        spawnEnemyWave(wave);
    }

    if (typeof generateGates === "function") {
        generateGates(waveNumber);
    }

    if (typeof showWaveMessage === "function") {
        showWaveMessage(waveNumber);
    }
}

function generateGameWave(wave) {

    const level =
        getCurrentLevel();

    const levelData =
        currentLevelData ||
        getLevelData(level);

    if (typeof generateWaveComposition === "function") {

        const composition =
            generateWaveComposition(
                wave,
                levelData
            );

        return composition;
    }

    return {
        enemies: [],
        total: 0
    };
}

function updateWaveLogic(delta) {

    if (bossFightStarted || levelComplete) {
        return;
    }

    if (!waveActive) {

        waveTransitionTimer -= delta;

        if (waveTransitionTimer <= 0) {
            startNextWave();
        }

        return;
    }

    const enemiesRemaining =
        typeof getAliveEnemyCount === "function"
            ? getAliveEnemyCount()
            : 0;

    const spawning =
        typeof isWaveComplete === "function"
            ? !isWaveComplete()
            : enemiesRemaining > 0;

    if (!spawning && enemiesRemaining <= 0) {

        completeCurrentWave();
    }
}

function completeCurrentWave() {

    if (!waveActive) {
        return;
    }

    waveActive = false;

    if (player) {
        player.wave = waveNumber;
    }

    if (typeof offerWaveUpgrade === "function") {
        offerWaveUpgrade();
    }

    const totalWaves =
        currentLevelData?.waves ||
        currentLevelData?.waveCount ||
        5;

    if (waveNumber >= totalWaves) {

        waveTransitionTimer =
            GAME_CONFIG.bossStartDelay;

        setTimeout(function () {

            if (gameRunning &&
                !gamePaused &&
                !gameOver &&
                !bossFightStarted) {

                startBossPhase();
            }

        }, GAME_CONFIG.waveCompleteDelay * 1000);

        return;
    }

    waveNumber++;

    if (player) {
        player.wave = waveNumber;
    }

    waveTransitionTimer =
        GAME_CONFIG.waveCompleteDelay;
}

// ------------------------------------------------------------
// BOSS PHASE
// ------------------------------------------------------------

function startBossPhase() {

    if (bossFightStarted ||
        gameOver ||
        gameVictory) {
        return;
    }

    bossFightStarted = true;
    waveActive = false;

    if (typeof clearEnemies === "function") {
        clearEnemies();
    }

    if (typeof clearGates === "function") {
        clearGates();
    }

    if (typeof clearBullets === "function") {
        clearBullets();
    }

    if (typeof hideGatePreview === "function") {
        hideGatePreview();
    }

    const level =
        getCurrentLevel();

    const bossId =
        typeof getLevelBoss === "function"
            ? getLevelBoss(level)
            : "SCRAP_TITAN";

    if (typeof startBossFight === "function") {
        startBossFight(bossId);
    }

    if (typeof showBossHUD === "function") {
        showBossHUD(boss);
    }

    if (typeof showBossMessage === "function") {

        const name =
            boss?.name ||
            boss?.id ||
            bossId;

        showBossMessage(name);
    }

    gameState = "boss";
}

function updateBossGame(delta) {

    if (!bossFightStarted) {
        return;
    }

    if (typeof updateBoss === "function") {
        updateBoss(delta);
    }

    if (typeof updateBullets === "function") {
        updateBullets(delta);
    }

    if (typeof updatePlayer === "function") {
        updatePlayer(delta);
    }

    if (typeof updatePlayerShooting === "function") {
        updatePlayerShooting(delta);
    }

    if (typeof updateGun === "function") {
        updateGun(delta);
    }

    if (bossDefeated) {
        return;
    }

    if (typeof isBossDefeated === "function" &&
        isBossDefeated()) {

        finishBossPhase();
    }
}

function finishBossPhase() {

    if (gameVictory ||
        gameOver ||
        levelComplete) {
        return;
    }

    levelComplete = true;
    bossFightStarted = false;

    gameState = "victory";

    if (typeof hideBossHUD === "function") {
        hideBossHUD();
    }

    if (typeof clearBossProjectiles === "function") {
        clearBossProjectiles();
    }

    if (typeof getBossReward === "function" && boss) {

        const reward =
            getBossReward(boss);

        if (reward) {

            if (reward.coins &&
                typeof addPlayerCoins === "function") {

                addPlayerCoins(reward.coins);
                totalCoinsEarned += reward.coins;
            }

            if (reward.score &&
                typeof addPlayerScore === "function") {

                addPlayerScore(reward.score);
                totalScoreEarned += reward.score;
            }
        }
    }

    if (typeof showVictoryMessage === "function") {
        showVictoryMessage();
    }

    setTimeout(function () {

        if (gameOver) {
            return;
        }

        completeLevel();

    }, GAME_CONFIG.levelCompleteDelay * 1000);
}

// ------------------------------------------------------------
// LEVEL COMPLETION
// ------------------------------------------------------------

function completeLevel() {

    if (gameVictory) {
        return;
    }

    gameVictory = true;
    gameRunning = false;
    gameState = "victory";

    levelComplete = true;

    if (typeof updateVictoryStats === "function") {
        updateVictoryStats();
    }

    if (typeof showVictoryScreen === "function") {
        showVictoryScreen();
    }
}

function nextLevel() {

    if (!gameVictory) {
        return;
    }

    if (typeof advanceLevel === "function") {
        advanceLevel();
    }

    gameVictory = false;
    gameOver = false;
    levelComplete = false;

    bossFightStarted = false;

    gameState = "start";

    currentLevelData =
        typeof getLevelData === "function"
            ? getLevelData(getCurrentLevel())
            : null;

    if (typeof hideAllScreens === "function") {
        hideAllScreens();
    }

    if (typeof startGame === "function") {
        startGame();
    }
}

// ------------------------------------------------------------
// PLAYER DEATH
// ------------------------------------------------------------

function onPlayerDeath() {

    if (gameOver ||
        gameVictory) {
        return;
    }

    gameOver = true;
    gameRunning = false;
    gamePaused = false;

    gameState = "gameover";

    bossFightStarted = false;
    waveActive = false;

    if (typeof clearBossProjectiles === "function") {
        clearBossProjectiles();
    }

    if (typeof hideBossHUD === "function") {
        hideBossHUD();
    }

    if (typeof showGameOverScreen === "function") {
        showGameOverScreen();
    }
}

// ------------------------------------------------------------
// BOSS DEFEATED CALLBACK
// ------------------------------------------------------------

function onBossDefeated(defeatedBoss) {

    if (gameVictory ||
        gameOver ||
        levelComplete) {
        return;
    }

    bossDefeated = true;

    if (defeatedBoss) {
        boss = defeatedBoss;
    }

    finishBossPhase();
}

// ------------------------------------------------------------
// ENEMY CALLBACKS
// ------------------------------------------------------------

function onEnemyKilled(enemy) {

    totalEnemiesKilled++;

    if (!enemy) {
        return;
    }

    if (enemy.reward) {

        if (enemy.reward.coins) {
            totalCoinsEarned += enemy.reward.coins;
        }

        if (enemy.reward.score) {
            totalScoreEarned += enemy.reward.score;
        }
    }
}

// ------------------------------------------------------------
// UPGRADE CALLBACKS
// ------------------------------------------------------------

function onUpgradeSelected(upgrade) {

    if (!upgrade) {
        return;
    }

    if (typeof notifyUpgrade === "function") {
        notifyUpgrade(upgrade);
    }

    if (typeof updateFullUI === "function") {
        updateFullUI();
    }
}

// ------------------------------------------------------------
// GAME LOOP
// ------------------------------------------------------------

function gameLoop(time) {

    updateGame(time);

    if (typeof updateMainCamera === "function") {
        updateMainCamera(deltaTime || 0.016);
    }

    if (typeof renderScene === "function") {
        renderScene();
    } else if (
        typeof renderer !== "undefined" &&
        renderer &&
        typeof scene !== "undefined" &&
        scene &&
        typeof camera !== "undefined" &&
        camera
    ) {
        renderer.render(scene, camera);
    }

    requestAnimationFrame(gameLoop);
}

// ------------------------------------------------------------
// GAME STATE ACCESS
// ------------------------------------------------------------

function isGameRunning() {
    return gameRunning;
}

function isGamePaused() {
    return gamePaused;
}

function isGameOver() {
    return gameOver;
}

function isGameVictory() {
    return gameVictory;
}

function isBossFightActive() {
    return bossFightStarted;
}

function getGameState() {
    return gameState;
}

function getGameDelta() {
    return deltaTime;
}

function getGameTime() {
    return gameTime;
}

function getCurrentWave() {
    return waveNumber;
}

function getCurrentLevelGameData() {
    return currentLevelData;
}

// ------------------------------------------------------------
// KEYBOARD CONTROLS
// ------------------------------------------------------------

function setupGameKeyboardControls() {

    document.addEventListener("keydown", function (event) {

        if (event.code === "Escape") {

            if (gameRunning && !gameOver) {
                togglePause();
            }

            return;
        }

        if (event.code === "ArrowLeft" ||
            event.code === "KeyA") {

            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(true);
            }

            return;
        }

        if (event.code === "ArrowRight" ||
            event.code === "KeyD") {

            if (typeof setPlayerRight === "function") {
                setPlayerRight(true);
            }

            return;
        }

        if (event.code === "Space") {

            if (gameRunning &&
                !gamePaused &&
                typeof playerShoot === "function") {

                playerShoot();
            }

            event.preventDefault();
        }
    });

    document.addEventListener("keyup", function (event) {

        if (event.code === "ArrowLeft" ||
            event.code === "KeyA") {

            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(false);
            }
        }

        if (event.code === "ArrowRight" ||
            event.code === "KeyD") {

            if (typeof setPlayerRight === "function") {
                setPlayerRight(false);
            }
        }
    });
}

// ------------------------------------------------------------
// AUTOMATIC STARTUP
// ------------------------------------------------------------

function startGameSystems() {

    setupGameKeyboardControls();

    initializeGame();

    requestAnimationFrame(gameLoop);
}