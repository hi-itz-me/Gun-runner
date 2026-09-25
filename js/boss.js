/* ============================================================
   GUN RUNNER
   BOSS SYSTEM
============================================================ */

let boss = null;

let bossActive = false;
let bossDefeated = false;

let bossAttackTimer = 0;
let bossAttackIndex = 0;

let bossProjectiles = [];


/* ============================================================
   BOSS CONFIGURATION
============================================================ */

const BOSS_CONFIG = {

    arenaZ: -18,

    arenaWidth: 14,

    arenaDepth: 18,

    defaultHeight: 2.5,

    attackWarningTime: 0.65,

    projectileSpeed: 8,

    contactDistance: 3,

    introDuration: 1.5,

    deathDuration: 2.0
};


/* ============================================================
   CREATE BOSS
============================================================ */

function createBoss(
    bossId,
    level = 1
) {

    if (
        typeof createBossStats !==
        "function"
    ) {
        return null;
    }

    const baseStats =
        createBossStats(
            bossId
        );

    if (!baseStats) {
        return null;
    }

    const stats =
        typeof scaleBossStats ===
        "function"
            ? scaleBossStats(
                baseStats,
                level
            )
            : baseStats;


    boss = {

        id:
            bossId,

        level:
            level,

        name:
            stats.name ||
            bossId,

        health:
            stats.health,

        maxHealth:
            stats.health,

        damage:
            stats.damage || 10,

        speed:
            stats.speed || 2,

        size:
            stats.size || 2.5,

        phase:
            1,

        maxPhase:
            stats.phases ||
            3,

        stats:
            stats,

        mesh:
            null,

        healthBar:
            null,

        phaseText:
            null,

        state:
            "INTRO",

        introTimer:
            BOSS_CONFIG.introDuration,

        deathTimer:
            0,

        hitFlash:
            0,

        attackTimer:
            1,

        attackCooldown:
            2,

        attackIndex:
            0,

        attackWarning:
            false,

        targetX:
            0,

        defeated:
            false
    };


    boss.mesh =
        createBossMesh(
            boss
        );


    if (
        typeof scene !==
        "undefined"
    ) {

        scene.add(
            boss.mesh
        );
    }


    bossActive =
        true;

    bossDefeated =
        false;


    updateBossUI();


    return boss;
}


/* ============================================================
   CREATE BOSS MESH
============================================================ */

