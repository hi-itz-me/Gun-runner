/* ============================================================
   GUN RUNNER
   BOSS DATA
============================================================ */

const BOSS_DATA = {

    SCRAP_TITAN: {
        id: "scrap_titan",
        name: "SCRAP TITAN",

        maxHealth: 5000,

        phaseCount: 3,

        radius: 3.8,

        moveSpeed: 1.2,

        contactDamage: 35,

        reward: 1000,

        color: 0x777777,

        phases: [

            {
                healthThreshold: 0.70,

                attackInterval: 2.5,

                attacks: [
                    "slam",
                    "charge",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.40,

                attackInterval: 1.8,

                attacks: [
                    "slam",
                    "charge",
                    "summon",
                    "projectile"
                ]
            },

            {
                healthThreshold: 0,

                attackInterval: 1.2,

                attacks: [
                    "charge",
                    "summon",
                    "projectile",
                    "rage"
                ]
            }

        ]
    },


    VOID_BEAST: {
        id: "void_beast",
        name: "VOID BEAST",

        maxHealth: 7500,

        phaseCount: 3,

        radius: 4.5,

        moveSpeed: 1.5,

        contactDamage: 45,

        reward: 1500,

        color: 0x6633aa,

        phases: [

            {
                healthThreshold: 0.70,

                attackInterval: 2.4,

                attacks: [
                    "claw",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.40,

                attackInterval: 1.7,

                attacks: [
                    "claw",
                    "dash",
                    "summon",
                    "void_orb"
                ]
            },

            {
                healthThreshold: 0,

                attackInterval: 1.0,

                attacks: [
                    "dash",
                    "void_orb",
                    "summon",
                    "rage"
                ]
            }

        ]
    },


    WAR_MACHINE: {
        id: "war_machine",
        name: "WAR MACHINE",

        maxHealth: 10000,

        phaseCount: 4,

        radius: 5.0,

        moveSpeed: 1.0,

        contactDamage: 55,

        reward: 2500,

        color: 0xcc3333,

        phases: [

            {
                healthThreshold: 0.75,

                attackInterval: 2.5,

                attacks: [
                    "machine_gun",
                    "missile"
                ]
            },

            {
                healthThreshold: 0.50,

                attackInterval: 2.0,

                attacks: [
                    "machine_gun",
                    "missile",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.25,

                attackInterval: 1.5,

                attacks: [
                    "missile",
                    "laser",
                    "summon"
                ]
            },

            {
                healthThreshold: 0,

                attackInterval: 0.9,

                attacks: [
                    "laser",
                    "missile",
                    "machine_gun",
                    "rage"
                ]
            }

        ]
    },


    DRAGON_CORE: {
        id: "dragon_core",
        name: "DRAGON CORE",

        maxHealth: 15000,

        phaseCount: 4,

        radius: 5.5,

        moveSpeed: 1.3,

        contactDamage: 70,

        reward: 5000,

        color: 0xff5522,

        phases: [

            {
                healthThreshold: 0.75,

                attackInterval: 2.4,

                attacks: [
                    "fireball",
                    "wing_attack"
                ]
            },

            {
                healthThreshold: 0.50,

                attackInterval: 1.9,

                attacks: [
                    "fireball",
                    "wing_attack",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.25,

                attackInterval: 1.4,

                attacks: [
                    "fireball",
                    "meteor",
                    "summon"
                ]
            },

            {
                healthThreshold: 0,

                attackInterval: 0.8,

                attacks: [
                    "meteor",
                    "fireball",
                    "wing_attack",
                    "rage"
                ]
            }

        ]
    },


    FINAL_OVERLORD: {
        id: "final_overlord",
        name: "THE OVERLORD",

        maxHealth: 30000,

        phaseCount: 5,

        radius: 6.5,

        moveSpeed: 1.1,

        contactDamage: 100,

        reward: 10000,

        color: 0xff2244,

        phases: [

            {
                healthThreshold: 0.80,

                attackInterval: 2.5,

                attacks: [
                    "laser",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.60,

                attackInterval: 2.0,

                attacks: [
                    "laser",
                    "missile",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.40,

                attackInterval: 1.5,

                attacks: [
                    "laser",
                    "missile",
                    "spread",
                    "summon"
                ]
            },

            {
                healthThreshold: 0.20,

                attackInterval: 1.2,

                attacks: [
                    "laser",
                    "missile",
                    "spread",
                    "charge",
                    "summon"
                ]
            },

            {
                healthThreshold: 0,

                attackInterval: 0.9,

                attacks: [
                    "laser",
                    "missile",
                    "spread",
                    "charge",
                    "rage"
                ]
            }

        ]
    }
};


/* ============================================================
   ATTACK LIBRARY
   Maps the attack names used in BOSS_DATA phases to the
   attack types implemented in js/boss.js.
============================================================ */

const BOSS_ATTACK_LIBRARY = {

    slam: {
        type: "AREA",
        radius: 4.5
    },

    charge: {
        type: "CHARGE",
        distance: 5
    },

    dash: {
        type: "CHARGE",
        distance: 7
    },

    summon: {
        type: "BURST",
        count: 4
    },

    projectile: {
        type: "PROJECTILE"
    },

    missile: {
        type: "BURST",
        count: 3
    },

    rage: {
        type: "SPREAD",
        count: 7
    },

    spread: {
        type: "SPREAD",
        count: 5
    },

    claw: {
        type: "SPREAD",
        count: 3
    },

    void_orb: {
        type: "PROJECTILE",
        damageMultiplier: 1.4
    },

    fireball: {
        type: "PROJECTILE",
        damageMultiplier: 1.25
    },

    wing_attack: {
        type: "AREA",
        radius: 5
    },

    laser: {
        type: "LASER"
    }
};


/* ============================================================
   DATA ACCESS
============================================================ */

function getBossData(bossId) {

    return BOSS_DATA[bossId] || null;
}


function createBossStats(bossId) {

    const source =
        getBossData(bossId);

    if (!source) {
        return null;
    }

    const data = JSON.parse(
        JSON.stringify(source)
    );

    return {

        id: data.id,

        name: data.name,

        health: data.maxHealth,

        damage: data.contactDamage,

        speed: data.moveSpeed,

        size: data.radius,

        phases: data.phaseCount,

        reward: data.reward,

        color: data.color,

        phaseData: data.phases
    };
}


/* ============================================================
   DIFFICULTY SCALING
============================================================ */

function scaleBossStats(
    stats,
    level = 1
) {

    if (!stats) {
        return null;
    }

    const multiplier =
        1 + ((level - 1) * 0.15);

    stats.health =
        Math.round(stats.health * multiplier);

    stats.damage =
        Math.round(
            stats.damage *
            Math.min(multiplier, 2.5)
        );

    stats.reward =
        Math.round(
            stats.reward *
            (1 + ((level - 1) * 0.1))
        );

    return stats;
}


/* ============================================================
   PHASE HELPERS
============================================================ */

function getBossPhaseData(
    bossId,
    phase = 1
) {

    const data =
        getBossData(bossId);

    if (!data ||
        !Array.isArray(data.phases) ||
        data.phases.length === 0) {

        return null;
    }

    const index =
        Math.max(
            0,
            Math.min(
                data.phases.length - 1,
                phase - 1
            )
        );

    return data.phases[index];
}


function getBossPhaseForHealth(
    bossId,
    healthPercent
) {

    const data =
        getBossData(bossId);

    if (!data ||
        !Array.isArray(data.phases) ||
        data.phases.length === 0) {

        return 1;
    }

    for (let i = 0; i < data.phases.length; i++) {

        if (healthPercent >
            data.phases[i].healthThreshold) {

            return i + 1;
        }
    }

    return data.phases.length;
}


/* ============================================================
   ATTACK SELECTION
============================================================ */

function getBossAttack(
    bossId,
    phase = 1,
    attackIndex = 0
) {

    const phaseData =
        getBossPhaseData(
            bossId,
            phase
        );

    if (!phaseData ||
        !Array.isArray(phaseData.attacks) ||
        phaseData.attacks.length === 0) {

        return null;
    }

    const name =
        phaseData.attacks[
            attackIndex %
            phaseData.attacks.length
        ];

    const definition =
        BOSS_ATTACK_LIBRARY[name] ||
        { type: "PROJECTILE" };

    return {

        ...definition,

        name: name
    };
}


function getBossAttackInterval(
    bossId,
    phase = 1
) {

    const phaseData =
        getBossPhaseData(
            bossId,
            phase
        );

    if (!phaseData) {
        return 2;
    }

    return phaseData.attackInterval || 2;
}


/* ============================================================
   REWARDS
============================================================ */

function getBossReward(
    bossObject
) {

    if (!bossObject) {
        return null;
    }

    const coins =
        bossObject.stats &&
        bossObject.stats.reward
            ? bossObject.stats.reward
            : (
                getBossData(bossObject.id)?.reward ||
                500
            );

    return {

        coins: coins,

        score: coins * 10
    };
}