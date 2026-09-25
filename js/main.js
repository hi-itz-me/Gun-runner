// ============================================================
// MAIN ENTRY POINT
// js/main.js
// ============================================================

// ------------------------------------------------------------
// THREE.JS CORE
// ------------------------------------------------------------

let scene = null;
let camera = null;
let renderer = null;

let clock = null;

let worldGroup = null;
let roadGroup = null;
let environmentGroup = null;

// ------------------------------------------------------------
// RENDER CONFIG
// ------------------------------------------------------------

const RENDER_CONFIG = {
    antialias: true,
    alpha: false,

    cameraFov: 60,

    cameraNear: 0.1,
    cameraFar: 300,

    pixelRatioLimit: 2,

    backgroundColor: 0x10131a,

    shadowMap: true,

    targetFPS: 60
};

// ------------------------------------------------------------
// INITIALIZE THREE.JS
// ------------------------------------------------------------

function initializeRenderer() {

    const container =
        document.getElementById("game");

    if (!container) {
        return;
    }

    renderer = new THREE.WebGLRenderer({
        antialias: RENDER_CONFIG.antialias,
        alpha: RENDER_CONFIG.alpha,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            RENDER_CONFIG.pixelRatioLimit
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.shadowMap.enabled =
        RENDER_CONFIG.shadowMap;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    renderer.outputColorSpace =
        THREE.SRGBColorSpace;

    renderer.toneMapping =
        THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1;

    renderer.setClearColor(
        RENDER_CONFIG.backgroundColor,
        1
    );

    container.appendChild(renderer.domElement);

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
}

// ------------------------------------------------------------
// CAMERA
// ------------------------------------------------------------

function initializeCamera() {

    camera = new THREE.PerspectiveCamera(
        RENDER_CONFIG.cameraFov,
        window.innerWidth / window.innerHeight,
        RENDER_CONFIG.cameraNear,
        RENDER_CONFIG.cameraFar
    );

    camera.position.set(
        0,
        8,
        15
    );

    camera.lookAt(
        0,
        1,
        -20
    );
}

// ------------------------------------------------------------
// SCENE
// ------------------------------------------------------------

function initializeScene() {

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(
            RENDER_CONFIG.backgroundColor
        );

    scene.fog =
        new THREE.Fog(
            RENDER_CONFIG.backgroundColor,
            55,
            240
        );

    worldGroup =
        new THREE.Group();

    roadGroup =
        new THREE.Group();

    environmentGroup =
        new THREE.Group();

    scene.add(worldGroup);
    worldGroup.add(roadGroup);
    worldGroup.add(environmentGroup);
}

// ------------------------------------------------------------
// LIGHTING
// ------------------------------------------------------------

function initializeLighting() {

    const ambientLight =
        new THREE.HemisphereLight(
            0xffffff,
            0x222233,
            1.8
        );

    scene.add(ambientLight);

    const directionalLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.2
        );

    directionalLight.position.set(
        8,
        18,
        10
    );

    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;

    directionalLight.shadow.camera.left = -35;
    directionalLight.shadow.camera.right = 35;
    directionalLight.shadow.camera.top = 35;
    directionalLight.shadow.camera.bottom = -35;

    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;

    scene.add(directionalLight);

    const fillLight =
        new THREE.PointLight(
            0x6688ff,
            20,
            70,
            2
        );

    fillLight.position.set(
        -12,
        8,
        -25
    );

    scene.add(fillLight);
}

// ------------------------------------------------------------
// ROAD
// ------------------------------------------------------------

function createRoad() {

    const roadWidth = 18;
    const roadLength = 240;

    const roadGeometry =
        new THREE.BoxGeometry(
            roadWidth,
            0.4,
            roadLength
        );

    const roadMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x242933,
            roughness: 0.8,
            metalness: 0.1
        });

    const road =
        new THREE.Mesh(
            roadGeometry,
            roadMaterial
        );

    road.position.set(
        0,
        -0.25,
        -70
    );

    road.receiveShadow = true;

    roadGroup.add(road);

    createRoadLines(roadWidth, roadLength);
    createRoadSides(roadWidth, roadLength);
}

// ------------------------------------------------------------
// ROAD LINES
// ------------------------------------------------------------

function createRoadLines(
    roadWidth,
    roadLength
) {

    const lineMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x666b76
        });

    const laneWidth = 3.6;

    for (
        let x = -laneWidth * 2;
        x <= laneWidth * 2;
        x += laneWidth
    ) {

        const lineGeometry =
            new THREE.BoxGeometry(
                0.08,
                0.025,
                roadLength
            );

        const line =
            new THREE.Mesh(
                lineGeometry,
                lineMaterial
            );

        line.position.set(
            x,
            -0.03,
            -70
        );

        roadGroup.add(line);
    }
}