function createBossMesh(
    bossObject
) {

    const group =
        new THREE.Group();


    const color =
        getBossColor(
            bossObject.id
        );


    const size =
        bossObject.size;


    /*
     * Main body.
     */

    const bodyGeometry =
        new THREE.BoxGeometry(
            size * 1.35,
            size * 1.5,
            size
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({

            color:
                color,

            metalness:
                0.65,

            roughness:
                0.3
        });


    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y =
        size * 0.8;

    group.add(
        body
    );


    /*
     * Head.
     */

    const headGeometry =
        new THREE.SphereGeometry(
            size * 0.62,
            16,
            16
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({

            color:
                color,

            metalness:
                0.55,

            roughness:
                0.3
        });


    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y =
        size * 1.75;

    group.add(
        head
    );


    /*
     * Boss eyes.
     */

    const eyeGeometry =
        new THREE.SphereGeometry(
            size * 0.12,
            10,
            10
        );

    const eyeMaterial =
        new THREE.MeshBasicMaterial({
            color: 0xffee55
        });


    const leftEye =
        new THREE.Mesh(
            eyeGeometry,
            eyeMaterial
        );

    leftEye.position.set(
        -size * 0.25,
        size * 1.8,
        -size * 0.5
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
        size * 0.25,
        size * 1.8,
        -size * 0.5
    );

    group.add(
        rightEye
    );


    /*
     * Shoulder armor.
     */

    createBossArmor(
        group,
        size,
        color
    );


    /*
     * Energy core.
     */

    const coreGeometry =
        new THREE.SphereGeometry(
            size * 0.25,
            12,
            12
        );

    const coreMaterial =
        new THREE.MeshStandardMaterial({

            color:
                0xffffff,

            emissive:
                color,

            emissiveIntensity:
                2,

            metalness:
                0.2,

            roughness:
                0.2
        });


    const core =
        new THREE.Mesh(
            coreGeometry,
            coreMaterial
        );

    core.position.set(
        0,
        size * 0.9,
        -size * 0.55
    );

    core.name =
        "core";

    group.add(
        core
    );


    /*
     * Health bar.
     */

    const healthBar =
        createBossHealthBar(
            bossObject
        );

    healthBar.position.y =
        size * 3;

    group.add(
        healthBar
    );

    bossObject.healthBar =
        healthBar;


    /*
     * Phase indicator.
     */

    const phaseText =
        createBossPhaseIndicator();

    bossObject.phaseText =
        phaseText;


    group.position.set(
        0,
        0,
        BOSS_CONFIG.arenaZ
    );


    return group;
}


/* ============================================================
   BOSS ARMOR
============================================================ */

function createBossArmor(
    group,
    size,
    color
) {

    const geometry =
        new THREE.SphereGeometry(
            size * 0.45,
            10,
            10
        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                color,

            metalness:
                0.85,

            roughness:
                0.22
        });


    const left =
        new THREE.Mesh(
            geometry,
            material.clone()
        );

    left.scale.set(
        1.4,
        0.8,
        1
    );

    left.position.set(
        -size * 0.8,
        size * 1.2,
        0
    );

    group.add(
        left
    );


    const right =
        new THREE.Mesh(
            geometry,
            material.clone()
        );

    right.scale.set(
        1.4,
        0.8,
        1
    );

    right.position.set(
        size * 0.8,
        size * 1.2,
        0
    );

    group.add(
        right
    );
}


/* ============================================================
   BOSS COLORS
============================================================ */

function getBossColor(
    bossId
) {

    const colors = {

        SCRAP_TITAN:
            0x777777,

        VOID_BEAST:
            0x6633aa,

        WAR_MACHINE:
            0x334455,

        DRAGON_CORE:
            0xcc3322,

        FINAL_OVERLORD:
            0xaa2244
    };

    return (
        colors[bossId] ||
        0x8844ff
    );
}


/* ============================================================
   BOSS HEALTH BAR
============================================================ */

function createBossHealthBar(
    bossObject
) {

    const group =
        new THREE.Group();


    const width =
        bossObject.size *
        2.8;


    const background =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                width,
                0.28
            ),

            new THREE.MeshBasicMaterial({
                color: 0x111111,
                transparent: true,
                opacity: 0.9,
                side: THREE.DoubleSide
            })
        );


    group.add(
        background
    );


    const health =
        new THREE.Mesh(

            new THREE.PlaneGeometry(
                width * 0.98,
                0.22
            ),

            new THREE.MeshBasicMaterial({
                color: 0xff3333,
                side: THREE.DoubleSide
            })
        );


    health.name =
        "health";


    health.position.z =
        0.02;


    group.add(
        health
    );


    return group;
}


/* ============================================================
   BOSS PHASE INDICATOR
============================================================ */

function createBossPhaseIndicator() {

    if (
        typeof document ===
        "undefined"
    ) {
        return null;
    }


    const element =
        document.createElement(
            "div"
        );


    element.className =
        "boss-phase-indicator";


    element.style.position =
        "absolute";


    element.style.left =
        "50%";


    element.style.top =
        "18%";


    element.style.transform =
        "translateX(-50%)";


    element.style.padding =
        "7px 14px";


    element.style.borderRadius =
        "10px";


    element.style.background =
        "rgba(0,0,0,0.7)";


    element.style.color =
        "#ffffff";


    element.style.fontWeight =
        "900";


    element.style.fontSize =
        "14px";


    element.style.pointerEvents =
        "none";


    element.style.zIndex =
        "30";


    element.style.display =
        "none";


    const container =
        document.getElementById(
            "game-container"
        );


    if (
        container
    ) {

        container.appendChild(
            element
        );
    }


    return element;
}


