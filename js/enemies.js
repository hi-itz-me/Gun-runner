/* ============================================================
   GUN RUNNER
   ENEMY SYSTEM
============================================================ */

let enemies = [];
let nextEnemyId = 1;

let activeWave = null;


/* ============================================================
   ENEMY CONFIGURATION
============================================================ */

const ENEMY_CONFIG = {

    spawnZ: -32,

    despawnZ: 15,

    laneWidth: 2.4,

    laneCount: 5,

    baseY: 0.65,

    separation: 1.25,

    maxEnemies: 120,

    spawnInterval: 0.12
};


/* ============================================================
   CREATE ENEMY
============================================================ */

function createEnemy(
    enemyId,
    position,
    levelMultiplier = 1
) {

    if (
        typeof createEnemyStats !==
        "function"
    ) {
        return null;
    }

    const baseStats =
        createEnemyStats(
            enemyId
        );

    if (!baseStats) {
        return null;
    }

    const stats =
        typeof scaleEnemyStats ===
        "function"
            ? scaleEnemyStats(
                baseStats,
                levelMultiplier
            )
            : baseStats;

    const enemy = {

        id:
            nextEnemyId++,

        type:
            enemyId,

        name:
            stats.name ||
            enemyId,

        health:
            stats.health,

        maxHealth:
            stats.health,

        damage:
            stats.damage || 5,

        speed:
            stats.speed || 2,

        size:
            stats.size || 1,

        reward:
            stats.reward || 1,

        score:
            stats.score || 10,

        attackRange:
            stats.attackRange || 2,

        attackCooldown:
            stats.attackCooldown || 1,

        attackTimer:
            Math.random(),

        state:
            "RUNNING",

        alive:
            true,

        frozen:
            false,

        freezeTimer:
            0,

        shield:
            stats.shield || 0,

        maxShield:
            stats.shield || 0,

        mesh:
            null,

        healthBar:
            null,

        targetX:
            position.x,

        velocity:
            new THREE.Vector3(),

        hitFlash:
            0,

        deathTimer:
            0,

        lane:
            0,

        stats:
            stats
    };


    enemy.mesh =
        createEnemyMesh(
            enemy
        );

    enemy.mesh.position.copy(
        position
    );


    if (
        typeof scene !==
        "undefined"
    ) {

        scene.add(
            enemy.mesh
        );
    }


    enemies.push(
        enemy
    );

    return enemy;
}


/* ============================================================
   CREATE ENEMY MESH
============================================================ */

