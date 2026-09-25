// ============================================================
// UI SYSTEM
// js/ui.js
// ============================================================

let ui = {
    initialized: false,

    elements: {},

    messageTimer: null,
    messageHideTimer: null,

    upgradeVisible: false,
    currentScreen: null,

    lastHealth: 100,
    lastCoins: 0,
    lastScore: 0,
    lastWave: 1,
    lastEnemyCount: 0,
    lastBossHealth: 100
};

// ------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------

function initializeUI() {
    ui.elements = {
        gameContainer: document.getElementById("game-container"),

        // HUD
        score: document.getElementById("score"),
        coins: document.getElementById("coins"),
        wave: document.getElementById("wave"),

        healthBar: document.getElementById("health-fill"),
        healthText: document.getElementById("health-text"),

        gunName: document.getElementById("gun-name"),
        gunStats: document.getElementById("gun-stats"),

        enemyCount: document.getElementById("enemy-count"),

        // Boss HUD
        bossHud: document.getElementById("boss-hud"),
        bossName: document.getElementById("boss-name"),
        bossHealthFill: document.getElementById("boss-health-fill"),
        bossHealthText: document.getElementById("boss-health-text"),
        bossPhase: document.getElementById("boss-phase"),

        // Center message
        centerMessage: document.getElementById("center-message"),

        // Screens
        startScreen: document.getElementById("start-screen"),
        pauseScreen: document.getElementById("pause-screen"),
        gameOverScreen: document.getElementById("game-over-screen"),
        victoryScreen: document.getElementById("victory-screen"),
        loadingScreen: document.getElementById("loading-screen"),

        // Buttons
        startButton: document.getElementById("start-button"),
        resumeButton: document.getElementById("resume-button"),
        restartButton: document.getElementById("restart-button"),
        nextLevelButton: document.getElementById("next-level-button"),

        // Upgrade UI
        upgradeContainer: document.getElementById("upgrade-container"),
        upgradeCards: document.getElementById("upgrade-cards"),
        upgradeTitle: document.getElementById("upgrade-title"),

        // Gate preview
        gatePreview: document.getElementById("gate-preview"),

        // Powerups
        powerupContainer: document.getElementById("powerup-container"),

        // Mobile controls
        leftButton: document.getElementById("left-button"),
        rightButton: document.getElementById("right-button")
    };

    setupUIEvents();

    ui.initialized = true;

    hideAllScreens();
    hideBossHUD();
    hideUpgradeSelection();

    updateUI();
}

// ------------------------------------------------------------
// EVENT SETUP
// ------------------------------------------------------------

function setupUIEvents() {

    if (ui.elements.startButton) {
        ui.elements.startButton.addEventListener("click", function () {
            if (typeof startGame === "function") {
                startGame();
            }
        });
    }

    if (ui.elements.resumeButton) {
        ui.elements.resumeButton.addEventListener("click", function () {
            if (typeof resumeGame === "function") {
                resumeGame();
            }
        });
    }

    if (ui.elements.restartButton) {
        ui.elements.restartButton.addEventListener("click", function () {
            if (typeof restartGame === "function") {
                restartGame();
            }
        });
    }

    if (ui.elements.nextLevelButton) {
        ui.elements.nextLevelButton.addEventListener("click", function () {
            if (typeof nextLevel === "function") {
                nextLevel();
            }
        });
    }

    setupMobileControls();
}

// ------------------------------------------------------------
// MOBILE CONTROLS
// ------------------------------------------------------------