/* ============================================================
   UPDATE BOSS
============================================================ */

function updateBoss(
    delta
) {

    if (
        !boss ||
        !bossActive
    ) {
        return;
    }


    if (
        boss.state ===
        "INTRO"
    ) {

        updateBossIntro(
            delta
        );

        return;
    }


    if (
        boss.state ===
        "DEAD"
    ) {

        updateBossDeath(
            delta
        );

        return;
    }


    updateBossMovement(
        delta
    );


    updateBossAttack(
        delta
    );


    updateBossEffects(
        delta
    );


    updateBossHealthBar();


    updateBossPhase();


    updateBossUI();
}


/* ============================================================
   BOSS INTRO
============================================================ */

function updateBossIntro(
    delta
) {

    boss.introTimer -=
        delta;


    if (
        boss.mesh
    ) {

        const progress =
            Math.max(
                0,
                boss.introTimer /
                BOSS_CONFIG.introDuration
            );


        boss.mesh.position.y =
            (
                1 -
                progress
            ) *
            0.8;


        boss.mesh.scale.setScalar(
            1 -
            progress *
            0.3
        );
    }


    if (
        boss.introTimer <= 0
    ) {

        boss.state =
            "FIGHT";


        if (
            boss.mesh
        ) {

            boss.mesh.position.y =
                0;

            boss.mesh.scale.setScalar(
                1
            );
        }


        if (
            typeof showCenterMessage ===
            "function"
        ) {

            showCenterMessage(
                boss.name,
                900
            );
        }
    }
}


/* ============================================================
   BOSS MOVEMENT
============================================================ */

function updateBossMovement(
    delta
) {

    if (
        !boss.mesh ||
        !player
    ) {
        return;
    }


    const targetX =
        THREE.MathUtils.clamp(
            player.position.x,
            -BOSS_CONFIG.arenaWidth / 2,
            BOSS_CONFIG.arenaWidth / 2
        );


    boss.targetX =
        targetX;


    boss.mesh.position.x =
        THREE.MathUtils.lerp(
            boss.mesh.position.x,
            targetX,
            Math.min(
                1,
                boss.speed *
                delta *
                0.15
            )
        );


    boss.mesh.lookAt(
        player.position.x,
        boss.mesh.position.y,
        player.position.z
    );
}


/* ============================================================
   BOSS ATTACK SYSTEM
============================================================ */

function updateBossAttack(
    delta
) {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }


    boss.attackTimer -=
        delta;


    if (
        boss.attackTimer > 0
    ) {
        return;
    }


    const attack =
        typeof getBossAttack ===
        "function"
            ? getBossAttack(
                boss.id,
                boss.phase,
                boss.attackIndex
            )
            : null;


    executeBossAttack(
        attack
    );


    boss.attackIndex++;


    boss.attackTimer =
        typeof getBossAttackInterval ===
        "function"
            ? getBossAttackInterval(
                boss.id,
                boss.phase
            )
            : boss.attackCooldown;
}


/* ============================================================
   EXECUTE BOSS ATTACK
============================================================ */

function executeBossAttack(
    attack
) {

    if (
        !attack
    ) {

        bossBasicAttack();

        return;
    }


    const type =
        attack.type ||
        attack;


    switch (
        String(type).toUpperCase()
    ) {

        case "PROJECTILE":
            bossProjectileAttack(
                attack
            );
            break;


        case "BURST":
            bossBurstAttack(
                attack
            );
            break;


        case "SPREAD":
            bossSpreadAttack(
                attack
            );
            break;


        case "CHARGE":
            bossChargeAttack(
                attack
            );
            break;


        case "LASER":
            bossLaserAttack(
                attack
            );
            break;


        case "AREA":
        case "AOE":
            bossAreaAttack(
                attack
            );
            break;


        default:
            bossBasicAttack();
            break;
    }
}


