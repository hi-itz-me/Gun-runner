/* ============================================================
   GUN RUNNER
   ENEMY DATA
============================================================ */

const ENEMY_DATA = {

    BASIC: {
        id: "basic",
        name: "DRONE",

        health: 35,
        speed: 3.2,
        damage: 8,

        radius: 0.55,

        reward: 10,

        color: 0xff5555,

        attackRange: 2.0,
        attackCooldown: 1.2
    },


    FAST: {
        id: "fast",
        name: "RUNNER",

        health: 22,
        speed: 5.8,
        damage: 6,

        radius: 0.42,

        reward: 15,

        color: 0xffaa33,

        attackRange: 1.7,
        attackCooldown: 0.9
    },


    TANK: {
        id: "tank",
        name: "TANK",

        health: 120,
        speed: 1.8,
        damage: 18,

        radius: 0.85,

        reward: 35,

        color: 0x8844ff,

        attackRange: 2.4,
        attackCooldown: 1.8
    },


    SHOOTER: {
        id: "shooter",
        name: "SHOOTER",

        health: 50,
        speed: 2.3,
        damage: 12,

        radius: 0.58,

        reward: 25,

        color: 0x44bbff,

        attackRange: 9,
        attackCooldown: 2.0,

        ranged: true,
        projectileSpeed: 12
    },


    SWARM: {
        id: "swarm",
        name: "SWARM",

        health: 12,
        speed: 4.7,
        damage: 4,

        radius: 0.30,

        reward: 5,

        color: 0x55dd66,

        attackRange: 1.3,
        attackCooldown: 0.7
    },


    ELITE: {
        id: "elite",
        name: "ELITE",

        health: 250,
        speed: 2.7,
        damage: 28,

        radius: 1.0,

        reward: 75,

        color: 0xff44aa,

        attackRange: 2.8,
        attackCooldown: 1.5
    },


    SHIELDED: {
        id: "shielded",
        name: "SHIELDED",

        health: 160,
        speed: 2.0,
        damage: 16,

        radius: 0.82,

        reward: 60,

        color: 0x55ccff,

        attackRange: 2.3,
        attackCooldown: 1.6,

        shield: 100,
        shieldRegeneration: 8
    },


    BERSERKER: {
        id: "berserker",
        name: "BERSERKER",

        health: 180,
        speed: 4.0,
        damage: 24,

        radius: 0.75,

        reward: 65,

        color: 0xff3333,

        attackRange: 2.0,
        attackCooldown: 1.0,

        enragedSpeedMultiplier: 1.5,
        enragedThreshold: 0.35
    },


    MINI_BOSS: {
        id: "mini_boss",
        name: "MINI BOSS",

        health: 750,
        speed: 1.4,
        damage: 40,

        radius: 1.45,

        reward: 250,

        color: 0xbb33ff,

        attackRange: 3.5,
        attackCooldown: 2.0,

        boss: true
    }

};


/* ============================================================
   ENEMY UTILITIES
============================================================ */

function getEnemyData(enemyId) {

    return ENEMY_DATA[enemyId] || null;
}


function createEnemyStats(enemyId) {

    const source =
        getEnemyData(enemyId);

    if (!source) {
        return null;
    }

    return JSON.parse(
        JSON.stringify(source)
    );
}


/* ============================================================
   DIFFICULTY SCALING
============================================================ */

function scaleEnemyStats(
    stats,
    level = 1,
    wave = 1
) {

    if (!stats) {
        return null;
    }

    const levelMultiplier =
        1 + ((level - 1) * 0.12);

    const waveMultiplier =
        1 + ((wave - 1) * 0.035);

    const multiplier =
        levelMultiplier *
        waveMultiplier;

    stats.health *= multiplier;

    stats.damage *=
        Math.min(
            multiplier,
            2.5
        );

    stats.reward *=
        1 + ((level - 1) * 0.08);

    stats.health =
        Math.round(stats.health);

    stats.damage =
        Math.round(stats.damage);

    stats.reward =
        Math.round(stats.reward);

    return stats;
}


/* ============================================================
   ENEMY TYPE POOLS
============================================================ */

const EARLY_ENEMY_POOL = [
    "BASIC",
    "BASIC",
    "BASIC",
    "FAST"
];


const MID_ENEMY_POOL = [
    "BASIC",
    "FAST",
    "FAST",
    "TANK",
    "SHOOTER",
    "SWARM"
];


const LATE_ENEMY_POOL = [
    "FAST",
    "TANK",
    "SHOOTER",
    "SWARM",
    "ELITE",
    "SHIELDED",
    "BERSERKER"
];


const ELITE_ENEMY_POOL = [
    "TANK",
    "SHOOTER",
    "ELITE",
    "SHIELDED",
    "BERSERKER",
    "MINI_BOSS"
];


/* ============================================================
   RANDOM ENEMY
============================================================ */

function getRandomEnemyId(
    wave = 1
) {

    let pool;

    if (wave <= 3) {

        pool =
            EARLY_ENEMY_POOL;

    } else if (wave <= 7) {

        pool =
            MID_ENEMY_POOL;

    } else if (wave <= 12) {

        pool =
            LATE_ENEMY_POOL;

    } else {

        pool =
            ELITE_ENEMY_POOL;
    }

    return pool[
        Math.floor(
            Math.random() * pool.length
        )
    ];
}