function setupMobileControls() {

    const left = ui.elements.leftButton;
    const right = ui.elements.rightButton;

    if (left) {
        left.addEventListener("pointerdown", function (event) {
            event.preventDefault();

            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(true);
            }
        });

        left.addEventListener("pointerup", function (event) {
            event.preventDefault();

            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(false);
            }
        });

        left.addEventListener("pointercancel", function () {
            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(false);
            }
        });

        left.addEventListener("pointerleave", function () {
            if (typeof setPlayerLeft === "function") {
                setPlayerLeft(false);
            }
        });
    }

    if (right) {
        right.addEventListener("pointerdown", function (event) {
            event.preventDefault();

            if (typeof setPlayerRight === "function") {
                setPlayerRight(true);
            }
        });

        right.addEventListener("pointerup", function (event) {
            event.preventDefault();

            if (typeof setPlayerRight === "function") {
                setPlayerRight(false);
            }
        });

        right.addEventListener("pointercancel", function () {
            if (typeof setPlayerRight === "function") {
                setPlayerRight(false);
            }
        });

        right.addEventListener("pointerleave", function () {
            if (typeof setPlayerRight === "function") {
                setPlayerRight(false);
            }
        });
    }

    // Touch / mouse aiming
    if (ui.elements.gameContainer) {
        ui.elements.gameContainer.addEventListener("pointermove", function (event) {

            if (!player || !camera || !renderer) {
                return;
            }

            if (event.target === left || event.target === right) {
                return;
            }

            if (typeof setPlayerTargetFromScreenPosition === "function") {
                setPlayerTargetFromScreenPosition(
                    event.clientX,
                    event.clientY
                );
            }
        });
    }
}

// ------------------------------------------------------------
// SCREEN MANAGEMENT
// ------------------------------------------------------------

function hideAllScreens() {

    const screens = [
        ui.elements.startScreen,
        ui.elements.pauseScreen,
        ui.elements.gameOverScreen,
        ui.elements.victoryScreen,
        ui.elements.loadingScreen
    ];

    screens.forEach(function (screen) {
        if (screen) {
            screen.classList.remove("active");
            screen.style.display = "none";
        }
    });

    ui.currentScreen = null;
}

function showScreen(screenElement) {

    if (!screenElement) {
        return;
    }

    hideAllScreens();

    screenElement.style.display = "flex";

    requestAnimationFrame(function () {
        screenElement.classList.add("active");
    });

    ui.currentScreen = screenElement;
}

function showStartScreen() {
    showScreen(ui.elements.startScreen);
}

function showPauseScreen() {
    showScreen(ui.elements.pauseScreen);
}

function showGameOverScreen() {

    updateGameOverStats();

    showScreen(ui.elements.gameOverScreen);
}

function showVictoryScreen() {

    updateVictoryStats();

    showScreen(ui.elements.victoryScreen);
}

function showLoadingScreen() {
    if (!ui.elements.loadingScreen) {
        return;
    }

    ui.elements.loadingScreen.style.display = "flex";
    ui.elements.loadingScreen.classList.add("active");
}

function hideLoadingScreen() {

    if (!ui.elements.loadingScreen) {
        return;
    }

    ui.elements.loadingScreen.classList.remove("active");

    setTimeout(function () {
        if (!ui.elements.loadingScreen.classList.contains("active")) {
            ui.elements.loadingScreen.style.display = "none";
        }
    }, 250);
}

// ------------------------------------------------------------
// HUD
// ------------------------------------------------------------

function updateUI() {

    if (!ui.initialized) {
        return;
    }

    updatePlayerUI();
    updateGunUI();
    updateWaveUI();
    updateEnemyUI();
    updateBossUI();
    updateBuildUI();
}

function updatePlayerUI() {

    if (!player) {
        return;
    }

    const health = Math.max(
        0,
        Math.min(100, getPlayerHealthPercent())
    );

    if (ui.elements.healthBar) {
        ui.elements.healthBar.style.width = health + "%";
    }

    if (ui.elements.healthText) {
        ui.elements.healthText.textContent =
            Math.ceil(player.health) + " / " + Math.ceil(player.maxHealth);
    }

    if (ui.elements.coins) {
        ui.elements.coins.textContent =
            Math.floor(player.coins || 0);
    }

    if (ui.elements.score) {
        ui.elements.score.textContent =
            Math.floor(player.score || 0);
    }

    ui.lastHealth = health;
    ui.lastCoins = player.coins || 0;
    ui.lastScore = player.score || 0;
}