function createEnemyMesh(
    enemy
) {

    const group =
        new THREE.Group();


    const color =
        getEnemyColor(
            enemy.type
        );


    /*
     * Main body.
     */

    const bodyGeometry =
        new THREE.BoxGeometry(
            enemy.size,
            enemy.size * 1.15,
            enemy.size
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                color,

            metalness:
                0.25,

            roughness:
                0.65
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y =
        enemy.size *
        0.6;

    group.add(
        body
    );


    /*
     * Head.
     */

    const headGeometry =
        new THREE.SphereGeometry(
            enemy.size * 0.42,
            10,
            10
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({

            color:
                color,

            metalness:
                0.2,

            roughness:
                0.6
        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y =
        enemy.size *
        1.35;

    group.add(
        head
    );


    /*
     * Eyes.
     */

    const eyeGeometry =
        new THREE.SphereGeometry(
            enemy.size * 0.09,
            8,
            8
        );

    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });


    const leftEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    leftEye.position.set(
        -enemy.size * 0.16,
        enemy.size * 1.38,
        -enemy.size * 0.35
    );

    group.add(
        leftEye
    );


    const rightEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    rightEye.position.set(
        enemy.size * 0.16,
        enemy.size * 1.38,
        -enemy.size * 0.35
    );

    group.add(
        rightEye
    );


    /*
     * Shield.
     */

    if (
        enemy.maxShield > 0
    ) {

        const shieldGeometry =
            new THREE.SphereGeometry(
                enemy.size * 0.85,
                16,
                16
            );

        const shieldMaterial =
            new THREE.MeshBasicMaterial({

                color:
                    0x55aaff,

                transparent:
                    true,

                opacity:
                    0.25,

                wireframe:
                    true
            });

        const shield =
            new THREE.Mesh(
                shieldGeometry,
                shieldMaterial
            );

        shield.name =
            "shield";

        shield.position.y =
            enemy.size *
            0.75;

        group.add(
            shield
        );
    }


    /*
     * Health bar.
     */

    const healthGroup =
        createEnemyHealthBar(
            enemy
        );

    if (
        healthGroup
    ) {

        healthGroup.position.y =
            enemy.size *
            2;

        group.add(
            healthGroup
        );

        enemy.healthBar =
            healthGroup;
    }


    return group;
}


/* ============================================================
   ENEMY COLORS
============================================================ */

function getEnemyColor(
    type
) {

    const colors = {

        BASIC:
            0xff5555,

        DRONE:
            0xff7777,

        FAST:
            0xffcc33,

        RUNNER:
            0xffaa22,

        TANK:
            0x777777,

        SHOOTER:
            0xcc55ff,

        SWARM:
            0xff8844,

        ELITE:
            0x55aaff,

        SHIELDED:
            0x4488ff,

        BERSERKER:
            0xff3333,

        MINI_BOSS:
            0xaa55ff
    };

    return (
        colors[type] ||
        0xff5555
    );
}


/* ============================================================
   HEALTH BAR
============================================================ */

function createEnemyHealthBar(
    enemy
) {

    const group =
        new THREE.Group();


    const backgroundGeometry =
        new THREE.PlaneGeometry(
            enemy.size * 1.3,
            0.12
        );

    const backgroundMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x111111,

            transparent:
                true,

            opacity:
                0.8,

            side:
                THREE.DoubleSide
        });

    const background =
        new THREE.Mesh(
            backgroundGeometry,
            backgroundMaterial
        );

    group.add(
        background
    );


    const healthGeometry =
        new THREE.PlaneGeometry(
            enemy.size * 1.25,
            0.08
        );

    const healthMaterial =
        new THREE.MeshBasicMaterial({

            color:
                0x44ff66,

            side:
                THREE.DoubleSide
        });

    const health =
        new THREE.Mesh(
            healthGeometry,
            healthMaterial
        );

    health.position.z =
        0.01;

    health.name =
        "health";

    group.add(
        health
    );


    return group;
}


/* ============================================================
   UPDATE HEALTH BAR
============================================================ */

function updateEnemyHealthBar(
    enemy
) {

    if (
        !enemy.healthBar
    ) {
        return;
    }

    const healthMesh =
        enemy.healthBar.getObjectByName(
            "health"
        );

    if (
        !healthMesh
    ) {
        return;
    }

    const percent =
        Math.max(
            0,
            Math.min(
                1,
                enemy.health /
                enemy.maxHealth
            )
        );

    healthMesh.scale.x =
        percent;

    healthMesh.position.x =
        -(
            1 -
            percent
        ) *
        enemy.size *
        0.625;

    if (
        percent <= 0.3
    ) {

        healthMesh.material.color.setHex(
            0xff3333
        );

    } else if (
        percent <= 0.6
    ) {

        healthMesh.material.color.setHex(
            0xffcc33
        );

    } else {

        healthMesh.material.color.setHex(
            0x44ff66
        );
    }


    /*
     * Always face camera.
     */

    if (
        typeof camera !==
        "undefined"
    ) {

        enemy.healthBar.quaternion.copy(
            camera.quaternion
        );
    }
}


/* ============================================================
   SPAWN WAVE
============================================================ */

function spawnEnemyWave(
    waveNumber = 1,
    levelNumber = 1
) {

    if (
        typeof generateWaveComposition !==
        "function"
    ) {

        return null;
    }

    const levelData =
        typeof getLevelData ===
        "function"
            ? getLevelData(
                levelNumber
            )
            : null;

    const composition =
        generateWaveComposition(
            waveNumber,
            levelData
        );


    activeWave = {

        number:
            waveNumber,

        level:
            levelNumber,

        composition:
            composition,

        spawned:
            0,

        defeated:
            0,

        spawnTimer:
            0,

        complete:
            false,

        started:
            true
    };


    return activeWave;
}


