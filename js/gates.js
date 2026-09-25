/* ============================================================
   GUN RUNNER
   WEAPON GATE SYSTEM
============================================================ */

let gates = [];
let nextGateId = 1;


/* ============================================================
   GATE CONFIGURATION
============================================================ */

const GATE_CONFIG = {

    width: 4.8,
    height: 3.8,
    depth: 0.45,

    spacing: 18,

    forwardDistance: 45,

    triggerDistance: 2.4,

    sideOffset: 3.2
};


/* ============================================================
   GATE TYPES
============================================================ */

const GATE_TYPES = {

    UPGRADE: "UPGRADE",
    DAMAGE: "DAMAGE",
    RAPID_FIRE: "RAPID_FIRE",
    DOUBLE_BARREL: "DOUBLE_BARREL",
    TRIPLE_BARREL: "TRIPLE_BARREL",
    EXPLOSIVE: "EXPLOSIVE",
    FREEZE: "FREEZE",
    PIERCING: "PIERCING",
    LIGHTNING: "LIGHTNING",
    ROCKET: "ROCKET",
    CRITICAL: "CRITICAL",
    ACCURACY: "ACCURACY"
};


/* ============================================================
   GATE COLORS
============================================================ */

const GATE_COLORS = {

    UPGRADE: 0x8b5cf6,
    DAMAGE: 0xff4444,
    RAPID_FIRE: 0xffcc33,
    DOUBLE_BARREL: 0x33ccff,
    TRIPLE_BARREL: 0x55eeff,
    EXPLOSIVE: 0xff6622,
    FREEZE: 0x55ddff,
    PIERCING: 0xaa66ff,
    LIGHTNING: 0xaaaaff,
    ROCKET: 0xff5533,
    CRITICAL: 0xffaa33,
    ACCURACY: 0x55ff99
};


/* ============================================================
   CREATE GATE
============================================================ */

function createGate(
    type,
    position,
    upgradeId = null
) {

    const gate = {

        id:
            nextGateId++,

        type:
            type,

        upgradeId:
            upgradeId,

        position:
            position.clone(),

        triggered:
            false,

        active:
            true,

        mesh:
            null,

        leftPost:
            null,

        rightPost:
            null,

        topBar:
            null,

        label:
            null
    };

    gate.mesh =
        createGateMesh(
            gate
        );

    gates.push(
        gate
    );

    if (
        typeof scene !==
        "undefined" &&
        gate.mesh
    ) {

        scene.add(
            gate.mesh
        );
    }

    return gate;
}


/* ============================================================
   CREATE GATE MESH
============================================================ */

function createGateMesh(
    gate
) {

    const group =
        new THREE.Group();

    group.position.copy(
        gate.position
    );

    const color =
        GATE_COLORS[
            gate.type
        ] ||
        GATE_COLORS.UPGRADE;


    /*
     * Vertical posts.
     */

    const postGeometry =
        new THREE.BoxGeometry(
            0.28,
            GATE_CONFIG.height,
            GATE_CONFIG.depth
        );

    const material =
        new THREE.MeshStandardMaterial({

            color:
                color,

            emissive:
                color,

            emissiveIntensity:
                0.25,

            metalness:
                0.45,

            roughness:
                0.25
        });


    const leftPost =
        new THREE.Mesh(
            postGeometry,
            material.clone()
        );

    leftPost.position.x =
        -GATE_CONFIG.width / 2;

    group.add(
        leftPost
    );


    const rightPost =
        new THREE.Mesh(
            postGeometry,
            material.clone()
        );

    rightPost.position.x =
        GATE_CONFIG.width / 2;

    group.add(
        rightPost
    );


    /*
     * Top beam.
     */

    const topGeometry =
        new THREE.BoxGeometry(
            GATE_CONFIG.width +
            0.5,

            0.3,

            GATE_CONFIG.depth
        );

    const topBar =
        new THREE.Mesh(
            topGeometry,
            material.clone()
        );

    topBar.position.y =
        GATE_CONFIG.height / 2;

    group.add(
        topBar
    );


    /*
     * Energy panel.
     */

    const panelGeometry =
        new THREE.PlaneGeometry(
            GATE_CONFIG.width,
            GATE_CONFIG.height
        );

    const panelMaterial =
        new THREE.MeshBasicMaterial({

            color:
                color,

            transparent:
                true,

            opacity:
                0.08,

            side:
                THREE.DoubleSide
        });

    const panel =
        new THREE.Mesh(
            panelGeometry,
            panelMaterial
        );

    panel.position.z =
        0.02;

    group.add(
        panel
    );


    /*
     * Store references.
     */

    gate.leftPost =
        leftPost;

    gate.rightPost =
        rightPost;

    gate.topBar =
        topBar;


    /*
     * Floating upgrade icon.
     */

    createGateLabel(
        group,
        gate
    );


    return group;
}


