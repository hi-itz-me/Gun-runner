/* ============================================================
   GUN RUNNER
   BULLET SYSTEM
============================================================ */

const bullets = [];


/* ============================================================
   BULLET ID
============================================================ */

let nextBulletId = 1;


/* ============================================================
   BULLET CREATION
============================================================ */

function createBullet(
    position,
    direction,
    stats,
    damage
) {

    const geometry =
        new THREE.SphereGeometry(
            stats.bulletSize,
            8,
            8
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: stats.color
        });

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.position.copy(
        position
    );

    if (
        typeof scene !== "undefined" &&
        scene
    ) {

        scene.add(mesh);
    }

    const bullet = {

        id: nextBulletId++,

        mesh: mesh,

        position: mesh.position,

        direction:
            direction.clone()
                .normalize(),

        speed:
            stats.bulletSpeed,

        damage:
            damage,

        size:
            stats.bulletSize,

        range:
            stats.range,

        distanceTravelled: 0,

        explosive:
            stats.explosive,

        explosiveRadius:
            stats.explosiveRadius,

        piercing:
            stats.piercing,

        pierceCount:
            stats.pierceCount,

        hits: [],

        freezing:
            stats.freezing,

        freezeAmount:
            stats.freezeAmount,

        chainLightning:
            stats.chainLightning,

        chainCount:
            stats.chainCount,

        alive: true
    };

    bullets.push(
        bullet
    );

    return bullet;
}


/* ============================================================
   BULLET SPAWN
============================================================ */

function fireBullet(
    position,
    direction,
    stats
) {

    const damage =
        calculateWeaponDamage(
            stats
        );

    return createBullet(
        position,
        direction,
        stats,
        damage
    );
}


/* ============================================================
   MULTI-SHOT
============================================================ */

function fireWeaponProjectiles(
    position,
    direction,
    stats
) {

    const projectileCount =
        Math.max(
            1,
            stats.projectileCount
        );

    const spread =
        stats.spread || 0;

    const baseAngle =
        Math.atan2(
            direction.x,
            direction.z
        );

    for (
        let i = 0;
        i < projectileCount;
        i++
    ) {

        let angle =
            baseAngle;

        if (
            projectileCount > 1
        ) {

            const center =
                (projectileCount - 1) / 2;

            angle +=
                (i - center) *
                spread;
        }

        const shotDirection =
            new THREE.Vector3(
                Math.sin(angle),
                direction.y,
                Math.cos(angle)
            ).normalize();

        fireBullet(
            position,
            shotDirection,
            stats
        );
    }
}


/* ============================================================
   BULLET UPDATE
============================================================ */

function updateBullets(
    delta
) {

    for (
        let i = bullets.length - 1;
        i >= 0;
        i--
    ) {

        const bullet =
            bullets[i];

        if (
            !bullet ||
            !bullet.alive
        ) {

            removeBulletAt(i);

            continue;
        }

        const movement =
            bullet.direction
                .clone()
                .multiplyScalar(
                    bullet.speed *
                    delta
                );

        bullet.mesh.position.add(
            movement
        );

        bullet.distanceTravelled +=
            movement.length();

        /*
         * Enemy collisions.
         */

        if (
            typeof enemies !==
            "undefined" &&
            Array.isArray(enemies)
        ) {

            for (
                let e = 0;
                e < enemies.length;
                e++
            ) {

                const enemy =
                    enemies[e];

                if (
                    checkBulletEnemyCollision(
                        bullet,
                        enemy
                    )
                ) {

                    handleBulletEnemyHit(
                        bullet,
                        enemy
                    );

                    if (!bullet.alive) {
                        break;
                    }
                }
            }
        }

        if (!bullet.alive) {

            removeBulletAt(i);

            continue;
        }

        if (
            bullet.distanceTravelled >=
            bullet.range
        ) {

            destroyBullet(
                bullet
            );
        }
    }
}


/* ============================================================
   BULLET COLLISION
============================================================ */

function checkBulletEnemyCollision(
    bullet,
    enemy
) {

    if (
        !bullet ||
        !enemy ||
        !enemy.mesh ||
        !bullet.alive
    ) {

        return false;
    }

    if (
        bullet.hits.includes(
            enemy
        )
    ) {

        return false;
    }

    const distance =
        bullet.mesh.position.distanceTo(
            enemy.mesh.position
        );

    const enemyRadius =
        enemy.radius || 0.5;

    return (
        distance <=
        bullet.size +
        enemyRadius
    );
}


/* ============================================================
   BULLET → ENEMY HIT
============================================================ */