/* ============================================================
   SPAWN ENEMY FROM WAVE
============================================================ */

function spawnEnemyFromWave() {

    if (
        !activeWave ||
        activeWave.complete
    ) {
        return null;
    }

    if (
        activeWave.spawned >=
        activeWave.composition.length
    ) {

        activeWave.complete =
            true;

        return null;
    }

    if (
        enemies.length >=
        ENEMY_CONFIG.maxEnemies
    ) {

        return null;
    }


    const enemyData =
        activeWave.composition[
            activeWave.spawned
        ];


    const lane =
        getRandomLane();


    const x =
        lane *
        ENEMY_CONFIG.laneWidth;


    const z =
        ENEMY_CONFIG.spawnZ -
        Math.random() *
        4;


    const levelMultiplier =
        getEnemyLevelMultiplier(
            activeWave.level,
            activeWave.number
        );


    const enemy =
        createEnemy(
            enemyData.id ||
                enemyData.type ||
                enemyData,
            new THREE.Vector3(
                x,
                ENEMY_CONFIG.baseY,
                z
            ),
            levelMultiplier
        );


    if (enemy) {

        enemy.lane =
            lane;

        activeWave.spawned++;
    }


    return enemy;
}


/* ============================================================
   RANDOM LANE
============================================================ */

function getRandomLane() {

    const half =
        Math.floor(
            ENEMY_CONFIG.laneCount /
            2
        );

    return (
        Math.floor(
            Math.random() *
            ENEMY_CONFIG.laneCount
        ) -
        half
    );
}


/* ============================================================
   LEVEL MULTIPLIER
============================================================ */

function getEnemyLevelMultiplier(
    level,
    wave
) {

    return (
        1 +
        (Math.max(
            0,
            level - 1
        ) *
        0.12) +
        (Math.max(
            0,
            wave - 1
        ) *
        0.05)
    );
}


/* ============================================================
   UPDATE ENEMIES
============================================================ */

function updateEnemies(
    delta
) {

    updateWaveSpawning(
        delta
    );

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        const enemy =
            enemies[i];

        if (
            !enemy
        ) {
            continue;
        }


        if (
            !enemy.alive
        ) {

            updateDeadEnemy(
                enemy,
                delta
            );

            continue;
        }


        updateEnemyStatus(
            enemy,
            delta
        );


        updateEnemyMovement(
            enemy,
            delta
        );


        updateEnemyAttack(
            enemy,
            delta
        );


        updateEnemyEffects(
            enemy,
            delta
        );


        updateEnemyHealthBar(
            enemy
        );


        /*
         * Enemy reached player.
         */

        if (
            player &&
            enemy.mesh
        ) {

            const distance =
                enemy.mesh.position
                    .distanceTo(
                        player.position
                    );

            if (
                distance <
                1.5
            ) {

                enemyAttackPlayer(
                    enemy
                );
            }
        }


        /*
         * Remove enemies that
         * passed the player.
         */

        if (
            enemy.mesh &&
            enemy.mesh.position.z >
            ENEMY_CONFIG.despawnZ
        ) {

            removeEnemyAt(
                i
            );
        }
    }


    updateEnemySeparation();
}


/* ============================================================
   WAVE SPAWNING
============================================================ */

function updateWaveSpawning(
    delta
) {

    if (
        !activeWave ||
        activeWave.complete
    ) {
        return;
    }

    activeWave.spawnTimer +=
        delta;


    while (
        activeWave.spawnTimer >=
        ENEMY_CONFIG.spawnInterval
    ) {

        activeWave.spawnTimer -=
            ENEMY_CONFIG.spawnInterval;

        const spawned =
            spawnEnemyFromWave();

        if (
            !spawned
        ) {
            break;
        }
    }


    if (
        activeWave.spawned >=
            activeWave.composition.length &&
        getAliveEnemyCount() === 0
    ) {

        activeWave.complete =
            true;
    }
}