/* ============================================================
   GATE LABEL
============================================================ */

function createGateLabel(
    group,
    gate
) {

    if (
        typeof document ===
        "undefined"
    ) {
        return;
    }

    const label =
        document.createElement(
            "div"
        );

    label.className =
        "gate-world-label";

    label.style.position =
        "absolute";

    label.style.pointerEvents =
        "none";

    label.style.padding =
        "5px 10px";

    label.style.borderRadius =
        "8px";

    label.style.background =
        "rgba(0,0,0,0.65)";

    label.style.color =
        "#ffffff";

    label.style.fontWeight =
        "800";

    label.style.fontSize =
        "13px";

    label.style.whiteSpace =
        "nowrap";

    label.textContent =
        getGateLabelText(
            gate
        );

    const container =
        document.getElementById(
            "game-container"
        );

    if (
        container
    ) {

        container.appendChild(
            label
        );

        gate.label =
            label;
    }
}


/* ============================================================
   GATE LABEL TEXT
============================================================ */

function getGateLabelText(
    gate
) {

    if (
        gate.upgradeId &&
        typeof getUpgradeData ===
        "function"
    ) {

        const data =
            getUpgradeData(
                gate.upgradeId
            );

        if (data) {

            return (
                data.icon ||
                "⬆️"
            ) +
            " " +
            data.name;
        }
    }

    const names = {

        UPGRADE:
            "⬆️ UPGRADE",

        DAMAGE:
            "💥 DAMAGE",

        RAPID_FIRE:
            "⚡ RAPID FIRE",

        DOUBLE_BARREL:
            "🔫 DOUBLE BARREL",

        TRIPLE_BARREL:
            "🔫 TRIPLE BARREL",

        EXPLOSIVE:
            "💣 EXPLOSIVE",

        FREEZE:
            "❄️ FREEZE",

        PIERCING:
            "↠ PIERCING",

        LIGHTNING:
            "⚡ LIGHTNING",

        ROCKET:
            "🚀 ROCKET",

        CRITICAL:
            "🎯 CRITICAL",

        ACCURACY:
            "⊙ ACCURACY"
    };

    return (
        names[
            gate.type
        ] ||
        "UPGRADE"
    );
}


/* ============================================================
   GENERATE GATE TYPE
============================================================ */

function getRandomGateType(
    index = 0
) {

    const types = [

        GATE_TYPES.DAMAGE,
        GATE_TYPES.RAPID_FIRE,
        GATE_TYPES.DOUBLE_BARREL,
        GATE_TYPES.EXPLOSIVE,
        GATE_TYPES.FREEZE,
        GATE_TYPES.PIERCING,
        GATE_TYPES.LIGHTNING,
        GATE_TYPES.ROCKET,
        GATE_TYPES.CRITICAL,
        GATE_TYPES.ACCURACY
    ];

    /*
     * Early game should stay simple.
     */

    if (
        index === 0
    ) {

        return GATE_TYPES.DAMAGE;
    }

    if (
        index === 1
    ) {

        return GATE_TYPES.RAPID_FIRE;
    }

    if (
        index === 2
    ) {

        return GATE_TYPES.DOUBLE_BARREL;
    }

    return types[
        Math.floor(
            Math.random() *
            types.length
        )
    ];
}


/* ============================================================
   MAP GATE TYPE TO UPGRADE
============================================================ */

