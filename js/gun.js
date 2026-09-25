/* ============================================================
   GUN RUNNER
   GUN SYSTEM
============================================================ */

let gun = null;


/* ============================================================
   GUN DEFAULTS
============================================================ */

const GUN_DEFAULTS = {

    width: 0.55,
    height: 0.55,
    length: 1.8,

    barrelLength: 1.15,
    barrelRadius: 0.13,

    rotationSpeed: 8,

    recoilAmount: 0.08,

    recoilTimer: 0,

    muzzleOffset: 1.0
};


/* ============================================================
   CREATE GUN
============================================================ */

function createGun() {

    gun = {

        ...GUN_DEFAULTS,

        group:
            new THREE.Group(),

        barrels: [],

        body: null,

        muzzlePositions: [],

        currentRotation: 0,

        targetRotation: 0
    };

    if (
        player &&
        player.gunMesh
    ) {

        player.gunMesh.add(
            gun.group
        );
    }

    rebuildGunVisual();

    return gun;
}


/* ============================================================
   GUN BODY
============================================================ */

function createGunBody() {

    const geometry =
        new THREE.BoxGeometry(
            gun.width,
            gun.height,
            gun.length
        );

    const material =
        new THREE.MeshStandardMaterial({
            color:
                currentWeapon.color,

            metalness: 0.7,
            roughness: 0.3
        });

    const body =
        new THREE.Mesh(
            geometry,
            material
        );

    body.position.z =
        -0.15;

    gun.group.add(
        body
    );

    gun.body =
        body;
}


/* ============================================================
   BARREL CREATION
============================================================ */

function createGunBarrel(
    offsetX = 0,
    offsetY = 0
) {

    const geometry =
        new THREE.CylinderGeometry(
            gun.barrelRadius,
            gun.barrelRadius,
            gun.barrelLength,
            12
        );

    const material =
        new THREE.MeshStandardMaterial({
            color:
                currentWeapon.color,

            metalness: 0.8,
            roughness: 0.25
        });

    const barrel =
        new THREE.Mesh(
            geometry,
            material
        );

    /*
     * Cylinder is vertical by default.
     * Rotate it toward the forward Z axis.
     */

    barrel.rotation.x =
        Math.PI / 2;

    barrel.position.set(
        offsetX,
        offsetY,
        -1.15
    );

    gun.group.add(
        barrel
    );

    gun.barrels.push(
        barrel
    );

    gun.muzzlePositions.push(
        new THREE.Vector3(
            offsetX,
            offsetY,
            -1.75
        )
    );

    return barrel;
}


/* ============================================================
   BARREL LAYOUT
============================================================ */

function getBarrelOffsets(
    count
) {

    const offsets = [];

    if (count <= 1) {

        offsets.push(
            [0, 0]
        );

    } else if (count === 2) {

        offsets.push(
            [-0.22, 0]
        );

        offsets.push(
            [0.22, 0]
        );

    } else if (count === 3) {

        offsets.push(
            [-0.25, 0]
        );

        offsets.push(
            [0.25, 0]
        );

        offsets.push(
            [0, 0.22]
        );

    } else {

        const radius =
            0.28;

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const angle =
                (
                    i /
                    count
                ) *
                Math.PI *
                2;

            offsets.push([
                Math.cos(angle) *
                    radius,

                Math.sin(angle) *
                    radius
            ]);
        }
    }

    return offsets;
}


/* ============================================================
   REBUILD GUN
============================================================ */

function rebuildGunVisual() {

    if (
        !gun ||
        !gun.group
    ) {
        return;
    }

    /*
     * Remove previous gun parts.
     */

    while (
        gun.group.children.length
    ) {

        gun.group.remove(
            gun.group.children[0]
        );
    }

    gun.barrels = [];
    gun.muzzlePositions = [];

    createGunBody();

    const barrelCount =
        Math.max(
            1,
            Math.floor(
                currentWeapon.barrelCount
            )
        );

    const offsets =
        getBarrelOffsets(
            barrelCount
        );

    for (
        const offset of offsets
    ) {

        createGunBarrel(
            offset[0],
            offset[1]
        );
    }

    addGunAttachments();

    updateGunColor();
}


/* ============================================================
   ATTACHMENTS
============================================================ */