// ------------------------------------------------------------
// ROAD SIDES
// ------------------------------------------------------------

function createRoadSides(
    roadWidth,
    roadLength
) {

    const sideMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x151820,
            roughness: 1
        });

    const sideWidth = 2;

    const leftGeometry =
        new THREE.BoxGeometry(
            sideWidth,
            0.8,
            roadLength
        );

    const rightGeometry =
        leftGeometry.clone();

    const leftSide =
        new THREE.Mesh(
            leftGeometry,
            sideMaterial
        );

    const rightSide =
        new THREE.Mesh(
            rightGeometry,
            sideMaterial
        );

    leftSide.position.set(
        -(roadWidth / 2 + sideWidth / 2),
        -0.05,
        -70
    );

    rightSide.position.set(
        roadWidth / 2 + sideWidth / 2,
        -0.05,
        -70
    );

    leftSide.receiveShadow = true;
    rightSide.receiveShadow = true;

    roadGroup.add(leftSide);
    roadGroup.add(rightSide);
}

// ------------------------------------------------------------
// ENVIRONMENT
// ------------------------------------------------------------

function createEnvironment() {

    createEnvironmentLights();
    createBackgroundBlocks();
    createDistanceMarkers();
}

// ------------------------------------------------------------
// ENVIRONMENT LIGHTS
// ------------------------------------------------------------

function createEnvironmentLights() {

    for (let i = 0; i < 18; i++) {

        const light =
            new THREE.PointLight(
                i % 2 === 0
                    ? 0x3355ff
                    : 0x9933ff,
                7,
                16,
                2
            );

        const side =
            i % 2 === 0
                ? -1
                : 1;

        light.position.set(
            side * 10,
            2.5,
            5 - i * 13
        );

        environmentGroup.add(light);

        const poleGeometry =
            new THREE.CylinderGeometry(
                0.08,
                0.08,
                3,
                8
            );

        const poleMaterial =
            new THREE.MeshStandardMaterial({
                color: 0x292d37,
                metalness: 0.6,
                roughness: 0.4
            });

        const pole =
            new THREE.Mesh(
                poleGeometry,
                poleMaterial
            );

        pole.position.set(
            side * 10,
            1.5,
            5 - i * 13
        );

        environmentGroup.add(pole);
    }
}

// ------------------------------------------------------------
// BACKGROUND BLOCKS
// ------------------------------------------------------------

function createBackgroundBlocks() {

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x171b25,
            roughness: 0.9,
            metalness: 0.05
        });

    for (let i = 0; i < 40; i++) {

        const width =
            2 + Math.random() * 4;

        const height =
            2 + Math.random() * 12;

        const depth =
            2 + Math.random() * 5;

        const geometry =
            new THREE.BoxGeometry(
                width,
                height,
                depth
            );

        const building =
            new THREE.Mesh(
                geometry,
                material
            );

        const side =
            Math.random() < 0.5
                ? -1
                : 1;

        building.position.set(
            side * (13 + Math.random() * 12),
            height / 2 - 0.2,
            -Math.random() * 230
        );

        building.castShadow = true;
        building.receiveShadow = true;

        environmentGroup.add(building);
    }
}

// ------------------------------------------------------------
// DISTANCE MARKERS
// ------------------------------------------------------------

function createDistanceMarkers() {

    const markerMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x303746
        });

    for (let z = 10; z > -230; z -= 10) {

        const geometry =
            new THREE.BoxGeometry(
                17.5,
                0.05,
                0.08
            );

        const marker =
            new THREE.Mesh(
                geometry,
                markerMaterial
            );

        marker.position.set(
            0,
            0.03,
            z
        );

        roadGroup.add(marker);
    }
}

// ------------------------------------------------------------
// RESIZE
// ------------------------------------------------------------

function handleResize() {

    if (!camera || !renderer) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            RENDER_CONFIG.pixelRatioLimit
        )
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}

// ------------------------------------------------------------
// CAMERA UPDATE
// ------------------------------------------------------------