/* ============================================================
   ENEMY MOVEMENT
============================================================ */

function updateEnemyMovement(
    enemy,
    delta
) {

    if (
        !enemy.mesh ||
        !player
    ) {
        return;
    }


    const speed =
        typeof getEnemyEffectiveSpeed ===
        "function"
            ? getEnemyEffectiveSpeed(
                enemy
            )
            : enemy.speed;


    /*
     * Move toward player.
     */

    const target =
        player.position;


    const direction =
        new THREE.Vector3(
            target.x -
                enemy.mesh.position.x,

            0,

            target.z -
                enemy.mesh.position.z
        );


    const distance =
        direction.length();


    if (
        distance > 1.35
    ) {

        direction.normalize();

        enemy.mesh.position.x +=
            direction.x *
            speed *
            delta;

        enemy.mesh.position.z +=
            direction.z *
            speed *
            delta;
    }


    /*
     * Face player.
     */

    enemy.mesh.lookAt(
        player.position.x,
        enemy.mesh.position.y,
        player.position.z
    );
}


/* ============================================================
   ENEMY ATTACK
============================================================ */

function updateEnemyAttack(
    enemy,
    delta
) {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }


    enemy.attackTimer -=
        delta;


    if (
        enemy.attackTimer > 0
    ) {
        return;
    }


    const distance =
        enemy.mesh.position
            .distanceTo(
                player.position
            );


    if (
        distance <=
        enemy.attackRange + 1
    ) {

        enemyAttackPlayer(
            enemy
        );

        enemy.attackTimer =
            enemy.attackCooldown;
    }
}


/* ============================================================
   ATTACK PLAYER
============================================================ */

function enemyAttackPlayer(
    enemy
) {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }


    const damage =
        typeof calculateEnemyDamage ===
        "function"
            ? calculateEnemyDamage(
                enemy
            )
            : enemy.damage;


    if (
        typeof damagePlayer ===
        "function"
    ) {

        damagePlayer(
            damage,
            enemy
        );
    }


    /*
     * Attack animation.
     */

    if (
        enemy.mesh
    ) {

        enemy.mesh.position.z -=
            0.15;

        setTimeout(
            () => {

                if (
                    enemy.mesh
                ) {

                    enemy.mesh.position.z +=
                        0.15;
                }

            },
            100
        );
    }
}


/* ============================================================
   DAMAGE ENEMY
============================================================ */

function damageEnemy(
    enemy,
    damage,
    source = null
) {

    if (
        !enemy ||
        !enemy.alive
    ) {
        return false;
    }


    let finalDamage =
        Math.max(
            0,
            damage
        );


    /*
     * Shield absorbs damage first.
     */

    if (
        enemy.shield > 0
    ) {

        const absorbed =
            Math.min(
                enemy.shield,
                finalDamage
            );

        enemy.shield -=
            absorbed;

        finalDamage -=
            absorbed;


        if (
            typeof createImpactEffect ===
            "function" &&
            enemy.mesh
        ) {

            createImpactEffect(
                enemy.mesh.position.clone(),
                0x55aaff
            );
        }
    }


    /*
     * Remaining damage hits health.
     */

    if (
        finalDamage > 0
    ) {

        enemy.health -=
            finalDamage;
    }


    enemy.hitFlash =
        0.08;


    /*
     * Damage number.
     */

    if (
        typeof createDamageNumber ===
        "function" &&
        enemy.mesh
    ) {

        createDamageNumber(
            enemy.mesh.position.clone()
                .add(
                    new THREE.Vector3(
                        0,
                        1.8,
                        0
                    )
                ),
            Math.round(
                finalDamage
            )
        );
    }


    /*
     * Hit effect.
     */

    if (
        typeof createImpactEffect ===
        "function" &&
        enemy.mesh
    ) {

        createImpactEffect(
            enemy.mesh.position.clone(),
            currentWeapon &&
            currentWeapon.color
                ? currentWeapon.color
                : 0xffffff
        );
    }


    /*
     * Enemy death.
     */

    if (
        enemy.health <= 0
    ) {

        killEnemy(
            enemy,
            source
        );
    }


    return true;
}