/* ============================================================
   BASIC ATTACK
============================================================ */

function bossBasicAttack() {

    if (
        !player
    ) {
        return;
    }


    const direction =
        player.position
            .clone()
            .sub(
                boss.mesh.position
            )
            .normalize();


    spawnBossProjectile(
        boss.mesh.position.clone()
            .add(
                new THREE.Vector3(
                    0,
                    boss.size *
                    0.8,
                    -1
                )
            ),

        direction,

        boss.damage
    );
}


/* ============================================================
   PROJECTILE ATTACK
============================================================ */

function bossProjectileAttack(
    attack
) {

    if (
        !player
    ) {
        return;
    }


    const direction =
        player.position
            .clone()
            .sub(
                boss.mesh.position
            )
            .normalize();


    spawnBossProjectile(
        boss.mesh.position.clone()
            .add(
                new THREE.Vector3(
                    0,
                    boss.size *
                    0.8,
                    -1
                )
            ),

        direction,

        attack.damage ||
            boss.damage
    );
}


/* ============================================================
   BURST ATTACK
============================================================ */

function bossBurstAttack(
    attack
) {

    if (
        !player
    ) {
        return;
    }


    const count =
        attack.count ||
        5;


    const spread =
        attack.spread ||
        0.3;


    const baseDirection =
        player.position
            .clone()
            .sub(
                boss.mesh.position
            )
            .normalize();


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const offset =
            (
                i -
                (count - 1) / 2
            ) *
            spread;


        const direction =
            baseDirection.clone();


        direction.x +=
            offset;


        direction.normalize();


        spawnBossProjectile(
            boss.mesh.position.clone()
                .add(
                    new THREE.Vector3(
                        0,
                        boss.size *
                        0.8,
                        -1
                    )
                ),

            direction,

            attack.damage ||
                boss.damage
        );
    }
}


/* ============================================================
   SPREAD ATTACK
============================================================ */

function bossSpreadAttack(
    attack
) {

    bossBurstAttack(
        {
            ...attack,

            count:
                attack.count ||
                9,

            spread:
                attack.spread ||
                0.22
        }
    );
}


/* ============================================================
   CHARGE ATTACK
============================================================ */

function bossChargeAttack(
    attack
) {

    if (
        !player ||
        !boss.mesh
    ) {
        return;
    }


    const direction =
        player.position
            .clone()
            .sub(
                boss.mesh.position
            );


    direction.y =
        0;


    direction.normalize();


    const distance =
        attack.distance ||
        5;


    boss.mesh.position.add(
        direction.multiplyScalar(
            distance
        )
    );


    const chargeDamage =
        attack.damage ||
        boss.damage *
        1.5;


    const playerDistance =
        boss.mesh.position
            .distanceTo(
                player.position
            );


    if (
        playerDistance <
        BOSS_CONFIG.contactDistance
    ) {

        if (
            typeof damagePlayer ===
            "function"
        ) {

            damagePlayer(
                chargeDamage,
                boss
            );
        }
    }


    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.25,
            0.15
        );
    }
}


/* ============================================================
   LASER ATTACK
============================================================ */

