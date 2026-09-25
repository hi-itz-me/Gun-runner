/* ============================================================
   GUN RUNNER
   LEVEL DATA
============================================================ */

const LEVEL_DATA = {

    1: {
        id: 1,
        name: "FIRST RUN",

        runWaves: 5,

        boss: "SCRAP_TITAN",

        startingEnemies: 6,

        enemyGrowth: 2,

        gateCount: 4,

        rewardMultiplier: 1.0,

        difficulty: 1.0
    },


    2: {
        id: 2,
        name: "THE FACTORY",

        runWaves: 6,

        boss: "SCRAP_TITAN",

        startingEnemies: 8,

        enemyGrowth: 2,

        gateCount: 5,

        rewardMultiplier: 1.15,

        difficulty: 1.15
    },


    3: {
        id: 3,
        name: "RUSH HOUR",

        runWaves: 7,

        boss: "VOID_BEAST",

        startingEnemies: 9,

        enemyGrowth: 3,

        gateCount: 5,

        rewardMultiplier: 1.3,

        difficulty: 1.3
    },


    4: {
        id: 4,
        name: "DEAD ZONE",

        runWaves: 8,

        boss: "VOID_BEAST",

        startingEnemies: 10,

        enemyGrowth: 3,

        gateCount: 6,

        rewardMultiplier: 1.5,

        difficulty: 1.5
    },


    5: {
        id: 5,
        name: "WARPATH",

        runWaves: 9,

        boss: "WAR_MACHINE",

        startingEnemies: 12,

        enemyGrowth: 3,

        gateCount: 6,

        rewardMultiplier: 1.75,

        difficulty: 1.75
    },


    6: {
        id: 6,
        name: "IRON STORM",

        runWaves: 10,

        boss: "WAR_MACHINE",

        startingEnemies: 14,

        enemyGrowth: 4,

        gateCount: 7,

        rewardMultiplier: 2.0,

        difficulty: 2.0
    },


    7: {
        id: 7,
        name: "CHAOS",

        runWaves: 11,

        boss: "DRAGON_CORE",

        startingEnemies: 15,

        enemyGrowth: 4,

        gateCount: 7,

        rewardMultiplier: 2.3,

        difficulty: 2.3
    },


    8: {
        id: 8,
        name: "INFERNO",

        runWaves: 12,

        boss: "DRAGON_CORE",

        startingEnemies: 17,

        enemyGrowth: 4,

        gateCount: 8,

        rewardMultiplier: 2.6,

        difficulty: 2.6
    },


    9: {
        id: 9,
        name: "FINAL APPROACH",

        runWaves: 13,

        boss: "FINAL_OVERLORD",

        startingEnemies: 19,

        enemyGrowth: 5,

        gateCount: 8,

        rewardMultiplier: 3.0,

        difficulty: 3.0
    },


    10: {
        id: 10,
        name: "THE OVERLORD",

        runWaves: 15,

        boss: "FINAL_OVERLORD",

        startingEnemies: 22,

        enemyGrowth: 5,

        gateCount: 10,

        rewardMultiplier: 4.0,

        difficulty: 3.5
    }

};


/* ============================================================
   LEVEL UTILITIES
============================================================ */

function getLevelData(
    level = 1
) {

    if (LEVEL_DATA[level]) {
        return LEVEL_DATA[level];
    }

    return LEVEL_DATA[10];
}


/* ============================================================
   LEVEL EXISTENCE
============================================================ */

function levelExists(
    level
) {

    return !!LEVEL_DATA[level];
}


/* ============================================================
   TOTAL LEVELS
============================================================ */

function getTotalLevels() {

    return Object.keys(
        LEVEL_DATA
    ).length;
}


/* ============================================================
   ENEMY COUNT
============================================================ */

function getLevelEnemyCount(
    level,
    wave
) {

    const data =
        getLevelData(level);

    return Math.max(
        1,
        Math.floor(
            data.startingEnemies +
            (
                Math.max(
                    0,
                    wave - 1
                ) *
                data.enemyGrowth
            )
        )
    );
}


/* ============================================================
   LEVEL DIFFICULTY
============================================================ */

function getLevelDifficulty(
    level
) {

    return getLevelData(
        level
    ).difficulty;
}


/* ============================================================
   LEVEL REWARD MULTIPLIER
============================================================ */

function getLevelRewardMultiplier(
    level
) {

    return getLevelData(
        level
    ).rewardMultiplier;
}


/* ============================================================
   BOSS
============================================================ */

function getLevelBoss(
    level
) {

    return getLevelData(
        level
    ).boss;
}


/* ============================================================
   WAVE COUNT
============================================================ */

function getLevelWaveCount(
    level
) {

    return getLevelData(
        level
    ).runWaves;
}


/* ============================================================
   GATE COUNT
============================================================ */

function getLevelGateCount(
    level
) {

    return getLevelData(
        level
    ).gateCount;
}


/* ============================================================
   LEVEL PROGRESSION
============================================================ */

let currentLevel = 1;


function setCurrentLevel(
    level
) {

    level = Math.max(
        1,
        Math.floor(level)
    );

    if (
        level > getTotalLevels()
    ) {

        level =
            getTotalLevels();
    }

    currentLevel =
        level;

    return currentLevel;
}


function getCurrentLevel() {

    return currentLevel;
}


/* ============================================================
   NEXT LEVEL
============================================================ */

function advanceLevel() {

    if (
        currentLevel <
        getTotalLevels()
    ) {

        currentLevel++;

        return true;
    }

    return false;
}


/* ============================================================
   LEVEL RESET
============================================================ */

function resetLevel() {

    currentLevel = 1;
}


/* ============================================================
   LEVEL SUMMARY
============================================================ */

function getLevelSummary(
    level
) {

    const data =
        getLevelData(level);

    return {

        id: data.id,

        name: data.name,

        waves:
            data.runWaves,

        boss:
            data.boss,

        gates:
            data.gateCount,

        difficulty:
            data.difficulty,

        rewardMultiplier:
            data.rewardMultiplier
    };
}