function getUpgradeIdForGate(
    type
) {

    const map = {

        DAMAGE:
            "DAMAGE",

        RAPID_FIRE:
            "RAPID_FIRE",

        DOUBLE_BARREL:
            "DOUBLE_BARREL",

        TRIPLE_BARREL:
            "TRIPLE_BARREL",

        EXPLOSIVE:
            "EXPLOSIVE",

        FREEZE:
            "FREEZE",

        PIERCING:
            "PIERCING",

        LIGHTNING:
            "CHAIN_LIGHTNING",

        ROCKET:
            "ROCKET_POD",

        CRITICAL:
            "CRITICAL",

        ACCURACY:
            "ACCURACY"
    };

    return (
        map[type] ||
        null
    );
}


/* ============================================================
   CREATE LEVEL GATES
============================================================ */

function generateGates(
    count = 5
) {

    clearGates();

    const startZ =
        -GATE_CONFIG.forwardDistance;

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const z =
            startZ -
            i *
            GATE_CONFIG.spacing;

        const type =
            getRandomGateType(
                i
            );

        const upgradeId =
            getUpgradeIdForGate(
                type
            );

        /*
         * Alternate gate sides
         * slightly for visual variety.
         */

        const x =
            i % 2 === 0
                ? -GATE_CONFIG.sideOffset
                : GATE_CONFIG.sideOffset;

        createGate(
            type,
            new THREE.Vector3(
                x,
                GATE_CONFIG.height / 2,
                z
            ),
            upgradeId
        );
    }

    return gates;
}


/* ============================================================
   UPDATE GATES
============================================================ */

function updateGates(
    delta
) {

    if (
        !gates ||
        gates.length === 0
    ) {
        return;
    }

    for (
        let i = gates.length - 1;
        i >= 0;
        i--
    ) {

        const gate =
            gates[i];

        if (
            !gate ||
            !gate.mesh
        ) {
            continue;
        }

        /*
         * Rotate energy structure.
         */

        gate.mesh.rotation.y =
            Math.sin(
                performance.now() *
                0.0015
            ) *
            0.04;


        /*
         * Pulse panel.
         */

        const panel =
            gate.mesh.children[3];

        if (
            panel &&
            panel.material
        ) {

            panel.material.opacity =
                0.06 +
                Math.sin(
                    performance.now() *
                    0.004
                ) *
                0.025;
        }


        /*
         * Update HTML label.
         */

        updateGateLabel(
            gate
        );
    }


    checkGateTriggers();
}


/* ============================================================
   UPDATE GATE LABEL
============================================================ */

function updateGateLabel(
    gate
) {

    if (
        !gate.label ||
        !camera
    ) {
        return;
    }

    const worldPosition =
        gate.position.clone();

    worldPosition.y +=
        GATE_CONFIG.height / 2 +
        0.5;

    const projected =
        worldPosition.project(
            camera
        );

    const width =
        window.innerWidth;

    const height =
        window.innerHeight;

    const x =
        (
            projected.x *
            0.5 +
            0.5
        ) *
        width;

    const y =
        (
            -projected.y *
            0.5 +
            0.5
        ) *
        height;

    gate.label.style.left =
        `${x}px`;

    gate.label.style.top =
        `${y}px`;

    gate.label.style.transform =
        "translate(-50%, -50%)";


    /*
     * Hide gates behind camera.
     */

    gate.label.style.display =
        projected.z > 1
            ? "none"
            : "block";
}


/* ============================================================
   CHECK TRIGGERS
============================================================ */

function checkGateTriggers() {

    if (
        !player ||
        !player.alive
    ) {
        return;
    }

    for (
        const gate of gates
    ) {

        if (
            gate.triggered ||
            !gate.active
        ) {
            continue;
        }

        const dx =
            Math.abs(
                player.position.x -
                gate.position.x
            );

        const dz =
            Math.abs(
                player.position.z -
                gate.position.z
            );

        if (
            dx <=
                GATE_CONFIG.width / 2 &&
            dz <=
                GATE_CONFIG.triggerDistance
        ) {

            triggerGate(
                gate
            );
        }
    }
}


/* ============================================================
   TRIGGER GATE
============================================================ */