/* ============================================================
   KILL ENEMY
============================================================ */

function killEnemy(
    enemy,
    source = null
) {

    if (
        !enemy ||
        !enemy.alive
    ) {
        return;
    }


    enemy.alive =
        false;

    enemy.state =
        "DEAD";

    enemy.deathTimer =
        0;


    /*
     * Reward player.
     */

    if (
        typeof addPlayerCoins ===
        "function"
    ) {

        const reward =
            typeof getEnemyReward ===
            "function"
                ? getEnemyReward(
                    enemy
                )
                : enemy.reward;

        addPlayerCoins(
            reward
        );
    }


    if (
        typeof addPlayerScore ===
        "function"
    ) {

        addPlayerScore(
            enemy.score
        );
    }


    if (
        typeof registerPlayerKill ===
        "function"
    ) {

        registerPlayerKill();
    }


    if (
        activeWave
    ) {

        activeWave.defeated++;
    }


    /*
     * Death effect.
     */

    if (
        typeof createExplosionEffect ===
        "function" &&
        enemy.mesh
    ) {

        createExplosionEffect(
            enemy.mesh.position.clone(),
            Math.max(
                0.6,
                enemy.size
            )
        );
    }


    if (
        typeof createDamageNumber ===
        "function" &&
        enemy.mesh
    ) {

        createDamageNumber(
            enemy.mesh.position.clone()
                .add(
                    new THREE.Vector3(
                        0,
                        1.5,
                        0
                    )
                ),
            "+" +
            enemy.reward
        );
    }


    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.04,
            0.05
        );
    }
}


/* ============================================================
   DEAD ENEMY ANIMATION
============================================================ */

function updateDeadEnemy(
    enemy,
    delta
) {

    if (
        !enemy.mesh
    ) {
        return;
    }


    enemy.deathTimer +=
        delta;


    enemy.mesh.scale.multiplyScalar(
        Math.max(
            0,
            1 -
            delta *
            3
        )
    );


    enemy.mesh.rotation.z +=
        delta *
        5;


    enemy.mesh.position.y +=
        delta *
        0.8;


    if (
        enemy.deathTimer >
        0.45
    ) {

        const index =
            enemies.indexOf(
                enemy
            );

        if (
            index >= 0
        ) {

            removeEnemyAt(
                index
            );
        }
    }
}


/* ============================================================
   STATUS
============================================================ */

function updateEnemyStatus(
    enemy,
    delta
) {

    if (
        typeof updateEnemyStatus !==
        "function"
    ) {
        return;
    }

    /*
     * This function intentionally
     * uses the data-layer status
     * function when available.
     */

    if (
        enemy.freezeTimer >
        0
    ) {

        enemy.freezeTimer -=
            delta;

        enemy.frozen =
            true;

    } else {

        enemy.frozen =
            false;
    }
}


/* ============================================================
   ENEMY EFFECTS
============================================================ */

function updateEnemyEffects(
    enemy,
    delta
) {

    if (
        !enemy.mesh
    ) {
        return;
    }


    /*
     * Hit flash.
     */

    if (
        enemy.hitFlash > 0
    ) {

        enemy.hitFlash -=
            delta;

        const body =
            enemy.mesh.children[0];

        if (
            body &&
            body.material
        ) {

            body.material.emissive.setHex(
                0xffffff
            );

            body.material.emissiveIntensity =
                0.7;
        }

    } else {

        const body =
            enemy.mesh.children[0];

        if (
            body &&
            body.material
        ) {

            body.material.emissiveIntensity =
                0;
        }
    }


    /*
     * Frozen visual.
     */

    if (
        enemy.frozen
    ) {

        enemy.mesh.scale.set(
            1.05,
            1.05,
            1.05
        );

    } else {

        enemy.mesh.scale.set(
            1,
            1,
            1
        );
    }
}


/* ============================================================
   ENEMY SEPARATION
============================================================ */