function updateGunUI() {

    if (!currentWeapon) {
        return;
    }

    if (ui.elements.gunName) {

        let name = currentWeapon.name ||
                   currentWeapon.id ||
                   "Basic Blaster";

        ui.elements.gunName.textContent = formatText(name);
    }

    if (ui.elements.gunStats) {

        const damage = Math.round(currentWeapon.damage || 0);
        const fireRate = Number(currentWeapon.fireRate || 0).toFixed(2);
        const barrels = currentWeapon.barrelCount || 1;
        const projectiles = currentWeapon.projectileCount || 1;

        ui.elements.gunStats.textContent =
            "DMG " + damage +
            "  •  FIRE " + fireRate +
            "  •  BARRELS " + barrels +
            "  •  SHOTS " + projectiles;
    }
}

function updateWaveUI() {

    if (!player) {
        return;
    }

    const wave = player.wave || 1;

    if (ui.elements.wave) {
        ui.elements.wave.textContent = wave;
    }

    ui.lastWave = wave;
}

function updateEnemyUI() {

    if (!ui.elements.enemyCount) {
        return;
    }

    let count = 0;

    if (typeof getAliveEnemyCount === "function") {
        count = getAliveEnemyCount();
    }

    ui.elements.enemyCount.textContent = count;

    ui.lastEnemyCount = count;
}

function updateBuildUI() {

    if (!ui.elements.gunStats || !currentWeapon) {
        return;
    }

    const buildName =
        typeof getBuildName === "function"
            ? getBuildName()
            : null;

    if (buildName && ui.elements.gunName) {
        ui.elements.gunName.textContent = formatText(buildName);
    }
}

// ------------------------------------------------------------
// BOSS HUD
// ------------------------------------------------------------

function showBossHUD(bossEntity) {

    if (!ui.elements.bossHud) {
        return;
    }

    ui.elements.bossHud.style.display = "block";

    requestAnimationFrame(function () {
        ui.elements.bossHud.classList.add("active");
    });

    if (bossEntity) {
        updateBossUI(bossEntity);
    }
}

function hideBossHUD() {

    if (!ui.elements.bossHud) {
        return;
    }

    ui.elements.bossHud.classList.remove("active");

    setTimeout(function () {

        if (!ui.elements.bossHud.classList.contains("active")) {
            ui.elements.bossHud.style.display = "none";
        }

    }, 200);
}

function updateBossUI(bossEntity) {

    if (!bossEntity) {

        if (typeof boss !== "undefined" && boss) {
            bossEntity = boss;
        } else {
            return;
        }
    }

    const maxHealth = Math.max(1, bossEntity.maxHealth || 1);
    const health = Math.max(
        0,
        Math.min(100, (bossEntity.health / maxHealth) * 100)
    );

    if (ui.elements.bossName) {

        const name =
            bossEntity.name ||
            bossEntity.displayName ||
            bossEntity.id ||
            "BOSS";

        ui.elements.bossName.textContent = formatText(name);
    }

    if (ui.elements.bossHealthFill) {
        ui.elements.bossHealthFill.style.width = health + "%";
    }

    if (ui.elements.bossHealthText) {
        ui.elements.bossHealthText.textContent =
            Math.ceil(bossEntity.health) +
            " / " +
            Math.ceil(maxHealth);
    }

    if (ui.elements.bossPhase) {

        let phase = bossEntity.phase || 1;
        let maxPhase = bossEntity.maxPhase || 1;

        ui.elements.bossPhase.textContent =
            "PHASE " + phase + " / " + maxPhase;
    }

    ui.lastBossHealth = health;
}

// ------------------------------------------------------------
// CENTER MESSAGES
// ------------------------------------------------------------

function showMessage(message, duration = 1500, type = "normal") {

    if (!ui.elements.centerMessage) {
        return;
    }

    const element = ui.elements.centerMessage;

    clearTimeout(ui.messageTimer);
    clearTimeout(ui.messageHideTimer);

    element.textContent = message;

    element.classList.remove(
        "message-normal",
        "message-success",
        "message-warning",
        "message-danger",
        "message-boss"
    );

    element.classList.add("message-" + type);

    element.style.display = "block";

    requestAnimationFrame(function () {
        element.classList.add("active");
    });

    ui.messageTimer = setTimeout(function () {

        element.classList.remove("active");

        ui.messageHideTimer = setTimeout(function () {
            element.style.display = "none";
        }, 250);

    }, duration);
}

function showWaveMessage(waveNumber) {

    showMessage(
        "WAVE " + waveNumber,
        1200,
        "normal"
    );
}