function triggerGate(
    gate
) {

    if (
        !gate ||
        gate.triggered
    ) {
        return;
    }

    gate.triggered =
        true;

    gate.active =
        false;


    /*
     * Apply upgrade.
     */

    if (
        gate.upgradeId
    ) {

        if (
            typeof applyUpgradeWithEffect ===
            "function"
        ) {

            applyUpgradeWithEffect(
                gate.upgradeId
            );

        } else if (
            typeof chooseUpgrade ===
            "function"
        ) {

            chooseUpgrade(
                gate.upgradeId
            );
        }
    }


    /*
     * Gate visual effect.
     */

    if (
        typeof createGateEffect ===
        "function"
    ) {

        createGateEffect(
            gate.position.clone(),
            GATE_COLORS[
                gate.type
            ]
        );
    }


    if (
        typeof triggerScreenShake ===
        "function"
    ) {

        triggerScreenShake(
            0.15,
            0.12
        );
    }


    /*
     * Hide label.
     */

    if (
        gate.label
    ) {

        gate.label.style.display =
            "none";
    }


    /*
     * Disable gate mesh.
     */

    if (
        gate.mesh
    ) {

        gate.mesh.visible =
            false;
    }


    /*
     * Center message.
     */

    if (
        typeof showCenterMessage ===
        "function"
    ) {

        showCenterMessage(
            getGateLabelText(
                gate
            ),
            900
        );
    }


    /*
     * Update weapon UI.
     */

    if (
        typeof updateWeaponUI ===
        "function"
    ) {

        updateWeaponUI();
    }
}


/* ============================================================
   SPAWN NEXT GATE
============================================================ */

function spawnNextGate(
    currentZ
) {

    const type =
        getRandomGateType(
            gates.length
        );

    const upgradeId =
        getUpgradeIdForGate(
            type
        );

    const x =
        gates.length % 2 === 0
            ? -GATE_CONFIG.sideOffset
            : GATE_CONFIG.sideOffset;

    return createGate(
        type,
        new THREE.Vector3(
            x,
            GATE_CONFIG.height / 2,
            currentZ -
                GATE_CONFIG.spacing
        ),
        upgradeId
    );
}


/* ============================================================
   REMOVE OLD GATES
============================================================ */

function cleanupPassedGates() {

    if (
        !player
    ) {
        return;
    }

    for (
        let i = gates.length - 1;
        i >= 0;
        i--
    ) {

        const gate =
            gates[i];

        if (
            gate.position.z >
            player.position.z +
            12
        ) {

            removeGateAt(
                i
            );
        }
    }
}


/* ============================================================
   REMOVE GATE
============================================================ */

function removeGateAt(
    index
) {

    if (
        index < 0 ||
        index >= gates.length
    ) {
        return;
    }

    const gate =
        gates[index];

    if (
        gate.mesh &&
        typeof scene !==
        "undefined"
    ) {

        scene.remove(
            gate.mesh
        );
    }

    if (
        gate.label &&
        gate.label.parentNode
    ) {

        gate.label.parentNode.removeChild(
            gate.label
        );
    }

    gates.splice(
        index,
        1
    );
}


/* ============================================================
   CLEAR GATES
============================================================ */

function clearGates() {

    for (
        let i = gates.length - 1;
        i >= 0;
        i--
    ) {

        removeGateAt(
            i
        );
    }

    gates = [];
}


/* ============================================================
   GET ACTIVE GATES
============================================================ */

function getActiveGates() {

    return gates.filter(
        gate =>
            gate &&
            gate.active &&
            !gate.triggered
    );
}


/* ============================================================
   GET NEXT GATE
============================================================ */

function getNextGate() {

    if (
        !player
    ) {
        return null;
    }

    const active =
        getActiveGates();

    if (
        active.length === 0
    ) {
        return null;
    }

    active.sort(
        (a, b) =>
            b.position.z -
            a.position.z
    );

    return active[0];
}


/* ============================================================
   GET GATE COUNT
============================================================ */

function getGateCount() {

    return gates.length;
}


/* ============================================================
   RESET GATES
============================================================ */

function resetGates() {

    clearGates();

    nextGateId = 1;
}