function bossLaserAttack(
    attack
) {

    if (
        !player ||
        !boss.mesh
    ) {
        return;
    }


    const direction =
        player.position
            .clone()
            .sub(
                boss.mesh.position
            )
            .normalize();


    const length =
        attack.range ||
        15;


    const geometry =
        new THREE.CylinderGeometry(
            0.18,
            0.18,
            length,
            10
        );


    const material =
        new THREE.MeshBasicMaterial({
            color:
                0xff2255,

            transparent:
                true,

            opacity:
                0.8
        });


    const laser =
        new THREE.Mesh(
            geometry,
            material
        );


    laser.position.copy(
        boss.mesh.position
    );


    laser.position.y +=
        boss.size *
        0.8;


    laser.lookAt(
        boss.mesh.position.clone()
            .add(
                direction
            )
    );


    laser.rotateX(
        Math.PI / 2
    );


    scene.add(
        laser
    );


    setTimeout(
        () => {

            if (
                laser.parent
            ) {

                laser.parent.remove(
                    laser
                );
            }

        },
        350
    );


    const playerDistance =
        distanceFromLine(
            player.position,
            boss.mesh.position,
            direction
        );


    if (
        playerDistance <
        1
    ) {

        if (
            typeof damagePlayer ===
            "function"
        ) {

            damagePlayer(
                attack.damage ||
                boss.damage *
                1.5,
                boss
            );
        }
    }
}


/* ============================================================
   AREA ATTACK
============================================================ */

function bossAreaAttack(
    attack
) {

    if (
        !player ||
        !boss.mesh
    ) {
        return;
    }


    const radius =
        attack.radius ||
        4;


    const distance =
        boss.mesh.position
            .distanceTo(
                player.position
            );


    if (
        distance <= radius
    ) {

        if (
            typeof damagePlayer ===
            "function"
        ) {

            damagePlayer(
                attack.damage ||
                boss.damage,
                boss
            );
        }
    }


    if (
        typeof createExplosionEffect ===
        "function"
    ) {

        createExplosionEffect(
            boss.mesh.position.clone(),
            radius * 0.7
        );
    }
}


/* ============================================================
   DISTANCE FROM LINE
============================================================ */

function distanceFromLine(
    point,
    origin,
    direction
) {

    const relative =
        point.clone()
            .sub(
                origin
            );


    const projection =
        relative.dot(
            direction
        );


    const closest =
        origin.clone()
            .add(
                direction.clone()
                    .multiplyScalar(
                        projection
                    )
            );


    return point.distanceTo(
        closest
    );
}


/* ============================================================
   BOSS PROJECTILE
============================================================ */

function spawnBossProjectile(
    position,
    direction,
    damage
) {

    const geometry =
        new THREE.SphereGeometry(
            0.18,
            10,
            10
        );


    const material =
        new THREE.MeshStandardMaterial({

            color:
                0xff3355,

            emissive:
                0x550011,

            emissiveIntensity:
                1
        });


    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );


    mesh.position.copy(
        position
    );


    scene.add(
        mesh
    );


    bossProjectiles.push({

        mesh:
            mesh,

        direction:
            direction.clone()
                .normalize(),

        speed:
            BOSS_CONFIG.projectileSpeed,

        damage:
            damage,

        life:
            5
    });
}


/* ============================================================
   UPDATE PROJECTILES
============================================================ */

function updateBossProjectiles(
    delta
) {

    for (
        let i =
            bossProjectiles.length - 1;
        i >= 0;
        i--
    ) {

        const projectile =
            bossProjectiles[i];


        if (
            !projectile ||
            !projectile.mesh
        ) {

            bossProjectiles.splice(
                i,
                1
            );

            continue;
        }


        projectile.mesh.position.add(
            projectile.direction
                .clone()
                .multiplyScalar(
                    projectile.speed *
                    delta
                )
        );


        projectile.life -=
            delta;


        if (
            player &&
            player.alive
        ) {

            const distance =
                projectile.mesh.position
                    .distanceTo(
                        player.position
                    );


            if (
                distance < 0.9
            ) {

                if (
                    typeof damagePlayer ===
                    "function"
                ) {

                    damagePlayer(
                        projectile.damage,
                        boss
                    );
                }


                removeBossProjectile(
                    i
                );

                continue;
            }
        }


        if (
            projectile.life <= 0
        ) {

            removeBossProjectile(
                i
            );
        }
    }
}