function showBossMessage(bossName) {

    showMessage(
        "BOSS: " + formatText(bossName),
        1800,
        "boss"
    );
}

function showVictoryMessage() {

    showMessage(
        "BOSS DEFEATED!",
        1800,
        "success"
    );
}

function showDamageMessage(amount) {

    showMessage(
        "-" + Math.round(amount),
        500,
        "danger"
    );
}

// ------------------------------------------------------------
// UPGRADE SELECTION
// ------------------------------------------------------------

function showUpgradeSelection(choices, title = "CHOOSE AN UPGRADE") {

    if (!ui.elements.upgradeContainer ||
        !ui.elements.upgradeCards) {
        return;
    }

    ui.upgradeVisible = true;

    ui.elements.upgradeContainer.style.display = "flex";

    requestAnimationFrame(function () {
        ui.elements.upgradeContainer.classList.add("active");
    });

    if (ui.elements.upgradeTitle) {
        ui.elements.upgradeTitle.textContent = title;
    }

    ui.elements.upgradeCards.innerHTML = "";

    if (!choices || choices.length === 0) {
        return;
    }

    choices.forEach(function (choice, index) {

        const card = createUpgradeCard(choice, index);

        ui.elements.upgradeCards.appendChild(card);
    });
}

function createUpgradeCard(choice, index) {

    const card = document.createElement("button");

    card.className = "upgrade-card";

    const rarity =
        choice.rarity ||
        choice.data?.rarity ||
        "COMMON";

    const icon =
        choice.icon ||
        choice.data?.icon ||
        "⚡";

    const name =
        choice.name ||
        choice.data?.name ||
        choice.id ||
        "Upgrade";

    const description =
        choice.description ||
        choice.data?.description ||
        "";

    card.dataset.index = index;

    card.innerHTML = `
        <div class="upgrade-card-icon">${icon}</div>

        <div class="upgrade-card-content">
            <div class="upgrade-card-rarity">
                ${formatText(rarity)}
            </div>

            <div class="upgrade-card-name">
                ${escapeHTML(formatText(name))}
            </div>

            <div class="upgrade-card-description">
                ${escapeHTML(description)}
            </div>
        </div>
    `;

    card.addEventListener("click", function () {

        if (typeof chooseUpgrade === "function") {
            chooseUpgrade(index);
        }

        hideUpgradeSelection();
    });

    return card;
}

function hideUpgradeSelection() {

    if (!ui.elements.upgradeContainer) {
        return;
    }

    ui.upgradeVisible = false;

    ui.elements.upgradeContainer.classList.remove("active");

    setTimeout(function () {

        if (!ui.upgradeVisible) {
            ui.elements.upgradeContainer.style.display = "none";
        }

    }, 200);
}

function isUpgradeSelectionVisible() {
    return ui.upgradeVisible;
}

// ------------------------------------------------------------
// GATE PREVIEW
// ------------------------------------------------------------

function showGatePreview(gate) {

    if (!ui.elements.gatePreview || !gate) {
        return;
    }

    const element = ui.elements.gatePreview;

    const label =
        gate.label ||
        gate.type ||
        "UPGRADE";

    element.textContent = formatText(label);

    element.style.display = "block";

    requestAnimationFrame(function () {
        element.classList.add("active");
    });
}

function hideGatePreview() {

    if (!ui.elements.gatePreview) {
        return;
    }

    ui.elements.gatePreview.classList.remove("active");

    setTimeout(function () {
        ui.elements.gatePreview.style.display = "none";
    }, 200);
}

// ------------------------------------------------------------
// POWERUP UI
// ------------------------------------------------------------

