/* ============================================================
   GUN RUNNER
   PLAYER SYSTEM
============================================================ */

let player = null;


/* ============================================================
   PLAYER DEFAULTS
============================================================ */

const PLAYER_DEFAULTS = {

    maxHealth: 100,

    health: 100,

    moveSpeed: 8,

    laneLimit: 7,

    radius: 0.7,

    coins: 0,

    score: 0,

    kills: 0,

    wave: 1,

    invulnerable: false,

    invulnerabilityTimer: 0,

    fireTimer: 0,

    fireCooldown: 0,

    alive: true
};


/* ============================================================
   PLAYER CREATION
============================================================ */

function createPlayer() {

    const playerData = {

        ...PLAYER_DEFAULTS,

        position:
            new THREE.Vector3(
                0,
                0.8,
                8
            ),

        velocity:
            new THREE.Vector3(),

        targetX: 0,

        movingLeft: false,

        movingRight: false,

        shooting: false,

        mesh: null,

        gunMesh: null
    };

    player = playerData;

    createPlayerMesh();

    return player;
}


/* ============================================================
   PLAYER MESH
============================================================ */

function createPlayerMesh() {

    if (!player) {
        return;
    }

    const group =
        new THREE.Group();

    /*
     * Main body.
     */

    const bodyGeometry =
        new THREE.CapsuleGeometry(
            0.55,
            0.9,
            6,
            12
        );

    const bodyMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x3399ff,
            roughness: 0.7,
            metalness: 0.15
        });

    const body =
        new THREE.Mesh(
            bodyGeometry,
            bodyMaterial
        );

    body.position.y =
        0.75;

    group.add(
        body
    );


    /*
     * Head.
     */

    const headGeometry =
        new THREE.SphereGeometry(
            0.42,
            12,
            12
        );

    const headMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xffc49a,
            roughness: 0.8
        });

    const head =
        new THREE.Mesh(
            headGeometry,
            headMaterial
        );

    head.position.y =
        1.65;

    group.add(
        head
    );


    /*
     * Player marker.
     */

    const markerGeometry =
        new THREE.CylinderGeometry(
            0.75,
            0.75,
            0.08,
            24
        );

    const markerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x44aaff,
            transparent: true,
            opacity: 0.35
        });

    const marker =
        new THREE.Mesh(
            markerGeometry,
            markerMaterial
        );

    marker.position.y =
        0.05;

    group.add(
        marker
    );


    /*
     * Gun mount.
     */

    const gunMount =
        new THREE.Group();

    gunMount.position.set(
        0,
        1.05,
        -0.65
    );

    group.add(
        gunMount
    );

    player.gunMesh =
        gunMount;

    player.mesh =
        group;

    group.position.copy(
        player.position
    );

    if (
        typeof scene !== "undefined" &&
        scene
    ) {

        scene.add(
            group
        );
    }
}


/* ============================================================
   PLAYER UPDATE
============================================================ */

function updatePlayer(
    delta
) {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }

    updatePlayerMovement(
        delta
    );

    updatePlayerTimers(
        delta
    );

    updatePlayerMesh();
}


/* ============================================================
   MOVEMENT
============================================================ */

function updatePlayerMovement(
    delta
) {

    let direction = 0;

    if (
        player.movingLeft
    ) {

        direction -= 1;
    }

    if (
        player.movingRight
    ) {

        direction += 1;
    }

    /*
     * Target position.
     */

    player.targetX +=
        direction *
        player.moveSpeed *
        delta;

    player.targetX =
        THREE.MathUtils.clamp(
            player.targetX,
            -player.laneLimit,
            player.laneLimit
        );

    /*
     * Smooth movement.
     */

    const difference =
        player.targetX -
        player.position.x;

    player.velocity.x =
        difference *
        12;

    player.position.x +=
        player.velocity.x *
        delta;

    player.position.x =
        THREE.MathUtils.clamp(
            player.position.x,
            -player.laneLimit,
            player.laneLimit
        );
}


/* ============================================================
   PLAYER TIMERS
============================================================ */

function updatePlayerTimers(
    delta
) {

    if (
        player.invulnerabilityTimer > 0
    ) {

        player.invulnerabilityTimer -=
            delta;

        if (
            player.invulnerabilityTimer <= 0
        ) {

            player.invulnerabilityTimer =
                0;

            player.invulnerable =
                false;
        }
    }

    if (
        player.fireTimer > 0
    ) {

        player.fireTimer -=
            delta;
    }
}


/* ============================================================
   PLAYER MESH UPDATE
============================================================ */

function updatePlayerMesh() {

    if (
        !player ||
        !player.mesh
    ) {
        return;
    }

    player.mesh.position.copy(
        player.position
    );

    /*
     * Slight movement tilt.
     */

    const tilt =
        THREE.MathUtils.clamp(
            player.velocity.x *
            -0.04,
            -0.3,
            0.3
        );

    player.mesh.rotation.z =
        tilt;

    /*
     * Damage flash.
     */

    if (
        player.invulnerable
    ) {

        const pulse =
            0.75 +
            Math.sin(
                performance.now() *
                0.02
            ) *
            0.25;

        player.mesh.visible =
            pulse > 0.5;

    } else {

        player.mesh.visible =
            true;
    }
}


/* ============================================================
   MOVEMENT INPUT
============================================================ */

function setPlayerLeft(
    active
) {

    if (!player) {
        return;
    }

    player.movingLeft =
        !!active;
}


function setPlayerRight(
    active
) {

    if (!player) {
        return;
    }

    player.movingRight =
        !!active;
}


function setPlayerTargetX(
    x
) {

    if (!player) {
        return;
    }

    player.targetX =
        THREE.MathUtils.clamp(
            x,
            -player.laneLimit,
            player.laneLimit
        );
}


