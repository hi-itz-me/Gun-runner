/* ============================================================
   GUN RUNNER
   UPGRADE DATA
============================================================ */

const UPGRADE_DATA = {

    DAMAGE: {
        id: "damage",
        name: "POWER CORE",
        description: "+25% weapon damage",
        type: "stat",
        stat: "damage",
        multiplier: 1.25,
        color: 0xff4444
    },

    RAPID_FIRE: {
        id: "rapid_fire",
        name: "RAPID FIRE",
        description: "+45% fire rate",
        type: "stat",
        stat: "fireRate",
        multiplier: 1.45,
        color: 0xffd84a
    },

    DOUBLE_BARREL: {
        id: "double_barrel",
        name: "TWIN BARREL",
        description: "+1 weapon barrel",
        type: "stat",
        stat: "barrelCount",
        amount: 1,
        color: 0x4da6ff
    },

    TRIPLE_BARREL: {
        id: "triple_barrel",
        name: "TRIPLE BARREL",
        description: "+2 weapon barrels",
        type: "stat",
        stat: "barrelCount",
        amount: 2,
        color: 0x3377ff
    },

    MULTI_SHOT: {
        id: "multi_shot",
        name: "MULTI SHOT",
        description: "+1 projectile per shot",
        type: "stat",
        stat: "projectileCount",
        amount: 1,
        color: 0x66bbff
    },

    HEAVY_BULLETS: {
        id: "heavy_bullets",
        name: "HEAVY ROUNDS",
        description: "+50% bullet damage and size",
        type: "multi",
        color: 0xff7733,

        apply(stats) {
            stats.damage *= 1.5;
            stats.bulletSize *= 1.25;
        }
    },

    FAST_BULLETS: {
        id: "fast_bullets",
        name: "OVERDRIVE",
        description: "+35% projectile speed",
        type: "stat",
        stat: "bulletSpeed",
        multiplier: 1.35,
        color: 0xffaa33
    },

    LONG_RANGE: {
        id: "long_range",
        name: "LONG BARREL",
        description: "+30% weapon range",
        type: "stat",
        stat: "range",
        multiplier: 1.30,
        color: 0x55ddaa
    },

    EXPLOSIVE: {
        id: "explosive",
        name: "EXPLOSIVE ROUNDS",
        description: "Bullets explode on impact",
        type: "special",
        color: 0xff5522,

        apply(stats) {
            stats.explosive = true;
            stats.explosiveRadius = Math.max(
                stats.explosiveRadius,
                3.5
            );
        }
    },

    BIG_EXPLOSION: {
        id: "big_explosion",
        name: "MEGA EXPLOSION",
        description: "+70% explosion radius",
        type: "stat",
        stat: "explosiveRadius",
        multiplier: 1.70,
        color: 0xff3300
    },

    PIERCING: {
        id: "piercing",
        name: "PIERCING",
        description: "Bullets pass through enemies",
        type: "special",
        color: 0xaa55ff,

        apply(stats) {
            stats.piercing = true;
            stats.pierceCount = Math.max(
                stats.pierceCount,
                2
            );
        }
    },

    EXTRA_PIERCE: {
        id: "extra_pierce",
        name: "DEEP PIERCING",
        description: "+2 additional enemy pierces",
        type: "stat",
        stat: "pierceCount",
        amount: 2,
        color: 0xcc77ff
    },

    FREEZE: {
        id: "freeze",
        name: "CRYO CORE",
        description: "Bullets slow enemies",
        type: "special",
        color: 0x66ddff,

        apply(stats) {
            stats.freezing = true;
            stats.freezeAmount = Math.max(
                stats.freezeAmount,
                0.65
            );
        }
    },

    DEEP_FREEZE: {
        id: "deep_freeze",
        name: "DEEP FREEZE",
        description: "Stronger enemy slow",
        type: "stat",
        stat: "freezeAmount",
        amount: 0.15,
        color: 0x44bbff,

        apply(stats) {
            stats.freezing = true;
            stats.freezeAmount += 0.15;
        }
    },

    CHAIN_LIGHTNING: {
        id: "chain_lightning",
        name: "CHAIN LIGHTNING",
        description: "Damage jumps between enemies",
        type: "special",
        color: 0x8c7cff,

        apply(stats) {
            stats.chainLightning = true;
            stats.chainCount = Math.max(
                stats.chainCount,
                3
            );
        }
    },

    EXTRA_CHAIN: {
        id: "extra_chain",
        name: "ARC AMPLIFIER",
        description: "+2 lightning targets",
        type: "stat",
        stat: "chainCount",
        amount: 2,
        color: 0xaa99ff
    },

    ROCKET_POD: {
        id: "rocket_pod",
        name: "ROCKET POD",
        description: "Adds an automatic rocket launcher",
        type: "stat",
        stat: "rocketPods",
        amount: 1,
        color: 0xff4433
    },

    SECOND_ROCKET: {
        id: "second_rocket",
        name: "DUAL ROCKET POD",
        description: "+1 automatic rocket",
        type: "stat",
        stat: "rocketPods",
        amount: 1,
        color: 0xff6633
    },

    CRITICAL: {
        id: "critical",
        name: "CRITICAL CORE",
        description: "+10% critical-hit chance",
        type: "stat",
        stat: "criticalChance",
        amount: 0.10,
        color: 0xff44aa
    },

    CRITICAL_POWER: {
        id: "critical_power",
        name: "CRITICAL POWER",
        description: "+50% critical damage",
        type: "stat",
        stat: "criticalMultiplier",
        multiplier: 1.50,
        color: 0xff2299
    },

    ACCURACY: {
        id: "accuracy",
        name: "TARGETING SYSTEM",
        description: "Reduces bullet spread",
        type: "special",
        color: 0x44ddaa,

        apply(stats) {
            stats.spread *= 0.45;
        }
    },

    BARREL_OVERDRIVE: {
        id: "barrel_overdrive",
        name: "BARREL OVERDRIVE",
        description: "+25% fire rate per extra barrel",
        type: "special",
        color: 0xffbb44,

        apply(stats) {
            if (stats.barrelCount > 1) {
                stats.fireRate *=
                    1 + ((stats.barrelCount - 1) * 0.25);
            }
        }
    }
};