/* ============================================================
   REMOVE PROJECTILE
============================================================ */

function removeBossProjectile(
    index
) {

    if (
        index < 0 ||
        index >= bossProjectiles.length
    ) {
        return;
    }


    const projectile =
        bossProjectiles[index];


    if (
        projectile.mesh &&
        projectile.mesh.parent
    ) {

        projectile.mesh.parent.remove(
            projectile.mesh
        );
    }


    bossProjectiles.splice(
        index,
        1
    );
}


/* ============================================================
   DAMAGE BOSS
============================================================ */

function damageBossEntity(
    damage,
    source = null
) {

    if (
        !boss ||
        !bossActive ||
        boss.defeated ||
        boss.state === "DEAD"
    ) {
        return false;
    }


    const amount =
        Math.max(
            0,
            damage
        );


    boss.health -=
        amount;


    boss.hitFlash =
        0.08;


    if (
        typeof createBossHitEffect ===
        "function" &&
        boss.mesh
    ) {

        const hitPosition =
            boss.mesh.position.clone();

        hitPosition.y +=
            boss.size;

        createBossHitEffect(
            hitPosition
        );
    }


    if (
        boss.health <= 0
    ) {

        boss.health =
            0;

        startBossDeath();
    }


    if (
        typeof updateBossUI ===
        "function"
    ) {

        updateBossUI(
            boss
        );
    }


    return true;
}


/* ============================================================
   BOSS DEATH
============================================================ */

function startBossDeath() {

    if (
        !boss ||
        boss.state === "DEAD"
    ) {
        return;
    }


    boss.state =
        "DEAD";

    boss.deathTimer =
        BOSS_CONFIG.deathDuration;


    clearBossProjectiles();


    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.5,
            0.4
        );
    }


    if (
        typeof createExplosionEffect ===
        "function" &&
        boss.mesh
    ) {

        createExplosionEffect(
            boss.mesh.position.clone(),
            boss.size
        );
    }


    if (
        typeof showCenterMessage ===
        "function"
    ) {

        showCenterMessage(
            boss.name + " DEFEATED",
            1500
        );
    }
}


function updateBossDeath(
    delta
) {

    boss.deathTimer -=
        delta;


    if (
        boss.mesh
    ) {

        const progress =
            Math.max(
                0,
                boss.deathTimer /
                BOSS_CONFIG.deathDuration
            );


        boss.mesh.scale.setScalar(
            Math.max(
                0.001,
                progress
            )
        );


        boss.mesh.position.y =
            -(1 - progress) *
            boss.size *
            0.6;


        boss.mesh.rotation.y +=
            delta * 3;
    }


    if (
        boss.deathTimer <= 0 &&
        !boss.defeated
    ) {

        boss.defeated =
            true;

        bossActive =
            false;


        if (
            boss.mesh &&
            boss.mesh.parent
        ) {

            boss.mesh.parent.remove(
                boss.mesh
            );
        }


        if (
            typeof onBossDefeated ===
            "function"
        ) {

            onBossDefeated(
                boss
            );
        }
    }
}


/* ============================================================
   BOSS VISUAL EFFECTS
============================================================ */

function updateBossEffects(
    delta
) {

    if (
        !boss
    ) {
        return;
    }


    updateBossProjectiles(
        delta
    );


    updateBossBulletCollisions();


    if (
        boss.hitFlash > 0
    ) {

        boss.hitFlash =
            Math.max(
                0,
                boss.hitFlash - delta
            );
    }


    if (
        !boss.mesh
    ) {
        return;
    }


    const flashing =
        boss.hitFlash > 0;


    boss.mesh.traverse(
        function (child) {

            if (
                !child.isMesh ||
                !child.material ||
                !child.material.emissive
            ) {
                return;
            }


            if (
                child.userData.baseEmissive ===
                undefined
            ) {

                child.userData.baseEmissive =
                    child.material.emissive.getHex();
            }


            child.material.emissive.setHex(
                flashing
                    ? 0xffffff
                    : child.userData.baseEmissive
            );
        }
    );
}