function setPlayerTargetFromScreenPosition(
    clientX,
    clientY
) {

    if (
        !player ||
        typeof camera === "undefined" ||
        !camera
    ) {
        return;
    }

    const ndcX =
        (clientX / window.innerWidth) * 2 - 1;

    const ndcY =
        -(clientY / window.innerHeight) * 2 + 1;

    const raycaster =
        new THREE.Raycaster();

    raycaster.setFromCamera(
        new THREE.Vector2(
            ndcX,
            ndcY
        ),
        camera
    );

    const plane =
        new THREE.Plane(
            new THREE.Vector3(0, 1, 0),
            -player.position.y
        );

    const point =
        new THREE.Vector3();

    if (
        raycaster.ray.intersectPlane(
            plane,
            point
        )
    ) {

        setPlayerTargetX(point.x);

    } else {

        setPlayerTargetX(
            ndcX * player.laneLimit
        );
    }
}


/* ============================================================
   PLAYER SHOOTING
============================================================ */

function canPlayerShoot() {

    if (
        !player ||
        !player.alive
    ) {
        return false;
    }

    if (
        player.fireTimer > 0
    ) {
        return false;
    }

    return true;
}


function playerShoot() {

    if (
        !canPlayerShoot()
    ) {
        return false;
    }

    if (
        typeof currentWeapon ===
        "undefined"
    ) {
        return false;
    }

    const fireRate =
        Math.max(
            0.1,
            currentWeapon.fireRate
        );

    player.fireTimer =
        1 /
        fireRate;

    let direction =
        new THREE.Vector3(
            0,
            0,
            -1
        );

    /*
     * Gun system controls
     * the actual barrel position.
     */

    if (
        typeof fireGun ===
        "function"
    ) {

        fireGun(
            player,
            currentWeapon,
            direction
        );

    } else if (
        typeof fireWeaponProjectiles ===
        "function"
    ) {

        const position =
            player.position
                .clone();

        position.y +=
            1.1;

        position.z -=
            0.8;

        fireWeaponProjectiles(
            position,
            direction,
            currentWeapon
        );
    }

    return true;
}


/* ============================================================
   AUTOMATIC FIRE
============================================================ */

function updatePlayerShooting() {

    if (
        !player ||
        !player.shooting
    ) {
        return;
    }

    playerShoot();
}


/* ============================================================
   PLAYER DAMAGE
============================================================ */

function damagePlayer(
    damage
) {

    if (
        !player ||
        !player.alive
    ) {
        return false;
    }

    if (
        player.invulnerable
    ) {
        return false;
    }

    const amount =
        Math.max(
            0,
            damage
        );

    player.health -=
        amount;

    player.health =
        Math.max(
            0,
            player.health
        );

    player.invulnerable =
        true;

    player.invulnerabilityTimer =
        0.6;

    if (
        typeof createImpactEffect ===
        "function"
    ) {

        createImpactEffect(
            player.position,
            0xff4444
        );
    }

    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.18,
            0.2
        );
    }

    if (
        player.health <= 0
    ) {

        killPlayer();

        return true;
    }

    return false;
}


/* ============================================================
   PLAYER HEAL
============================================================ */

function healPlayer(
    amount
) {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }

    player.health +=
        Math.max(
            0,
            amount
        );

    player.health =
        Math.min(
            player.maxHealth,
            player.health
        );
}


/* ============================================================
   PLAYER DEATH
============================================================ */

function killPlayer() {

    if (!player) {
        return;
    }

    player.health = 0;

    player.alive =
        false;

    player.shooting =
        false;

    player.movingLeft =
        false;

    player.movingRight =
        false;

    if (
        player.mesh
    ) {

        player.mesh.visible =
            false;
    }

    if (
        typeof onPlayerDeath ===
        "function"
    ) {

        onPlayerDeath();
    }
}


/* ============================================================
   PLAYER REVIVE
============================================================ */

function revivePlayer() {

    if (!player) {
        return;
    }

    player.health =
        player.maxHealth;

    player.alive =
        true;

    player.invulnerable =
        true;

    player.invulnerabilityTimer =
        2;

    if (
        player.mesh
    ) {

        player.mesh.visible =
            true;
    }
}


/* ============================================================
   PLAYER REWARD
============================================================ */

function addPlayerCoins(
    amount
) {

    if (!player) {
        return;
    }

    player.coins +=
        Math.max(
            0,
            Math.floor(amount)
        );
}


function addPlayerScore(
    amount
) {

    if (!player) {
        return;
    }

    player.score +=
        Math.max(
            0,
            Math.floor(amount)
        );
}


/* ============================================================
   KILL COUNTER
============================================================ */

function registerPlayerKill(
    reward = 0
) {

    if (!player) {
        return;
    }

    player.kills++;

    addPlayerCoins(
        reward
    );

    addPlayerScore(
        reward * 10
    );
}


/* ============================================================
   PLAYER RESET
============================================================ */

function resetPlayer() {

    if (
        player &&
        player.mesh &&
        player.mesh.parent
    ) {

        player.mesh.parent.remove(
            player.mesh
        );
    }

    player = null;

    createPlayer();
}


/* ============================================================
   PLAYER STATE
============================================================ */

function getPlayerHealthPercent() {

    if (!player) {
        return 0;
    }

    return Math.max(
        0,
        Math.min(
            1,
            player.health /
            player.maxHealth
        )
    );
}


function isPlayerAlive() {

    return !!(
        player &&
        player.alive
    );
}


/* ============================================================
   PLAYER POSITION
============================================================ */

function getPlayerPosition() {

    if (
        !player
    ) {

        return new THREE.Vector3();
    }

    return player.position.clone();
}