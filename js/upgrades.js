/* ============================================================
   GUN RUNNER
   UPGRADE SYSTEM
============================================================ */

let upgradeChoices = [];
let acquiredRunUpgrades = [];


/* ============================================================
   UPGRADE STATE
============================================================ */

function initializeUpgradeSystem() {

    upgradeChoices = [];
    acquiredRunUpgrades = [];

    if (
        typeof resetAcquiredUpgrades ===
        "function"
    ) {

        resetAcquiredUpgrades();
    }
}


/* ============================================================
   GENERATE CHOICES
============================================================ */

function generateUpgradeChoices(
    count = 3,
    pool = null
) {

    if (
        typeof getUpgradeChoices !==
        "function"
    ) {

        return [];
    }

    upgradeChoices =
        getUpgradeChoices(
            count,
            pool
        );

    return upgradeChoices;
}


/* ============================================================
   CHOOSE UPGRADE
============================================================ */

function chooseUpgrade(
    upgradeId
) {

    if (
        !upgradeId
    ) {
        return false;
    }

    if (
        typeof getUpgradeData !==
        "function"
    ) {
        return false;
    }

    const upgrade =
        getUpgradeData(
            upgradeId
        );

    if (!upgrade) {
        return false;
    }

    /*
     * Apply the upgrade to
     * the current weapon.
     */

    if (
        typeof applyUpgradeAndClamp ===
        "function"
    ) {

        applyUpgradeAndClamp(
            upgradeId
        );

    } else if (
        typeof acquireUpgrade ===
        "function"
    ) {

        acquireUpgrade(
            upgradeId
        );
    }

    acquiredRunUpgrades.push(
        upgradeId
    );

    /*
     * Rebuild the physical gun.
     */

    if (
        typeof refreshGun ===
        "function"
    ) {

        refreshGun();
    }

    /*
     * Update HUD.
     */

    if (
        typeof updateWeaponUI ===
        "function"
    ) {

        updateWeaponUI();
    }

    /*
     * Remove selected upgrade
     * from active choices.
     */

    upgradeChoices =
        upgradeChoices.filter(
            choice =>
                choice.id !==
                upgradeId
        );

    return true;
}


/* ============================================================
   RANDOM UPGRADE
============================================================ */

function chooseRandomUpgrade(
    pool = null
) {

    if (
        typeof getRandomUpgradeId !==
        "function"
    ) {

        return null;
    }

    const id =
        getRandomUpgradeId(
            pool
        );

    if (
        chooseUpgrade(id)
    ) {

        return id;
    }

    return null;
}


/* ============================================================
   UPGRADE DESCRIPTION
============================================================ */

function getUpgradeCardData(
    upgradeId
) {

    if (
        typeof getUpgradeData !==
        "function"
    ) {

        return null;
    }

    const data =
        getUpgradeData(
            upgradeId
        );

    if (!data) {
        return null;
    }

    return {

        id:
            data.id,

        name:
            data.name,

        description:
            typeof getUpgradeDescription ===
            "function"
                ? getUpgradeDescription(
                    upgradeId
                )
                : data.description,

        icon:
            data.icon ||
            "⬆️",

        rarity:
            data.rarity ||
            "common"
    };
}


/* ============================================================
   OPEN UPGRADE SELECTION
============================================================ */

function openUpgradeSelection(
    count = 3,
    pool = null
) {

    upgradeChoices =
        generateUpgradeChoices(
            count,
            pool
        );

    if (
        typeof showUpgradeSelection ===
        "function"
    ) {

        showUpgradeSelection(
            upgradeChoices
        );
    }

    return upgradeChoices;
}


/* ============================================================
   CLOSE UPGRADE SELECTION
============================================================ */

function closeUpgradeSelection() {

    if (
        typeof hideUpgradeSelection ===
        "function"
    ) {

        hideUpgradeSelection();
    }
}


/* ============================================================
   UPGRADE AFTER WAVE
============================================================ */

function offerWaveUpgrade(
    waveNumber
) {

    let pool =
        null;

    /*
     * Early waves:
     * basic upgrades.
     */

    if (
        waveNumber <= 2
    ) {

        pool =
            typeof BASIC_UPGRADE_POOL !==
            "undefined"
                ? BASIC_UPGRADE_POOL
                : null;

    /*
     * Middle waves:
     * advanced upgrades.
     */

    } else if (
        waveNumber <= 5
    ) {

        pool =
            typeof ADVANCED_UPGRADE_POOL !==
            "undefined"
                ? ADVANCED_UPGRADE_POOL
                : null;

    /*
     * Later waves:
     * special upgrades.
     */

    } else {

        pool =
            typeof SPECIAL_UPGRADE_POOL !==
            "undefined"
                ? SPECIAL_UPGRADE_POOL
                : null;
    }

    return openUpgradeSelection(
        3,
        pool
    );
}


/* ============================================================
   UPGRADE AFTER GATE
============================================================ */

function offerGateUpgrade() {

    return openUpgradeSelection(
        3
    );
}


/* ============================================================
   GET CURRENT BUILD
============================================================ */

function getCurrentBuild() {

    if (
        typeof currentWeapon ===
        "undefined"
    ) {

        return null;
    }

    return {

        weapon:
            currentWeapon,

        upgrades:
            [
                ...acquiredRunUpgrades
            ],

        buildName:
            typeof getBuildName ===
            "function"
                ? getBuildName()
                : "Custom Build"
    };
}