/* ============================================================
   WAVE COMPOSITION
============================================================ */

function generateWaveComposition(
    wave = 1
) {

    const enemies = [];

    let count =
        5 + Math.floor(wave * 1.8);

    count = Math.min(
        count,
        40
    );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        let enemyId =
            getRandomEnemyId(wave);

        /*
         * Keep bosses out of normal waves.
         */
        if (
            enemyId === "MINI_BOSS"
        ) {

            enemyId = "ELITE";
        }

        enemies.push(
            enemyId
        );
    }

    /*
     * Every 5th wave receives
     * a guaranteed heavy enemy.
     */

    if (
        wave % 5 === 0 &&
        enemies.length > 0
    ) {

        enemies[
            enemies.length - 1
        ] = "ELITE";
    }

    return enemies;
}


/* ============================================================
   BOSS WAVE
============================================================ */

function generateBossWave(
    wave = 1
) {

    const enemies = [];

    const normalCount =
        Math.max(
            4,
            Math.floor(
                6 + wave * 0.8
            )
        );

    for (
        let i = 0;
        i < normalCount;
        i++
    ) {

        enemies.push(
            getRandomEnemyId(
                Math.max(
                    5,
                    wave
                )
            )
        );
    }

    enemies.push(
        "MINI_BOSS"
    );

    return enemies;
}


/* ============================================================
   ENEMY HEALTH HELPERS
============================================================ */

function getEnemyHealthPercent(
    enemy
) {

    if (!enemy) {
        return 0;
    }

    if (
        enemy.maxHealth <= 0
    ) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            1,
            enemy.health /
            enemy.maxHealth
        )
    );
}


/* ============================================================
   ENEMY STATUS
============================================================ */

function createEnemyStatus() {

    return {

        frozen: false,
        freezeTimer: 0,

        slowed: false,
        slowAmount: 0,
        slowTimer: 0,

        stunned: false,
        stunTimer: 0,

        burning: false,
        burnDamage: 0,
        burnTimer: 0,

        shieldBroken: false,

        enraged: false
    };
}


/* ============================================================
   FREEZE
============================================================ */

function applyEnemyFreeze(
    enemy,
    amount = 0.65,
    duration = 2
) {

    if (!enemy) {
        return;
    }

    if (!enemy.status) {
        enemy.status =
            createEnemyStatus();
    }

    enemy.status.frozen =
        true;

    enemy.status.slowed =
        true;

    enemy.status.slowAmount =
        Math.max(
            enemy.status.slowAmount,
            amount
        );

    enemy.status.freezeTimer =
        Math.max(
            enemy.status.freezeTimer,
            duration
        );

    enemy.status.slowTimer =
        Math.max(
            enemy.status.slowTimer,
            duration
        );
}


/* ============================================================
   STATUS UPDATE
============================================================ */

function updateEnemyStatus(
    enemy,
    delta
) {

    if (
        !enemy ||
        !enemy.status
    ) {
        return;
    }

    const status =
        enemy.status;

    if (
        status.freezeTimer > 0
    ) {

        status.freezeTimer -=
            delta;

    } else {

        status.frozen =
            false;
    }

    if (
        status.slowTimer > 0
    ) {

        status.slowTimer -=
            delta;

    } else {

        status.slowed =
            false;

        status.slowAmount =
            0;
    }

    if (
        status.stunTimer > 0
    ) {

        status.stunTimer -=
            delta;

    } else {

        status.stunned =
            false;
    }

    if (
        status.burnTimer > 0
    ) {

        status.burnTimer -=
            delta;

    } else {

        status.burning =
            false;

        status.burnDamage =
            0;
    }

    /*
     * Berserker rage.
     */

    if (
        enemy.enragedThreshold &&
        enemy.health <=
            enemy.maxHealth *
            enemy.enragedThreshold
    ) {

        status.enraged =
            true;
    }
}


/* ============================================================
   EFFECTIVE ENEMY SPEED
============================================================ */

function getEnemyEffectiveSpeed(
    enemy
) {

    if (!enemy) {
        return 0;
    }

    let speed =
        enemy.speed;

    if (
        enemy.status &&
        enemy.status.slowed
    ) {

        speed *=
            Math.max(
                0.1,
                1 -
                enemy.status.slowAmount
            );
    }

    if (
        enemy.status &&
        enemy.status.frozen
    ) {

        speed *= 0.2;
    }

    if (
        enemy.status &&
        enemy.status.stunned
    ) {

        speed = 0;
    }

    if (
        enemy.status &&
        enemy.status.enraged &&
        enemy.enragedSpeedMultiplier
    ) {

        speed *=
            enemy.enragedSpeedMultiplier;
    }

    return speed;
}


/* ============================================================
   ENEMY DAMAGE
============================================================ */

function calculateEnemyDamage(
    enemy
) {

    if (!enemy) {
        return 0;
    }

    let damage =
        enemy.damage;

    if (
        enemy.status &&
        enemy.status.enraged
    ) {

        damage *= 1.35;
    }

    return Math.round(
        damage
    );
}


/* ============================================================
   ENEMY REWARD
============================================================ */

function getEnemyReward(
    enemy
) {

    if (!enemy) {
        return 0;
    }

    return Math.max(
        0,
        Math.round(
            enemy.reward || 0
        )
    );
}