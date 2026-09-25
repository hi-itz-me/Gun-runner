/* ============================================================
   GUN RUNNER
   VISUAL EFFECTS SYSTEM
============================================================ */

const activeEffects = [];


/* ============================================================
   EFFECT HELPERS
============================================================ */

function registerEffect(
    object,
    lifetime,
    updateFunction = null
) {

    const effect = {

        object: object,

        lifetime: lifetime,

        age: 0,

        update:
            updateFunction
    };

    activeEffects.push(
        effect
    );

    return effect;
}


/* ============================================================
   UPDATE EFFECTS
============================================================ */

function updateEffects(
    delta
) {

    for (
        let i =
            activeEffects.length - 1;
        i >= 0;
        i--
    ) {

        const effect =
            activeEffects[i];

        effect.age +=
            delta;

        if (
            typeof effect.update ===
            "function"
        ) {

            effect.update(
                effect,
                delta
            );
        }

        if (
            effect.age >=
            effect.lifetime
        ) {

            removeEffectAt(i);
        }
    }
}


/* ============================================================
   REMOVE EFFECT
============================================================ */

function removeEffectAt(
    index
) {

    const effect =
        activeEffects[index];

    if (
        effect &&
        effect.object &&
        effect.object.parent
    ) {

        effect.object.parent.remove(
            effect.object
        );
    }

    activeEffects.splice(
        index,
        1
    );
}


/* ============================================================
   MUZZLE FLASH
============================================================ */

function createMuzzleFlash(
    position,
    color = 0xffdd66
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.SphereGeometry(
            0.22,
            8,
            8
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 1
        });

    const flash =
        new THREE.Mesh(
            geometry,
            material
        );

    flash.position.copy(
        position
    );

    scene.add(
        flash
    );

    return registerEffect(
        flash,
        0.08,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.scale.setScalar(
                1 +
                progress * 2
            );

            effect.object.material.opacity =
                1 - progress;
        }
    );
}


/* ============================================================
   BULLET TRAIL
============================================================ */

function createBulletTrail(
    position,
    color = 0xffffff
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.SphereGeometry(
            0.06,
            6,
            6
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });

    const trail =
        new THREE.Mesh(
            geometry,
            material
        );

    trail.position.copy(
        position
    );

    scene.add(
        trail
    );

    return registerEffect(
        trail,
        0.18,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.scale.setScalar(
                1 -
                progress
            );

            effect.object.material.opacity =
                0.7 *
                (1 - progress);
        }
    );
}


/* ============================================================
   EXPLOSION EFFECT
============================================================ */

function createExplosionEffect(
    position,
    radius = 3
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.SphereGeometry(
            1,
            16,
            16
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xff7722,
            transparent: true,
            opacity: 0.75,
            wireframe: true
        });

    const explosion =
        new THREE.Mesh(
            geometry,
            material
        );

    explosion.position.copy(
        position
    );

    explosion.scale.setScalar(
        0.15
    );

    scene.add(
        explosion
    );

    return registerEffect(
        explosion,
        0.45,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            const scale =
                0.15 +
                progress *
                radius;

            effect.object.scale.setScalar(
                scale
            );

            effect.object.material.opacity =
                0.75 *
                (1 - progress);
        }
    );
}


/* ============================================================
   IMPACT EFFECT
============================================================ */

function createImpactEffect(
    position,
    color = 0xffffff
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const group =
        new THREE.Group();

    group.position.copy(
        position
    );

    const particleCount =
        8;

    for (
        let i = 0;
        i < particleCount;
        i++
    ) {

        const geometry =
            new THREE.BoxGeometry(
                0.08,
                0.08,
                0.08
            );

        const material =
            new THREE.MeshBasicMaterial({
                color: color,
                transparent: true
            });

        const particle =
            new THREE.Mesh(
                geometry,
                material
            );

        particle.position.set(
            0,
            0,
            0
        );

        particle.userData.velocity =
            new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                Math.random() * 4,
                (Math.random() - 0.5) * 5
            );

        group.add(
            particle
        );
    }

    scene.add(
        group
    );

    return registerEffect(
        group,
        0.5,
        (effect, delta) => {

            const progress =
                effect.age /
                effect.lifetime;

            for (
                const particle
                of effect.object.children
            ) {

                particle.position.add(
                    particle.userData
                        .velocity
                        .clone()
                        .multiplyScalar(
                            delta
                        )
                );

                particle.userData
                    .velocity.y -=
                    8 * delta;

                particle.material.opacity =
                    1 - progress;
            }
        }
    );
}


/* ============================================================
   LIGHTNING EFFECT
============================================================ */

function createLightningEffect(
    start,
    end
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const points = [];

    const segments = 8;

    for (
        let i = 0;
        i <= segments;
        i++
    ) {

        const t =
            i / segments;

        const point =
            new THREE.Vector3()
                .lerpVectors(
                    start,
                    end,
                    t
                );

        if (
            i !== 0 &&
            i !== segments
        ) {

            point.x +=
                (Math.random() - 0.5) *
                0.7;

            point.y +=
                (Math.random() - 0.5) *
                0.7;

            point.z +=
                (Math.random() - 0.5) *
                0.7;
        }

        points.push(
            point
        );
    }

    const geometry =
        new THREE.BufferGeometry()
            .setFromPoints(
                points
            );

    const material =
        new THREE.LineBasicMaterial({
            color: 0x9c88ff,
            transparent: true,
            opacity: 1
        });

    const lightning =
        new THREE.Line(
            geometry,
            material
        );

    scene.add(
        lightning
    );

    return registerEffect(
        lightning,
        0.16,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.material.opacity =
                1 - progress;
        }
    );
}