/* ============================================================
   BULLET → BOSS COLLISIONS
============================================================ */

function updateBossBulletCollisions() {

    if (
        !boss ||
        !boss.mesh ||
        !bossActive ||
        boss.state !== "FIGHT" ||
        typeof bullets ===
        "undefined"
    ) {
        return;
    }


    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];


        if (
            !bullet ||
            !bullet.alive ||
            !bullet.mesh
        ) {
            continue;
        }


        const bossCenter =
            boss.mesh.position.clone();

        bossCenter.y +=
            boss.size;


        const distance =
            bullet.mesh.position.distanceTo(
                bossCenter
            );


        if (
            distance >
            bullet.size + boss.size
        ) {
            continue;
        }


        damageBossEntity(
            bullet.damage,
            bullet
        );


        if (
            typeof destroyBullet ===
            "function"
        ) {

            destroyBullet(
                bullet
            );
        }
    }
}


/* ============================================================
   HEALTH BAR
============================================================ */

function updateBossHealthBar() {

    if (
        !boss ||
        !boss.healthBar
    ) {
        return;
    }


    const percent =
        Math.max(
            0,
            Math.min(
                1,
                boss.health /
                Math.max(
                    1,
                    boss.maxHealth
                )
            )
        );


    const fill =
        boss.healthBar.getObjectByName(
            "health"
        );


    if (
        fill
    ) {

        fill.scale.x =
            Math.max(
                0.001,
                percent
            );


        const width =
            boss.size *
            2.8 *
            0.98;


        fill.position.x =
            -(width * (1 - percent)) / 2;
    }


    if (
        typeof camera !==
        "undefined" &&
        camera
    ) {

        boss.healthBar.lookAt(
            camera.position
        );
    }
}


/* ============================================================
   PHASE TRANSITIONS
============================================================ */

function updateBossPhase() {

    if (
        !boss ||
        boss.state !== "FIGHT"
    ) {
        return;
    }


    const percent =
        boss.health /
        Math.max(
            1,
            boss.maxHealth
        );


    const targetPhase =
        typeof getBossPhaseForHealth ===
        "function"
            ? getBossPhaseForHealth(
                boss.id,
                percent
            )
            : boss.phase;


    if (
        targetPhase <= boss.phase
    ) {
        return;
    }


    boss.phase =
        targetPhase;

    boss.attackIndex =
        0;

    boss.attackTimer =
        Math.min(
            boss.attackTimer,
            0.8
        );


    if (
        typeof showCenterMessage ===
        "function"
    ) {

        showCenterMessage(
            "PHASE " + boss.phase,
            900
        );
    }


    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.3,
            0.25
        );
    }
}


/* ============================================================
   FIGHT MANAGEMENT
============================================================ */

function startBossFight(
    bossId
) {

    resetBoss();


    const level =
        typeof getCurrentLevel ===
        "function"
            ? getCurrentLevel()
            : 1;


    return createBoss(
        bossId,
        level
    );
}


function isBossDefeated() {

    return !!(
        boss &&
        boss.defeated
    );
}


function getBossEntity() {

    return boss;
}


/* ============================================================
   CLEANUP
============================================================ */

function clearBossProjectiles() {

    for (
        let i = bossProjectiles.length - 1;
        i >= 0;
        i--
    ) {

        removeBossProjectile(
            i
        );
    }

    bossProjectiles =
        [];
}


function resetBoss() {

    clearBossProjectiles();


    if (
        boss &&
        boss.mesh &&
        boss.mesh.parent
    ) {

        boss.mesh.parent.remove(
            boss.mesh
        );
    }


    boss =
        null;

    bossActive =
        false;

    bossDefeated =
        false;

    bossAttackTimer =
        0;

    bossAttackIndex =
        0;
}