function handleBulletEnemyHit(
    bullet,
    enemy
) {

    if (
        !bullet ||
        !enemy ||
        !bullet.alive
    ) {

        return;
    }

    bullet.hits.push(
        enemy
    );

    /*
     * Normal damage.
     */

    if (
        typeof damageEnemy ===
        "function"
    ) {

        damageEnemy(
            enemy,
            bullet.damage
        );
    }

    /*
     * Freeze.
     */

    if (
        bullet.freezing &&
        typeof applyEnemyFreeze ===
        "function"
    ) {

        applyEnemyFreeze(
            enemy,
            bullet.freezeAmount,
            2.5
        );
    }

    /*
     * Explosion.
     */

    if (
        bullet.explosive
    ) {

        createExplosion(
            bullet.mesh.position,
            bullet.explosiveRadius,
            bullet.damage
        );
    }

    /*
     * Chain lightning.
     */

    if (
        bullet.chainLightning
    ) {

        triggerChainLightning(
            enemy,
            bullet.chainCount,
            bullet.damage
        );
    }

    /*
     * Piercing.
     */

    if (
        bullet.piercing &&
        bullet.hits.length <=
            bullet.pierceCount
    ) {

        return;
    }

    destroyBullet(
        bullet
    );
}


/* ============================================================
   EXPLOSION
============================================================ */

function createExplosion(
    position,
    radius,
    damage
) {

    if (
        typeof createExplosionEffect ===
        "function"
    ) {

        createExplosionEffect(
            position,
            radius
        );
    }

    if (
        typeof enemies ===
        "undefined"
    ) {

        return;
    }

    for (
        const enemy of enemies
    ) {

        if (
            !enemy ||
            enemy.health <= 0 ||
            !enemy.mesh
        ) {

            continue;
        }

        const distance =
            position.distanceTo(
                enemy.mesh.position
            );

        if (
            distance <= radius
        ) {

            const falloff =
                Math.max(
                    0.2,
                    1 -
                    (
                        distance /
                        radius
                    )
                );

            if (
                typeof damageEnemy ===
                "function"
            ) {

                damageEnemy(
                    enemy,
                    Math.round(
                        damage *
                        falloff
                    )
                );
            }
        }
    }
}


/* ============================================================
   CHAIN LIGHTNING
============================================================ */

function triggerChainLightning(
    sourceEnemy,
    chainCount,
    damage
) {

    if (
        typeof enemies ===
        "undefined"
    ) {

        return;
    }

    const candidates =
        enemies
            .filter(
                enemy =>
                    enemy &&
                    enemy !==
                        sourceEnemy &&
                    enemy.health > 0 &&
                    enemy.mesh
            )
            .sort(
                (a, b) => {

                    const da =
                        sourceEnemy.mesh
                            .position
                            .distanceTo(
                                a.mesh.position
                            );

                    const db =
                        sourceEnemy.mesh
                            .position
                            .distanceTo(
                                b.mesh.position
                            );

                    return da - db;
                }
            );

    let previous =
        sourceEnemy;

    const maxTargets =
        Math.min(
            chainCount,
            candidates.length
        );

    for (
        let i = 0;
        i < maxTargets;
        i++
    ) {

        const target =
            candidates[i];

        const chainDamage =
            Math.round(
                damage *
                Math.pow(
                    0.65,
                    i + 1
                )
            );

        if (
            typeof damageEnemy ===
            "function"
        ) {

            damageEnemy(
                target,
                chainDamage
            );
        }

        if (
            typeof createLightningEffect ===
            "function"
        ) {

            createLightningEffect(
                previous.mesh.position,
                target.mesh.position
            );
        }

        previous =
            target;
    }
}


/* ============================================================
   BULLET REMOVAL
============================================================ */

function destroyBullet(
    bullet
) {

    if (!bullet) {
        return;
    }

    bullet.alive =
        false;

    if (
        bullet.mesh &&
        bullet.mesh.parent
    ) {

        bullet.mesh.parent.remove(
            bullet.mesh
        );
    }
}


function removeBulletAt(
    index
) {

    const bullet =
        bullets[index];

    if (
        bullet &&
        bullet.mesh &&
        bullet.mesh.parent
    ) {

        bullet.mesh.parent.remove(
            bullet.mesh
        );
    }

    bullets.splice(
        index,
        1
    );
}


/* ============================================================
   CLEAR BULLETS
============================================================ */

function clearBullets() {

    for (
        const bullet of bullets
    ) {

        if (
            bullet.mesh &&
            bullet.mesh.parent
        ) {

            bullet.mesh.parent.remove(
                bullet.mesh
            );
        }
    }

    bullets.length = 0;
}


/* ============================================================
   BULLET COUNT
============================================================ */

function getBulletCount() {

    return bullets.length;
}