function updateMainCamera(delta) {

    if (!camera || !player) {
        return;
    }

    const targetX =
        player.position.x * 0.18;

    const targetY = 7.5;

    const targetZ = 15;

    camera.position.x +=
        (targetX - camera.position.x) *
        Math.min(
            1,
            delta * 5
        );

    camera.position.y +=
        (targetY - camera.position.y) *
        Math.min(
            1,
            delta * 3
        );

    camera.position.z +=
        (targetZ - camera.position.z) *
        Math.min(
            1,
            delta * 3
        );

    const lookTarget =
        new THREE.Vector3(
            player.position.x * 0.15,
            1,
            -18
        );

    camera.lookAt(lookTarget);
}

// ------------------------------------------------------------
// SCENE RENDER
// ------------------------------------------------------------

function renderScene() {

    if (!renderer ||
        !scene ||
        !camera) {
        return;
    }

    renderer.render(
        scene,
        camera
    );
}

// ------------------------------------------------------------
// POINTER INPUT
// ------------------------------------------------------------

function setupPointerInput() {

    if (!renderer) {
        return;
    }

    renderer.domElement.addEventListener(
        "pointerdown",
        function (event) {

            if (!gameRunning ||
                gamePaused ||
                gameOver) {
                return;
            }

            if (event.pointerType === "mouse") {

                if (typeof playerShoot === "function") {
                    playerShoot();
                }
            }
        }
    );

    renderer.domElement.addEventListener(
        "pointermove",
        function (event) {

            if (!player ||
                !camera ||
                !renderer) {
                return;
            }

            const rect =
                renderer.domElement.getBoundingClientRect();

            const normalizedX =
                ((event.clientX - rect.left) /
                    rect.width) * 2 - 1;

            const worldX =
                normalizedX * 7;

            if (typeof setPlayerTargetX === "function") {
                setPlayerTargetX(worldX);
            }
        }
    );
}

// ------------------------------------------------------------
// TOUCH INPUT
// ------------------------------------------------------------

function setupTouchInput() {

    if (!renderer) {
        return;
    }

    renderer.domElement.addEventListener(
        "touchstart",
        function (event) {

            if (!gameRunning ||
                gamePaused ||
                gameOver) {
                return;
            }

            if (event.touches.length > 0) {

                const touch =
                    event.touches[0];

                setTouchTarget(
                    touch.clientX
                );
            }

        },
        {
            passive: true
        }
    );

    renderer.domElement.addEventListener(
        "touchmove",
        function (event) {

            if (!player ||
                event.touches.length === 0) {
                return;
            }

            const touch =
                event.touches[0];

            setTouchTarget(
                touch.clientX
            );

        },
        {
            passive: true
        }
    );
}

function setTouchTarget(clientX) {

    if (!renderer) {
        return;
    }

    const rect =
        renderer.domElement.getBoundingClientRect();

    const normalizedX =
        ((clientX - rect.left) /
            rect.width) * 2 - 1;

    const worldX =
        normalizedX * 7;

    if (typeof setPlayerTargetX === "function") {
        setPlayerTargetX(worldX);
    }
}

// ------------------------------------------------------------
// VISIBILITY / PERFORMANCE
// ------------------------------------------------------------

function setupVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (document.hidden) {

                if (typeof isGameRunning === "function" &&
                    isGameRunning() &&
                    typeof isGamePaused === "function" &&
                    !isGamePaused()) {

                    if (typeof pauseGame === "function") {
                        pauseGame();
                    }
                }
            }
        }
    );
}

// ------------------------------------------------------------
// GLOBAL ERROR HANDLING
// ------------------------------------------------------------

window.addEventListener(
    "error",
    function (event) {

        console.error(
            "Game error:",
            event.error || event.message
        );
    }
);

// ------------------------------------------------------------
// INITIALIZATION
// ------------------------------------------------------------

function initializeApplication() {

    initializeRenderer();

    initializeScene();

    initializeCamera();

    initializeLighting();

    createRoad();

    createEnvironment();

    setupPointerInput();

    setupTouchInput();

    setupVisibilityHandling();

    window.addEventListener(
        "resize",
        handleResize
    );

    if (typeof startGameSystems === "function") {
        startGameSystems();
    }
}

// ------------------------------------------------------------
// MAIN LOOP CAMERA HOOK
// ------------------------------------------------------------

const originalUpdateGame =
    typeof updateGame === "function"
        ? updateGame
        : null;

// ------------------------------------------------------------
// START APPLICATION
// ------------------------------------------------------------

function bootGame() {

    if (typeof THREE === "undefined") {

        console.error(
            "Three.js was not loaded."
        );

        return;
    }

    initializeApplication();
}

// ------------------------------------------------------------
// DOM READY
// ------------------------------------------------------------

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        bootGame
    );

} else {

    bootGame();
}