function addGunAttachments() {

    /*
     * Explosive module.
     */

    if (
        currentWeapon.explosive
    ) {

        const geometry =
            new THREE.SphereGeometry(
                0.25,
                10,
                10
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0xff5522,
                emissive: 0x552200,
                metalness: 0.5,
                roughness: 0.3
            });

        const module =
            new THREE.Mesh(
                geometry,
                material
            );

        module.position.set(
            0,
            0.35,
            -0.15
        );

        gun.group.add(
            module
        );
    }


    /*
     * Freeze module.
     */

    if (
        currentWeapon.freezing
    ) {

        const geometry =
            new THREE.BoxGeometry(
                0.35,
                0.35,
                0.35
            );

        const material =
            new THREE.MeshStandardMaterial({
                color: 0x66ddff,
                emissive: 0x113344,
                transparent: true,
                opacity: 0.9
            });

        const module =
            new THREE.Mesh(
                geometry,
                material
            );

        module.position.set(
            0,
            -0.35,
            -0.1
        );

        gun.group.add(
            module
        );
    }


    /*
     * Lightning module.
     */

    if (
        currentWeapon.chainLightning
    ) {

        const geometry =
            new THREE.TorusGeometry(
                0.28,
                0.06,
                8,
                20
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: 0x9c88ff
            });

        const ring =
            new THREE.Mesh(
                geometry,
                material
            );

        ring.rotation.x =
            Math.PI / 2;

        ring.position.z =
            -0.75;

        gun.group.add(
            ring
        );
    }


    /*
     * Rocket pods.
     */

    if (
        currentWeapon.rocketPods > 0
    ) {

        for (
            let i = 0;
            i <
                currentWeapon.rocketPods;
            i++
        ) {

            const side =
                i % 2 === 0
                    ? -1
                    : 1;

            const geometry =
                new THREE.CylinderGeometry(
                    0.14,
                    0.14,
                    0.75,
                    10
                );

            const material =
                new THREE.MeshStandardMaterial({
                    color: 0xff4433,
                    metalness: 0.7,
                    roughness: 0.25
                });

            const rocket =
                new THREE.Mesh(
                    geometry,
                    material
                );

            rocket.rotation.x =
                Math.PI / 2;

            rocket.position.set(
                side *
                    (0.5 +
                        Math.floor(
                            i / 2
                        ) *
                        0.25),

                -0.15,

                -0.55
            );

            gun.group.add(
                rocket
            );
        }
    }
}


/* ============================================================
   GUN COLOR
============================================================ */

function updateGunColor() {

    if (
        !gun
    ) {
        return;
    }

    const color =
        currentWeapon.color ||
        0xffffff;

    if (
        gun.body &&
        gun.body.material
    ) {

        gun.body.material.color.setHex(
            color
        );
    }

    for (
        const barrel
        of gun.barrels
    ) {

        if (
            barrel.material
        ) {

            barrel.material.color.setHex(
                color
            );
        }
    }
}


/* ============================================================
   GUN UPDATE
============================================================ */

function updateGun(
    delta
) {

    if (!gun) {
        return;
    }

    /*
     * Recoil recovery.
     */

    if (
        gun.recoilTimer > 0
    ) {

        gun.recoilTimer -=
            delta;

        const progress =
            Math.max(
                0,
                gun.recoilTimer /
                0.08
            );

        gun.group.position.z =
            progress *
            gun.recoilAmount;

    } else {

        gun.group.position.z =
            0;
    }

    /*
     * Smooth rotation.
     */

    gun.currentRotation =
        THREE.MathUtils.lerp(
            gun.currentRotation,
            gun.targetRotation,
            Math.min(
                1,
                gun.rotationSpeed *
                delta
            )
        );

    gun.group.rotation.y =
        gun.currentRotation;
}


/* ============================================================
   GUN AIM
============================================================ */

function aimGunAt(
    target
) {

    if (
        !gun ||
        !target ||
        !player
    ) {
        return;
    }

    const direction =
        target.clone()
            .sub(
                player.position
            );

    gun.targetRotation =
        Math.atan2(
            direction.x,
            -direction.z
        );
}


/* ============================================================
   GUN FIRE
============================================================ */