function showPowerup(name, duration = 2000) {

    if (!ui.elements.powerupContainer) {
        return;
    }

    const element = document.createElement("div");

    element.className = "powerup-item";

    element.textContent = formatText(name);

    ui.elements.powerupContainer.appendChild(element);

    requestAnimationFrame(function () {
        element.classList.add("active");
    });

    setTimeout(function () {

        element.classList.remove("active");

        setTimeout(function () {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 250);

    }, duration);
}

function clearPowerups() {

    if (!ui.elements.powerupContainer) {
        return;
    }

    ui.elements.powerupContainer.innerHTML = "";
}

// ------------------------------------------------------------
// GAME OVER / VICTORY STATS
// ------------------------------------------------------------

function updateGameOverStats() {

    const score =
        player ? Math.floor(player.score || 0) : 0;

    const coins =
        player ? Math.floor(player.coins || 0) : 0;

    const kills =
        player ? Math.floor(player.kills || 0) : 0;

    const wave =
        player ? Math.floor(player.wave || 1) : 1;

    const scoreElement =
        document.getElementById("game-over-score");

    const coinsElement =
        document.getElementById("game-over-coins");

    const killsElement =
        document.getElementById("game-over-kills");

    const waveElement =
        document.getElementById("game-over-wave");

    if (scoreElement) scoreElement.textContent = score;
    if (coinsElement) coinsElement.textContent = coins;
    if (killsElement) killsElement.textContent = kills;
    if (waveElement) waveElement.textContent = wave;
}

function updateVictoryStats() {

    const score =
        player ? Math.floor(player.score || 0) : 0;

    const coins =
        player ? Math.floor(player.coins || 0) : 0;

    const kills =
        player ? Math.floor(player.kills || 0) : 0;

    const scoreElement =
        document.getElementById("victory-score");

    const coinsElement =
        document.getElementById("victory-coins");

    const killsElement =
        document.getElementById("victory-kills");

    if (scoreElement) scoreElement.textContent = score;
    if (coinsElement) coinsElement.textContent = coins;
    if (killsElement) killsElement.textContent = kills;
}

// ------------------------------------------------------------
// LEVEL UI
// ------------------------------------------------------------

function updateLevelUI() {

    const level =
        typeof getCurrentLevel === "function"
            ? getCurrentLevel()
            : 1;

    const levelElements =
        document.querySelectorAll(".level-number");

    levelElements.forEach(function (element) {
        element.textContent = level;
    });
}

// ------------------------------------------------------------
// UPGRADE BUILD DISPLAY
// ------------------------------------------------------------

function updateUpgradeList() {

    const list =
        document.getElementById("upgrade-list");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    if (typeof getAcquiredUpgrades !== "function") {
        return;
    }

    const upgrades = getAcquiredUpgrades();

    upgrades.forEach(function (upgradeId) {

        const item = document.createElement("div");

        item.className = "upgrade-list-item";

        let data = null;

        if (typeof getUpgradeData === "function") {
            data = getUpgradeData(upgradeId);
        }

        item.textContent =
            data?.name ||
            formatText(upgradeId);

        list.appendChild(item);
    });
}

// ------------------------------------------------------------
// FULL UPDATE
// ------------------------------------------------------------

function updateFullUI() {

    updateUI();
    updateLevelUI();
    updateUpgradeList();
}

// ------------------------------------------------------------
// GAME STATE HELPERS
// ------------------------------------------------------------

function setGameUIState(state) {

    switch (state) {

        case "loading":
            showLoadingScreen();
            break;

        case "start":
            hideLoadingScreen();
            showStartScreen();
            break;

        case "playing":
            hideAllScreens();
            break;

        case "paused":
            showPauseScreen();
            break;

        case "gameover":
            showGameOverScreen();
            break;

        case "victory":
            showVictoryScreen();
            break;

        case "boss":
            hideAllScreens();
            showBossHUD();
            break;

        default:
            break;
    }
}

// ------------------------------------------------------------
// UTILITY
// ------------------------------------------------------------

function formatText(value) {

    if (value === undefined || value === null) {
        return "";
    }

    return String(value)
        .replace(/_/g, " ")
        .replace(/-/g, " ")
        .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
        });
}

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ------------------------------------------------------------
// NOTIFICATION HELPERS
// ------------------------------------------------------------

function showCenterMessage(message, duration = 1500, type = "normal") {

    showMessage(message, duration, type);
}

function updateWeaponUI() {

    updateGunUI();
}

function updateUIFrame() {

    updateUI();
}

function notifyUpgrade(upgrade) {

    if (!upgrade) {
        return;
    }

    const name =
        upgrade.name ||
        upgrade.title ||
        upgrade.id ||
        "UPGRADE";

    showPowerup(formatText(name));
}