/* ============================================================
   BUILD SUMMARY
============================================================ */

function getBuildSummary() {

    const build =
        getCurrentBuild();

    if (!build) {
        return "Basic Gun";
    }

    let summary =
        build.buildName;

    if (
        build.upgrades.length > 0
    ) {

        summary +=
            " • " +
            build.upgrades.length +
            " upgrades";
    }

    return summary;
}


/* ============================================================
   RESET RUN UPGRADES
============================================================ */

function resetRunUpgrades() {

    acquiredRunUpgrades = [];

    if (
        typeof resetAcquiredUpgrades ===
        "function"
    ) {

        resetAcquiredUpgrades();
    }

    /*
     * Rebuild the gun after reset.
     */

    if (
        typeof refreshGun ===
        "function"
    ) {

        refreshGun();
    }
}


/* ============================================================
   PERMANENT UPGRADE PLACEHOLDER
============================================================ */

const permanentUpgrades = {

    damage: 0,
    fireRate: 0,
    health: 0,
    coins: 0,
    startingPower: 0
};


/* ============================================================
   PERMANENT UPGRADE VALUES
============================================================ */

function getPermanentUpgrade(
    type
) {

    return (
        permanentUpgrades[type] ||
        0
    );
}


function addPermanentUpgrade(
    type,
    amount = 1
) {

    if (
        permanentUpgrades[type] ===
        undefined
    ) {

        return false;
    }

    permanentUpgrades[type] +=
        amount;

    return true;
}


/* ============================================================
   APPLY PERMANENT BONUSES
============================================================ */

function applyPermanentBonuses(
    stats
) {

    if (!stats) {
        return stats;
    }

    const result =
        {
            ...stats
        };

    /*
     * Damage bonus.
     */

    result.damage *=
        1 +
        (
            getPermanentUpgrade(
                "damage"
            ) *
            0.05
        );

    /*
     * Fire-rate bonus.
     */

    result.fireRate *=
        1 +
        (
            getPermanentUpgrade(
                "fireRate"
            ) *
            0.04
        );

    return result;
}


/* ============================================================
   UPGRADE RARITY
============================================================ */

function getUpgradeRarityClass(
    upgrade
) {

    if (
        !upgrade
    ) {

        return "common";
    }

    return (
        upgrade.rarity ||
        "common"
    ).toLowerCase();
}


/* ============================================================
   UPGRADE ICON
============================================================ */

function getUpgradeIcon(
    upgrade
) {

    if (
        !upgrade
    ) {

        return "⬆️";
    }

    if (
        upgrade.icon
    ) {

        return upgrade.icon;
    }

    const icons = {

        DAMAGE: "💥",
        RAPID_FIRE: "⚡",
        DOUBLE_BARREL: "🔫",
        TRIPLE_BARREL: "🔫",
        MULTI_SHOT: "✦",
        HEAVY_BULLETS: "🟣",
        FAST_BULLETS: "➤",
        LONG_RANGE: "🎯",
        EXPLOSIVE: "💣",
        BIG_EXPLOSION: "💥",
        PIERCING: "↠",
        EXTRA_PIERCE: "☄️",
        FREEZE: "❄️",
        DEEP_FREEZE: "🧊",
        CHAIN_LIGHTNING: "⚡",
        EXTRA_CHAIN: "🔗",
        ROCKET_POD: "🚀",
        SECOND_ROCKET: "🚀",
        CRITICAL: "🎯",
        CRITICAL_POWER: "💢",
        ACCURACY: "⊙",
        BARREL_OVERDRIVE: "🔥"
    };

    return (
        icons[upgrade.id] ||
        "⬆️"
    );
}


/* ============================================================
   UPGRADE COLOR
============================================================ */

function getUpgradeColor(
    upgrade
) {

    if (
        !upgrade
    ) {

        return 0xffffff;
    }

    const colors = {

        common: 0xffffff,
        uncommon: 0x55ff88,
        rare: 0x55aaff,
        epic: 0xbb66ff,
        legendary: 0xffaa33
    };

    return (
        colors[
            getUpgradeRarityClass(
                upgrade
            )
        ] ||
        0xffffff
    );
}


/* ============================================================
   APPLY UPGRADE WITH EFFECT
============================================================ */

function applyUpgradeWithEffect(
    upgradeId
) {

    const success =
        chooseUpgrade(
            upgradeId
        );

    if (!success) {
        return false;
    }

    /*
     * Visual upgrade effect.
     */

    if (
        typeof createPowerupEffect ===
        "function" &&
        player
    ) {

        createPowerupEffect(
            player.position.clone()
        );
    }

    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.08,
            0.08
        );
    }

    return true;
}


/* ============================================================
   GET ACQUIRED UPGRADES
============================================================ */

function getAcquiredUpgrades() {

    return [
        ...acquiredRunUpgrades
    ];
}


/* ============================================================
   CHECK OWNED UPGRADE
============================================================ */

function hasUpgrade(
    upgradeId
) {

    return acquiredRunUpgrades
        .includes(
            upgradeId
        );
}


/* ============================================================
   UPGRADE COUNT
============================================================ */

function getUpgradeCount() {

    return acquiredRunUpgrades.length;
}


/* ============================================================
   UPGRADE SYSTEM UPDATE
============================================================ */

function updateUpgradeSystem(
    delta
) {

    /*
     * Reserved for future systems:
     *
     * - timed upgrades
     * - temporary buffs
     * - upgrade animations
     * - build synergies
     */

    return delta;
}