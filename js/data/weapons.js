/* ============================================================
   GUN RUNNER
   WEAPON DATA
============================================================ */

const WEAPON_DATA = {

    BASIC_BLASTER: {
        id: "basic_blaster",
        name: "BASIC BLASTER",

        damage: 10,
        fireRate: 1.0,
        range: 100,

        barrelCount: 1,
        bulletSpeed: 32,
        bulletSize: 0.12,

        spread: 0,
        projectileCount: 1,

        explosive: false,
        explosiveRadius: 0,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0,
        criticalMultiplier: 2,

        recoil: 0.15,

        color: 0xffffff
    },


    MACHINE_GUN: {
        id: "machine_gun",
        name: "MACHINE GUN",

        damage: 8,
        fireRate: 4.0,
        range: 110,

        barrelCount: 2,
        bulletSpeed: 38,
        bulletSize: 0.10,

        spread: 0.08,
        projectileCount: 1,

        explosive: false,
        explosiveRadius: 0,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0.05,
        criticalMultiplier: 2,

        recoil: 0.08,

        color: 0xffd84a
    },


    CANNON: {
        id: "cannon",
        name: "HEAVY CANNON",

        damage: 45,
        fireRate: 0.65,
        range: 125,

        barrelCount: 1,
        bulletSpeed: 26,
        bulletSize: 0.24,

        spread: 0,
        projectileCount: 1,

        explosive: true,
        explosiveRadius: 4,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0.03,
        criticalMultiplier: 2.5,

        recoil: 0.45,

        color: 0xff6b35
    },


    TWIN_BLASTER: {
        id: "twin_blaster",
        name: "TWIN BLASTER",

        damage: 14,
        fireRate: 1.5,
        range: 105,

        barrelCount: 2,
        bulletSpeed: 34,
        bulletSize: 0.12,

        spread: 0.04,
        projectileCount: 2,

        explosive: false,
        explosiveRadius: 0,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0.05,
        criticalMultiplier: 2,

        recoil: 0.18,

        color: 0x4da6ff
    },


    EXPLOSIVE_BLASTER: {
        id: "explosive_blaster",
        name: "EXPLOSIVE BLASTER",

        damage: 18,
        fireRate: 1.2,
        range: 110,

        barrelCount: 1,
        bulletSpeed: 30,
        bulletSize: 0.15,

        spread: 0,
        projectileCount: 1,

        explosive: true,
        explosiveRadius: 3.5,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0.04,
        criticalMultiplier: 2,

        recoil: 0.25,

        color: 0xff6333
    },


    FREEZE_GUN: {
        id: "freeze_gun",
        name: "FREEZE GUN",

        damage: 12,
        fireRate: 1.4,
        range: 115,

        barrelCount: 1,
        bulletSpeed: 31,
        bulletSize: 0.13,

        spread: 0,
        projectileCount: 1,

        explosive: false,
        explosiveRadius: 0,

        piercing: false,
        pierceCount: 0,

        freezing: true,
        freezeAmount: 0.65,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 0,

        criticalChance: 0.02,
        criticalMultiplier: 2,

        recoil: 0.12,

        color: 0x66ddff
    },


    LIGHTNING_GUN: {
        id: "lightning_gun",
        name: "CHAIN LIGHTNING",

        damage: 16,
        fireRate: 1.6,
        range: 115,

        barrelCount: 1,
        bulletSpeed: 35,
        bulletSize: 0.11,

        spread: 0,
        projectileCount: 1,

        explosive: false,
        explosiveRadius: 0,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: true,
        chainCount: 3,

        rocketPods: 0,

        criticalChance: 0.06,
        criticalMultiplier: 2.2,

        recoil: 0.10,

        color: 0x8c7cff
    },


    ROCKET_GUN: {
        id: "rocket_gun",
        name: "ROCKET GUN",

        damage: 30,
        fireRate: 0.8,
        range: 140,

        barrelCount: 1,
        bulletSpeed: 22,
        bulletSize: 0.20,

        spread: 0,
        projectileCount: 1,

        explosive: true,
        explosiveRadius: 5,

        piercing: false,
        pierceCount: 0,

        freezing: false,
        freezeAmount: 0,

        chainLightning: false,
        chainCount: 0,

        rocketPods: 1,

        criticalChance: 0.05,
        criticalMultiplier: 2.5,

        recoil: 0.35,

        color: 0xff4433
    }

};


/* ============================================================
   WEAPON UTILITIES
============================================================ */

function createWeaponStats(weaponId = "BASIC_BLASTER") {

    const source = WEAPON_DATA[weaponId];

    if (!source) {
        return createWeaponStats("BASIC_BLASTER");
    }

    return JSON.parse(JSON.stringify(source));
}


function clampWeaponStats(stats) {

    stats.damage = Math.max(1, stats.damage);

    stats.fireRate = Math.max(0.1, stats.fireRate);

    stats.range = Math.max(10, stats.range);

    stats.barrelCount = Math.max(
        1,
        Math.floor(stats.barrelCount)
    );

    stats.bulletSpeed = Math.max(
        1,
        stats.bulletSpeed
    );

    stats.bulletSize = Math.max(
        0.03,
        stats.bulletSize
    );

    stats.spread = Math.max(
        0,
        stats.spread
    );

    stats.projectileCount = Math.max(
        1,
        Math.floor(stats.projectileCount)
    );

    stats.explosiveRadius = Math.max(
        0,
        stats.explosiveRadius
    );

    stats.pierceCount = Math.max(
        0,
        Math.floor(stats.pierceCount)
    );

    stats.chainCount = Math.max(
        0,
        Math.floor(stats.chainCount)
    );

    stats.rocketPods = Math.max(
        0,
        Math.floor(stats.rocketPods)
    );

    stats.criticalChance = Math.min(
        1,
        Math.max(0, stats.criticalChance)
    );

    stats.criticalMultiplier = Math.max(
        1,
        stats.criticalMultiplier
    );

    return stats;
}


/* ============================================================
   WEAPON DAMAGE
============================================================ */

function calculateWeaponDamage(stats) {

    let damage = stats.damage;

    if (
        Math.random() <
        stats.criticalChance
    ) {
        damage *= stats.criticalMultiplier;
    }

    return Math.round(damage);
}


/* ============================================================
   WEAPON DESCRIPTION
============================================================ */

function getWeaponDescription(stats) {

    const parts = [];

    parts.push(
        `${Math.round(stats.damage)} DMG`
    );

    parts.push(
        `${stats.fireRate.toFixed(1)} FIRE`
    );

    if (stats.barrelCount > 1) {
        parts.push(
            `${stats.barrelCount} BARRELS`
        );
    }

    if (stats.explosive) {
        parts.push("EXPLOSIVE");
    }

    if (stats.piercing) {
        parts.push("PIERCING");
    }

    if (stats.freezing) {
        parts.push("FREEZE");
    }

    if (stats.chainLightning) {
        parts.push("CHAIN");
    }

    if (stats.rocketPods > 0) {
        parts.push(
            `${stats.rocketPods} ROCKET`
        );
    }

    return parts.join(" • ");
}


/* ============================================================
   GLOBAL WEAPON STATE
============================================================ */

let currentWeapon = createWeaponStats(
    "BASIC_BLASTER"
);

clampWeaponStats(currentWeapon);