/* ============================================================
   UPGRADE POOLS
============================================================ */

const BASIC_UPGRADE_POOL = [
    "DAMAGE",
    "RAPID_FIRE",
    "DOUBLE_BARREL",
    "MULTI_SHOT",
    "FAST_BULLETS",
    "LONG_RANGE",
    "ACCURACY"
];


const ADVANCED_UPGRADE_POOL = [
    "DAMAGE",
    "RAPID_FIRE",
    "TRIPLE_BARREL",
    "MULTI_SHOT",
    "HEAVY_BULLETS",
    "FAST_BULLETS",
    "EXPLOSIVE",
    "PIERCING",
    "FREEZE",
    "ACCURACY",
    "CRITICAL"
];


const SPECIAL_UPGRADE_POOL = [
    "EXPLOSIVE",
    "BIG_EXPLOSION",
    "PIERCING",
    "EXTRA_PIERCE",
    "FREEZE",
    "DEEP_FREEZE",
    "CHAIN_LIGHTNING",
    "EXTRA_CHAIN",
    "ROCKET_POD",
    "SECOND_ROCKET",
    "CRITICAL",
    "CRITICAL_POWER",
    "BARREL_OVERDRIVE"
];


/* ============================================================
   UPGRADE UTILITIES
============================================================ */

function getUpgradeData(upgradeId) {

    return UPGRADE_DATA[upgradeId] || null;
}


function cloneUpgrade(upgradeId) {

    const upgrade = getUpgradeData(upgradeId);

    if (!upgrade) {
        return null;
    }

    return {
        ...upgrade
    };
}


/* ============================================================
   APPLY UPGRADE
============================================================ */