/* ============================================================
   FREEZE EFFECT
============================================================ */

function createFreezeEffect(
    position,
    radius = 1
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.SphereGeometry(
            radius,
            12,
            12
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0x66ddff,
            transparent: true,
            opacity: 0.45,
            wireframe: true
        });

    const ice =
        new THREE.Mesh(
            geometry,
            material
        );

    ice.position.copy(
        position
    );

    scene.add(
        ice
    );

    return registerEffect(
        ice,
        0.35,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.rotation.x +=
                0.04;

            effect.object.rotation.y +=
                0.05;

            effect.object.material.opacity =
                0.45 *
                (1 - progress);
        }
    );
}


/* ============================================================
   DAMAGE NUMBER
============================================================ */

function createDamageNumber(
    position,
    damage,
    critical = false
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width = 256;
    canvas.height = 128;

    const context =
        canvas.getContext(
            "2d"
        );

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    context.font =
        critical
            ? "bold 52px Arial"
            : "bold 42px Arial";

    context.textAlign =
        "center";

    context.textBaseline =
        "middle";

    context.fillStyle =
        critical
            ? "#ffdd33"
            : "#ffffff";

    context.fillText(
        Math.round(damage),
        128,
        64
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    const material =
        new THREE.SpriteMaterial({
            map: texture,
            transparent: true
        });

    const sprite =
        new THREE.Sprite(
            material
        );

    sprite.position.copy(
        position
    );

    sprite.position.y +=
        0.7;

    sprite.scale.set(
        1.4,
        0.7,
        1
    );

    scene.add(
        sprite
    );

    return registerEffect(
        sprite,
        0.7,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.position.y +=
                1.2 *
                (1 - progress) *
                0.016;

            effect.object.material.opacity =
                1 - progress;
        }
    );
}


/* ============================================================
   POWER-UP EFFECT
============================================================ */

function createPowerupEffect(
    position,
    color = 0x66ff99
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.RingGeometry(
            0.25,
            0.4,
            24
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.9,
            side:
                THREE.DoubleSide
        });

    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.position.copy(
        position
    );

    ring.rotation.x =
        Math.PI / 2;

    scene.add(
        ring
    );

    return registerEffect(
        ring,
        0.65,
        (effect) => {

            const progress =
                effect.age /
                effect.lifetime;

            effect.object.scale.setScalar(
                1 +
                progress * 2
            );

            effect.object.material.opacity =
                0.9 *
                (1 - progress);

            effect.object.rotation.z +=
                0.08;
        }
    );
}


/* ============================================================
   BOSS HIT EFFECT
============================================================ */

function createBossHitEffect(
    position,
    color = 0xff4444
) {

    const effect =
        createImpactEffect(
            position,
            color
        );

    if (
        typeof createDamageNumber ===
        "function"
    ) {

        /*
         * Small visual burst above the boss.
         */
        createPowerupEffect(
            position,
            color
        );
    }

    return effect;
}


/* ============================================================
   GATE EFFECT
============================================================ */

function createGateEffect(
    position,
    color = 0xffffff
) {

    if (
        typeof scene ===
        "undefined"
    ) {
        return null;
    }

    const geometry =
        new THREE.RingGeometry(
            1.2,
            1.4,
            32
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.65,
            side:
                THREE.DoubleSide
        });

    const ring =
        new THREE.Mesh(
            geometry,
            material
        );

    ring.position.copy(
        position
    );

    ring.rotation.x =
        Math.PI / 2;

    scene.add(
        ring
    );

    return registerEffect(
        ring,
        1.0,
        (effect) => {

            effect.object.rotation.z +=
                0.04;

            const pulse =
                1 +
                Math.sin(
                    effect.age * 8
                ) * 0.08;

            effect.object.scale.setScalar(
                pulse
            );
        }
    );
}


/* ============================================================
   SCREEN SHAKE
============================================================ */

let screenShakeTime = 0;
let screenShakeStrength = 0;


function triggerScreenShake(
    strength = 0.15,
    duration = 0.2
) {

    screenShakeStrength =
        Math.max(
            screenShakeStrength,
            strength
        );

    screenShakeTime =
        Math.max(
            screenShakeTime,
            duration
        );
}


function updateScreenShake(
    delta
) {

    if (
        typeof camera ===
        "undefined" ||
        !camera
    ) {
        return;
    }

    if (
        screenShakeTime <= 0
    ) {

        screenShakeStrength = 0;

        return;
    }

    screenShakeTime -=
        delta;

    const strength =
        screenShakeStrength *
        Math.max(
            0,
            screenShakeTime
        );

    camera.position.x +=
        (Math.random() - 0.5) *
        strength;

    camera.position.y +=
        (Math.random() - 0.5) *
        strength;

    camera.position.z +=
        (Math.random() - 0.5) *
        strength;
}


/* ============================================================
   CLEAR EFFECTS
============================================================ */

function clearEffects() {

    for (
        let i =
            activeEffects.length - 1;
        i >= 0;
        i--
    ) {

        removeEffectAt(i);
    }

    screenShakeTime = 0;
    screenShakeStrength = 0;
}


/* ============================================================
   EFFECT COUNT
============================================================ */

function getEffectCount() {

    return activeEffects.length;
}