function updateEnemySeparation() {

    for (
        let i = 0;
        i < enemies.length;
        i++
    ) {

        const a =
            enemies[i];

        if (
            !a ||
            !a.alive ||
            !a.mesh
        ) {
            continue;
        }


        for (
            let j = i + 1;
            j < enemies.length;
            j++
        ) {

            const b =
                enemies[j];

            if (
                !b ||
                !b.alive ||
                !b.mesh
            ) {
                continue;
            }


            const dx =
                b.mesh.position.x -
                a.mesh.position.x;

            const dz =
                b.mesh.position.z -
                a.mesh.position.z;


            const distance =
                Math.sqrt(
                    dx * dx +
                    dz * dz
                );


            if (
                distance > 0 &&
                distance <
                ENEMY_CONFIG.separation
            ) {

                const push =
                    (
                        ENEMY_CONFIG.separation -
                        distance
                    ) *
                    0.03;


                a.mesh.position.x -=
                    (
                        dx /
                        distance
                    ) *
                    push;

                b.mesh.position.x +=
                    (
                        dx /
                        distance
                    ) *
                    push;
            }
        }
    }
}


/* ============================================================
   FREEZE ENEMY
============================================================ */

function freezeEnemy(
    enemy,
    duration
) {

    if (
        !enemy ||
        !enemy.alive
    ) {
        return;
    }

    enemy.freezeTimer =
        Math.max(
            enemy.freezeTimer || 0,
            duration
        );

    enemy.frozen =
        true;


    if (
        typeof createFreezeEffect ===
        "function" &&
        enemy.mesh
    ) {

        createFreezeEffect(
            enemy.mesh.position.clone(),
            enemy.size
        );
    }
}


/* ============================================================
   CLEAR ENEMIES
============================================================ */

function clearEnemies() {

    for (
        let i = enemies.length - 1;
        i >= 0;
        i--
    ) {

        removeEnemyAt(
            i
        );
    }

    enemies = [];

    activeWave =
        null;

    nextEnemyId =
        1;
}


/* ============================================================
   REMOVE ENEMY
============================================================ */

function removeEnemyAt(
    index
) {

    if (
        index < 0 ||
        index >= enemies.length
    ) {
        return;
    }

    const enemy =
        enemies[index];


    if (
        enemy.mesh &&
        typeof scene !==
        "undefined"
    ) {

        scene.remove(
            enemy.mesh
        );
    }


    enemies.splice(
        index,
        1
    );
}


/* ============================================================
   ENEMY COUNTS
============================================================ */

function getAliveEnemyCount() {

    return enemies.filter(
        enemy =>
            enemy &&
            enemy.alive
    ).length;
}


function getTotalEnemyCount() {

    return enemies.length;
}


/* ============================================================
   WAVE STATE
============================================================ */

function isWaveComplete() {

    if (
        !activeWave
    ) {
        return true;
    }

    return (
        activeWave.complete &&
        getAliveEnemyCount() === 0
    );
}


function getActiveWave() {

    return activeWave;
}


/* ============================================================
   GET ENEMY
============================================================ */

function getEnemyById(
    id
) {

    return enemies.find(
        enemy =>
            enemy.id === id
    ) || null;
}


/* ============================================================
   GET NEAREST ENEMY
============================================================ */

function getNearestEnemy(
    position
) {

    let nearest =
        null;

    let nearestDistance =
        Infinity;


    for (
        const enemy of enemies
    ) {

        if (
            !enemy ||
            !enemy.alive ||
            !enemy.mesh
        ) {
            continue;
        }


        const distance =
            position.distanceTo(
                enemy.mesh.position
            );


        if (
            distance <
            nearestDistance
        ) {

            nearest =
                enemy;

            nearestDistance =
                distance;
        }
    }


    return nearest;
}


/* ============================================================
   GET ENEMIES IN RADIUS
============================================================ */

function getEnemiesInRadius(
    position,
    radius
) {

    return enemies.filter(
        enemy => {

            if (
                !enemy ||
                !enemy.alive ||
                !enemy.mesh
            ) {

                return false;
            }

            return (
                position.distanceTo(
                    enemy.mesh.position
                ) <=
                radius
            );
        }
    );
}