function fireGun(
    playerObject,
    stats,
    direction
) {

    if (
        !gun ||
        !playerObject
    ) {
        return;
    }

    const projectileCount =
        Math.max(
            1,
            stats.projectileCount
        );

    const spread =
        stats.spread || 0;

    const barrelCount =
        Math.max(
            1,
            gun.muzzlePositions.length
        );

    for (
        let i = 0;
        i < barrelCount;
        i++
    ) {

        const muzzle =
            gun.muzzlePositions[i];

        const worldPosition =
            muzzle.clone();

        gun.group.localToWorld(
            worldPosition
        );

        let barrelDirection =
            direction.clone();

        /*
         * Multi-projectile spread.
         */

        if (
            projectileCount > 1
        ) {

            for (
                let p = 0;
                p < projectileCount;
                p++
            ) {

                const center =
                    (
                        projectileCount - 1
                    ) / 2;

                const spreadOffset =
                    (
                        p - center
                    ) *
                    spread;

                const shotDirection =
                    new THREE.Vector3(
                        Math.sin(
                            spreadOffset
                        ),
                        0,
                        -Math.cos(
                            spreadOffset
                        )
                    ).normalize();

                fireBullet(
                    worldPosition,
                    shotDirection,
                    stats
                );
            }

        } else {

            fireBullet(
                worldPosition,
                barrelDirection,
                stats
            );
        }

        /*
         * Muzzle flash.
         */

        if (
            typeof createMuzzleFlash ===
            "function"
        ) {

            createMuzzleFlash(
                worldPosition,
                stats.color
            );
        }
    }

    /*
     * Recoil.
     */

    gun.recoilAmount =
        Math.max(
            0.02,
            stats.recoil ||
            GUN_DEFAULTS.recoilAmount
        );

    gun.recoilTimer =
        0.08;

    /*
     * Automatic rocket pods.
     */

    fireRocketPods(
        playerObject,
        stats
    );
}


/* ============================================================
   ROCKET PODS
============================================================ */

function fireRocketPods(
    playerObject,
    stats
) {

    if (
        !stats.rocketPods ||
        stats.rocketPods <= 0
    ) {
        return;
    }

    if (
        typeof enemies ===
        "undefined" ||
        enemies.length === 0
    ) {
        return;
    }

    const targets =
        enemies
            .filter(
                enemy =>
                    enemy &&
                    enemy.health > 0 &&
                    enemy.mesh
            )
            .sort(
                (a, b) => {

                    const da =
                        playerObject.position
                            .distanceTo(
                                a.mesh.position
                            );

                    const db =
                        playerObject.position
                            .distanceTo(
                                b.mesh.position
                            );

                    return da - db;
                }
            );

    const count =
        Math.min(
            stats.rocketPods,
            targets.length
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const target =
            targets[i];

        const direction =
            target.mesh.position
                .clone()
                .sub(
                    playerObject.position
                )
                .normalize();

        const position =
            playerObject.position
                .clone();

        position.y +=
            1;

        position.z -=
            0.5;

        const rocketStats = {

            ...stats,

            damage:
                stats.damage *
                1.5,

            bulletSpeed:
                stats.bulletSpeed *
                0.65,

            bulletSize:
                stats.bulletSize *
                1.5,

            range:
                stats.range *
                1.2,

            explosive: true,

            explosiveRadius:
                Math.max(
                    stats.explosiveRadius,
                    4.5
                ),

            projectileCount: 1,

            spread: 0
        };

        fireBullet(
            position,
            direction,
            rocketStats
        );
    }
}


/* ============================================================
   APPLY WEAPON CHANGE
============================================================ */

function refreshGun() {

    if (
        !gun
    ) {
        createGun();
        return;
    }

    rebuildGunVisual();
}


/* ============================================================
   RESET GUN
============================================================ */

function resetGun() {

    if (
        gun &&
        gun.group &&
        gun.group.parent
    ) {

        gun.group.parent.remove(
            gun.group
        );
    }

    gun = null;

    createGun();
}


/* ============================================================
   GUN INFO
============================================================ */

function getGunBarrelCount() {

    if (!gun) {
        return 0;
    }

    return gun.barrels.length;
}


function getGunMuzzlePosition(
    index = 0
) {

    if (
        !gun ||
        gun.muzzlePositions.length === 0
    ) {

        return null;
    }

    const safeIndex =
        Math.max(
            0,
            Math.min(
                index,
                gun.muzzlePositions.length - 1
            )
        );

    const position =
        gun.muzzlePositions[
            safeIndex
        ].clone();

    gun.group.localToWorld(
        position
    );

    return position;
}