function applyUpgrade(stats, upgradeId) {

    const upgrade = getUpgradeData(upgradeId);

    if (!upgrade) {
        return stats;
    }

    if (
        upgrade.type === "stat" &&
        upgrade.stat
    ) {

        if (
            typeof upgrade.multiplier ===
            "number"
        ) {

            stats[upgrade.stat] *=
                upgrade.multiplier;

        } else if (
            typeof upgrade.amount ===
            "number"
        ) {

            stats[upgrade.stat] +=
                upgrade.amount;
        }
    }

    if (
        upgrade.type === "special" &&
        typeof upgrade.apply === "function"
    ) {

        upgrade.apply(stats);
    }

    if (
        upgrade.type === "multi" &&
        typeof upgrade.apply === "function"
    ) {

        upgrade.apply(stats);
    }

    return stats;
}


/* ============================================================
   RANDOM UPGRADE SELECTION
============================================================ */

function getRandomUpgradeId(pool) {

    if (
        !pool ||
        pool.length === 0
    ) {
        return null;
    }

    const index = Math.floor(
        Math.random() * pool.length
    );

    return pool[index];
}


function getUpgradeChoices(
    count = 3,
    pool = BASIC_UPGRADE_POOL
) {

    const available = [...pool];
    const choices = [];

    while (
        choices.length < count &&
        available.length > 0
    ) {

        const index = Math.floor(
            Math.random() * available.length
        );

        choices.push(
            available.splice(index, 1)[0]
        );
    }

    return choices;
}


/* ============================================================
   UPGRADE DESCRIPTION
============================================================ */

function getUpgradeDescription(upgradeId) {

    const upgrade =
        getUpgradeData(upgradeId);

    if (!upgrade) {
        return "";
    }

    return upgrade.description;
}


/* ============================================================
   APPLY AND CLAMP
============================================================ */

function applyUpgradeAndClamp(
    stats,
    upgradeId
) {

    applyUpgrade(
        stats,
        upgradeId
    );

    if (
        typeof clampWeaponStats ===
        "function"
    ) {
        clampWeaponStats(stats);
    }

    return stats;
}


/* ============================================================
   RUN UPGRADE HISTORY
============================================================ */

let acquiredUpgrades = [];


function resetAcquiredUpgrades() {

    acquiredUpgrades = [];
}


function acquireUpgrade(upgradeId) {

    const upgrade =
        getUpgradeData(upgradeId);

    if (!upgrade) {
        return false;
    }

    acquiredUpgrades.push(
        upgradeId
    );

    applyUpgradeAndClamp(
        currentWeapon,
        upgradeId
    );

    return true;
}


/* ============================================================
   WEAPON BUILD NAME
============================================================ */

function getBuildName(stats) {

    if (
        stats.chainLightning &&
        stats.rocketPods > 0
    ) {
        return "STORM ROCKET";
    }

    if (
        stats.explosive &&
        stats.piercing
    ) {
        return "DETONATION CANNON";
    }

    if (
        stats.freezing &&
        stats.chainLightning
    ) {
        return "FROZEN STORM";
    }

    if (
        stats.rocketPods > 0 &&
        stats.explosive
    ) {
        return "ROCKET DESTROYER";
    }

    if (
        stats.barrelCount >= 3 &&
        stats.fireRate >= 4
    ) {
        return "BULLET STORM";
    }

    if (
        stats.piercing &&
        stats.barrelCount >= 2
    ) {
        return "PIERCING MINIGUN";
    }

    if (
        stats.explosive
    ) {
        return "EXPLOSIVE CANNON";
    }

    if (
        stats.freezing
    ) {
        return "CRYO BLASTER";
    }

    if (
        stats.chainLightning
    ) {
        return "LIGHTNING BLASTER";
    }

    if (
        stats.rocketPods > 0
    ) {
        return "ROCKET BLASTER";
    }

    if (
        stats.barrelCount >= 3
    ) {
        return "TRIPLE BLASTER";
    }

    if (
        stats.barrelCount >= 2
    ) {
        return "TWIN BLASTER";
    }

    if (
        stats.fireRate >= 3
    ) {
        return "RAPID BLASTER";
    }

    return "BASIC BLASTER";
}