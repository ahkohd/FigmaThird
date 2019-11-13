import * as React from "react";
import AppContext from "../context";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import Tree from "../utils/Tree";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";

import Loader from "./Loader";
import { encode } from "../utils/utils";
import { importOBJ, importGLB, importFBX, fitCameraToSelection } from "../utils/Importer";
import { Color } from "three";
import { ILight } from "../utils/ILight";

let scene;
let camera;
let orbitControl;
let transformControl;
let renderer;
let grid;

// Object selection vars
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let onDownPosition = new THREE.Vector2();
let onUpPosition = new THREE.Vector2();
let onDoubleClickPosition = new THREE.Vector2();
let objectsForSelection: any[] = [];

export default function Viewport(props) {
    const { state, dispatch }: any = React.useContext(AppContext);

    const viewportRef = React.useRef();
    let port: HTMLDivElement;
    let selectedID: number;

    React.useEffect(() => {
        init();
        window.addEventListener("keydown", handleUserKeyDownInput);
        window.addEventListener("keyup", handleUserKeyUpInput);

        // object selection listners
        port.addEventListener("mousedown", onMouseDown, false);
        port.addEventListener("dblclick", onDoubleClick, false);

        return () => {
            window.removeEventListener("keydown", handleUserKeyDownInput);
            window.removeEventListener("keyup", handleUserKeyUpInput);
            port.removeEventListener("mousedown", onMouseDown, false);
        };
    }, []);

    React.useEffect(() => {
        // When Import model data state changed
        handleModelImport();
    }, [state.importData]);

    React.useEffect(() => {
        // React when use opens the inspector view ...
        if (state.activeTab == "inspector") handleInspector();
    }, [state.activeTab]);

    // Watch for inspector selects an item
    React.useEffect(() => {
        if (!state.selectItemInTree) return;
        handleUserSelectOnInspector(state.selectItemInTree.node);
    }, [state.selectItemInTree]);

    // Watch for 3d obj to hide
    React.useEffect(() => {
        if (!state.hideItemValue) return;
        handleItemHideToggle(parseInt(state.hideItemValue.id));
    }, [state.hideItemValue]);

    // Watch for 3d obj to cast shadow click ..
    React.useEffect(() => {
        if (!state.shadowCItemValue) return;
        handleShadowToggle(parseInt(state.shadowCItemValue.id), true);
    }, [state.shadowCItemValue]);

    // Watch for 3d obj to recive shadow click ..
    React.useEffect(() => {
        if (!state.shadowRItemValue) return;
        handleShadowToggle(parseInt(state.shadowRItemValue.id));
    }, [state.shadowRItemValue]);

    // Watch for 3d obj to delete.
    React.useEffect(() => {
        if (!state.hideItemDelete) return;
        removeItemFromScene(state.hideItemDelete.id);
    }, [state.hideItemDelete]);

    // Watch for when user triggers mode change ..
    React.useEffect(() => {
        if (!state.transformControlMode) return;
        handleTransformControlMode(state.transformControlMode.type);
    }, [state.transformControlMode]);

    // Watch for when user requests to set current transform object as pivot
    React.useEffect(() => {
        if (!state.transformControlPivot) return;
        handleTransformControlPivot();
    }, [state.transformControlPivot]);

    // Effect on light color change
    React.useEffect(() => {
        if (!state.updateLightData) return;
        handleLightDataChange(state.updateLightData);
    }, [state.updateLightData]);

    // Effect on request to add light
    React.useEffect(() => {
        if (!state.requestAddLight) return;
        handleAddLight(state.requestAddLight);
    }, [state.requestAddLight]);

    // Effect when user changes fog data
    React.useEffect(() => {
        handleFogDataChange(state.fogData);
        console.log("Fog Data");
    }, [state.fogData]);

    const init = () => {
        // Container
        port = viewportRef.current;
        // Create scene.
        scene = new THREE.Scene();

        createRenderer();
        createCamera();
        createOrbitControl();
        RectAreaLightUniformsLib.init();
        setUpTransformControls();
        setUpFogWhiteLightScene();
        createMeshes();
        createFog();
        scene.add(transformControl);
        renderer.setAnimationLoop(updateScene);
    };

    // Effect when user
    React.useEffect(() => {
        if (!grid) return;
        handleGridToggle(state.showGrid);
    }, [state.showGrid]);

    // Effect on snap
    React.useEffect(() => {
        if (state.snap == null) return;
        snap(state.hideGroundOnSnap.value);
    }, [state.snap]);

    const updateScene = () => {
        renderer.render(scene, camera);
    };

    const getThreeObjects = () => {
        return { camera, scene, orbitControl };
    };

    const createCamera = () => {
        // Create camera.
        camera = new THREE.PerspectiveCamera(
            35, // FOV
            props.width / props.height, // aspect
            0.1, // near clipping plane
            10000 // far clipping plane
        );
        camera.position.set(10, 20, 30);
    };

    const createFog = () => {
        const color = 0xffffff; // white
        const near = 10;
        const far = 100;
        scene.fog = new THREE.Fog(color, near, far);
    };

    const handleFogDataChange = changedData => {
        console.log(changedData);
        if (!changedData.visible) {
            scene.fog.near = 0.1;
            scene.fog.far = 50000;
            updateScene();
            return;
        }

        scene.fog.color = new THREE.Color(
            `rgb(${changedData.color.r * 255}, ${changedData.color.g * 255}, ${changedData.color.b *
                255})`
        );
        scene.fog.far = changedData.far;
        scene.fog.near = changedData.near;

        updateScene();
    };

    const addHemiLight = (colors: THREE.Color[], intensity) => {
        let light = new THREE.HemisphereLight(colors[0], colors[1], intensity);
        let lightHelper = new THREE.HemisphereLightHelper(light, 5);
        light.position.set(0, 20, 0);
        scene.add(light);
        scene.add(lightHelper);

        let out: ILight = {
            id: light.id,
            color: [
                light.skyColor || new Color(0xffffff),
                light.groundColor || new Color(0xffffff)
            ],
            intensity: light.intensity,
            type: "HemisphereLight",
            helperId: lightHelper.id
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const addDirLight = (colors: THREE.Color[], intensity) => {
        let light1 = new THREE.DirectionalLight(colors[0], intensity);
        light1.position.set(0, 20, 0);
        light1.castShadow = true;
        light1.shadow.camera.top = 1000;
        light1.shadow.camera.bottom = -1000;
        light1.shadow.camera.left = -1000;
        light1.shadow.camera.right = 1000;
        light1.shadow.mapSize.width = 1024 * 5;
        light1.shadow.mapSize.height = 1024 * 5;

        const light1Helper = new THREE.DirectionalLightHelper(light1, 5);
        scene.add(light1);
        scene.add(light1Helper);

        let out: ILight = {
            id: light1.id,
            color: [light1.color],
            intensity: light1.intensity,
            type: "DirectionalLight",
            helperId: light1Helper.id
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const addAmbLight = (colors: THREE.Color[], intensity) => {
        let light1 = new THREE.AmbientLight(colors[0], intensity);
        light1.position.set(0, 0, 0);
        scene.add(light1);

        let out: ILight = {
            id: light1.id,
            color: [light1.color],
            intensity: light1.intensity,
            type: "AmbientLight"
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const addPointLight = (colors: THREE.Color[], intensity, distance) => {
        let light1 = new THREE.PointLight(colors[0], intensity, distance);
        light1.position.set(0, 50, 0);
        light1.castShadow = true;
        light1.decay = 1;
        const light1Helper = new THREE.PointLightHelper(light1, 5);
        scene.add(light1);
        scene.add(light1Helper);

        let out: ILight = {
            id: light1.id,
            color: [light1.color],
            intensity: light1.intensity,
            type: "PointLight",
            helperId: light1Helper.id,
            distance,
            decay: 1
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const addSpotLight = (colors: THREE.Color[], intensity) => {
        let light1 = new THREE.SpotLight(colors[0], intensity);
        light1.position.set(0, 80, 0);
        light1.angle = Math.PI / 3;
        light1.penumbra = 1;
        light1.decay = 1;
        light1.distance = 200;
        light1.castShadow = true;
        light1.shadow.mapSize.width = 1024 * 5;
        light1.shadow.mapSize.height = 1024 * 5;
        const spotLightHelpers = new THREE.Group();
        spotLightHelpers.name = "Spot Light Helpers";

        const light1Helper = new THREE.SpotLightHelper(light1);
        spotLightHelpers.add(light1Helper);
        const shadowCameraHelper = new THREE.CameraHelper(light1.shadow.camera);
        spotLightHelpers.add(shadowCameraHelper);
        spotLightHelpers.add(new THREE.AxesHelper(10));
        light1.add(spotLightHelpers);

        scene.add(light1);

        let out: ILight = {
            id: light1.id,
            color: colors,
            intensity: intensity,
            type: "SpotLight",
            angle: Math.PI / 3,
            decay: 2,
            penumbra: 0.05,
            distance: 10,
            helperId: spotLightHelpers.id
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const addRectLight = (
        colors: THREE.Color[],
        intensity: number,
        width: number,
        height: number
    ) => {
        let lightGroup = new THREE.Group();
        lightGroup.name = "RectAreaLightControl";

        let rectLight = new THREE.RectAreaLight(colors[0], intensity, width, height);
        rectLight.position.set(0, 20, 0);
        rectLight.lookAt(0, 0, 0);

        let rectLightMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide
            })
        );
        rectLightMesh.scale.x = rectLight.width;
        rectLightMesh.scale.y = rectLight.height;

        rectLight.color.setRGB(colors[0].r, colors[0].g, colors[0].b);
        (rectLightMesh.material as any).color
            .copy(rectLight.color)
            .multiplyScalar(rectLight.intensity);

        let rectLightMeshBack = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(),
            new THREE.MeshBasicMaterial({ color: 0x080808 })
        );

        rectLight.add(rectLightMesh);
        rectLightMesh.add(rectLightMeshBack);

        lightGroup.add(rectLight);
        scene.add(lightGroup);

        let out: ILight = {
            id: lightGroup.id,
            color: [colors[0]],
            intensity: intensity,
            type: "RectAreaLight",
            width,
            height,
            helperId: rectLight.id,
            lightMeshId: rectLightMesh.id,
            lightBackMeshId: rectLightMeshBack.id
        };

        dispatch({
            type: "ADD_LIGHT_TO_SCENE",
            payload: out
        });
    };

    const handleLightDataChange = (lightData: ILight) => {
        const lit = scene.getObjectById(lightData.id);
        // update color
        if (lightData.type == "HemisphereLight") {
            lit.skyColor = new THREE.Color(
                `rgba(${lightData.color[0].r * 255}, ${lightData.color[0].g * 255}, ${lightData
                    .color[0].b * 255})`
            );
            console.log("skyColor", lit.skyColor);
            lit.groundColor = new THREE.Color(
                `rgba(${lightData.color[1].r * 255}, ${lightData.color[1].g * 255}, ${lightData
                    .color[1].b * 255})`
            );
            if (lightData.intensity) lit.intensity = lightData.intensity;
        } else if (lightData.type == "RectAreaLight") {
            console.log("Rect Light");
            const rectLight = scene.getObjectById(lightData.helperId);

            const rectLightMesh = scene.getObjectById(lightData.lightMeshId);
            // set rect light color
            rectLight.color.setRGB(
                lightData.color[0].r,
                lightData.color[0].g,
                lightData.color[0].b
            );
            (rectLightMesh.material as any).color
                .copy(rectLight.color)
                .multiplyScalar(rectLight.intensity);
            // update intensity
            if (lightData.intensity) {
                rectLight.intensity = lightData.intensity;
                rectLightMesh.material.color
                    .copy(rectLight.color)
                    .multiplyScalar(rectLight.intensity);
            }

            if (lightData.height) {
                rectLight.height = lightData.height;
                rectLightMesh.scale.y = lightData.height;
            }

            if (lightData.width) {
                rectLight.width = lightData.width;
                rectLightMesh.scale.x = lightData.width;
            }
        } else if (lightData.type == "SpotLight") {
            lit.color = new THREE.Color(
                `rgba(${lightData.color[0].r * 255}, ${lightData.color[0].g * 255}, ${lightData
                    .color[0].b * 255})`
            );
            if (lightData.intensity) lit.intensity = lightData.intensity;
            if (lightData.angle) lit.angle = lightData.angle;
            if (lightData.penumbra) lit.penumbra = lightData.penumbra;
            const helpers = scene.getObjectById(lightData.helperId);
            helpers.traverse(helper => {
                if (typeof helper.update == "function") {
                    console.log("Update Helper", helper.constructor.name);
                    helper.update();
                }
            });
        } else {
            lit.color = new THREE.Color(
                `rgba(${lightData.color[0].r * 255}, ${lightData.color[0].g * 255}, ${lightData
                    .color[0].b * 255})`
            );
            if (lightData.intensity) lit.intensity = lightData.intensity;
        }

        // update other properties ...
        if (lightData.decay) lit.decay = lightData.decay;
        if (lightData.distance) lit.distance = lightData.distance;

        updateScene();
        console.log("change scene light");
    };

    const handleAddLight = type => {
        switch (type.split("-")[0]) {
            case "HemisphereLight":
                addHemiLight([new THREE.Color(), new THREE.Color()], 1);
                break;
            case "DirectionalLight":
                addDirLight([new THREE.Color()], 1);
                break;
            case "PointLight":
                addPointLight([new THREE.Color()], 20, 100);
                break;
            case "RectAreaLight":
                addRectLight([new THREE.Color()], 1, 50, 50);
                break;
            case "SpotLight":
                addSpotLight([new THREE.Color()], 100);
                break;
            case "AmbientLight":
                addAmbLight([new THREE.Color()], 1);
                break;
        }
    };

    const setUpFogWhiteLightScene = () => {
        addHemiLight([new THREE.Color(0xffffff), new THREE.Color(0x444444)], 1);
        addDirLight([new THREE.Color(0xffffff)], 1.5);
        addGround();
        addGrid();
    };

    const setUpTransformControls = () => {
        transformControl = new TransformControls(camera, port);
        transformControl.addEventListener("change", updateScene);
        transformControl.addEventListener("dragging-changed", function(event) {
            orbitControl.enabled = !event.value;
        });
        // transformControl.addEventListener("mouseUp", function() {
        //   const object = transformControl.object;

        //   if (object !== undefined) {
        //     switch (transformControl.getMode()) {
        //       case "translate":

        //         break;
        //     }
        //   }
        // });
    };

    const createMeshes = () => {
        // Create cube and add to scene.
        let material = new THREE.MeshStandardMaterial({
            color: 0x00ff00
        });
        let geometry = new THREE.BoxGeometry(20, 20, 20);
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 10, 0);
        mesh.castShadow = true;
        mesh.name = "Cube";
        transformControl.attach(mesh);
        addObjectToScene(mesh);
    };

    const addGround = () => {
        // ground
        let mesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(1000, 1000, 100, 100),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                depthWrite: false
            })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.name = "ground";
        objectsForSelection.push(mesh);
        scene.add(mesh);
    };

    const addGrid = () => {
        grid = new THREE.GridHelper(1000, 50, 0x000000, 0x000000);
        (grid.material as any).opacity = 0.2;
        (grid.material as any).transparent = true;
        grid.name = "grid";
        fitCameraToSelection(camera, orbitControl, [grid], 0.1);
        scene.add(grid);
    };

    const handleGridToggle = toggle => {
        grid.visible = toggle;
        updateScene();
    };

    const createRenderer = () => {
        // Renderer.
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        renderer.setSize(props.width, props.height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.gammaFactor = 2.2;
        renderer.gammaOutput = true;
        renderer.physicallyCorrectLights = true;
        renderer.shadowMap.enabled = true;
        port.appendChild(renderer.domElement);
        // Add renderer to page
    };

    const createOrbitControl = () => {
        orbitControl = new OrbitControls(camera, port);
        orbitControl.update();
        orbitControl.addEventListener("change", updateScene);
    };

    const handleUserKeyDownInput = event => {
        switch (event.keyCode) {
            case 81: // Q
                transformControl.setSpace(transformControl.space === "local" ? "world" : "local");
                break;

            case 17: // Ctrl
                transformControl.setTranslationSnap(100);
                transformControl.setRotationSnap(THREE.Math.degToRad(15));
                break;

            case 87: // W
                transformControl.setMode("translate");
                break;

            case 69: // E
                transformControl.setMode("rotate");
                break;

            case 82: // R
                transformControl.setMode("scale");
                break;

            case 187:
            case 107: // +, =, num+
                transformControl.setSize(transformControl.size + 0.1);
                break;

            case 189:
            case 109: // -, _, num-
                transformControl.setSize(Math.max(transformControl.size - 0.1, 0.1));
                break;

            case 88: // X
                transformControl.showX = !transformControl.showX;
                break;

            case 89: // Y
                transformControl.showY = !transformControl.showY;
                break;

            case 90: // Z
                transformControl.showZ = !transformControl.showZ;
                break;

            case 32: // Spacebar
                transformControl.enabled = !transformControl.enabled;
                break;
        }
    };

    const handleUserKeyUpInput = event => {
        switch (event.keyCode) {
            case 17: // Ctrl
                transformControl.setTranslationSnap(null);
                transformControl.setRotationSnap(null);
                break;
        }
    };

    const clearMeshesFromScene = () => {
        try {
            console.log(scene);
            // empty objects for selection ....
            objectsForSelection = [];
            scene.children.forEach(element => {
                if (element instanceof THREE.Group) scene.remove(element);
                if (element instanceof THREE.Mesh) scene.remove(element);
            });
        } catch (e) {
            console.log(e);
        }
    };

    const removeItemFromScene = id => {
        console.log("DELETE ID:", id);
        // remove from selectable objects ...
        try {
            const obj = scene.getObjectById(id);
            if (transformControl.object && transformControl.object.id == id)
                transformControl.detach();
            let index = 0;
            for (const item of objectsForSelection) {
                if (item.id == id) objectsForSelection.splice(index, 1);
                index += 1;
            }
            scene.remove(obj);

            // crosscheck list of lights in scene
            let i = 0;
            for (const c of state.lightsInScene) {
                if (c.id == id) {
                    dispatch({
                        type: "REMOVE_LIGHT_FROM_SCENE",
                        payload: i
                    });
                    scene.remove(scene.getObjectById(c.helperId));
                    break;
                }
                i += 1;
            }
        } catch (e) {
            console.log(e);
        }
        updateScene();
        handleInspector();
    };

    const handleModelImport = () => {
        if (!state.importData) return;
        transformControl.detach();
        // clearMeshesFromScene();
        dispatch({
            type: "LOADING_MODEL",
            payload: "Loading 3D Scene"
        });
        const type = state.importType;
        const data = state.importData;
        switch (type) {
            case "glb":
            case "glb_tex":
                loadGLTF({
                    glb: data.glb,
                    bin: data.bin,
                    textures: data.textures
                });
                break;
            case "obj":
            case "obj_mtl":
                loadOBJ({
                    obj: data.obj,
                    mtl: data.mtl,
                    textures: data.textures
                });
                break;
            case "fbx":
                loadFBX({
                    fbx: data.fbx,
                    textures: data.textures
                });
                break;
        }
    };

    const handle3dLoadErr = type => {
        dispatch({ type: "DONE_LOADING_MODEL" });
        (window as any).third_alert(
            type == "texture"
                ? "😞 Unable to load model, please provide all textures."
                : "😢 An error occured while trying to load model!"
        );
    };

    const loadGLTF = async blobs => {
        // import GLTF File ...
        importGLB(
            blobs.glb,
            blobs.bin,
            blobs.textures,
            glb => {
                const { camera, scene, orbitControl } = getThreeObjects();
                dispatch({ type: "DONE_LOADING_MODEL" });
                fitCameraToSelection(camera, orbitControl, [glb.scene]);
                addObjectToScene(glb.scene, true);
                transformControl.attach(glb.scene);
            },
            (err, type) => {
                handle3dLoadErr(type);
            }
        );
    };

    const loadOBJ = async blobs => {
        // import OBJ File ...
        importOBJ(
            blobs.obj,
            blobs.mtl,
            blobs.textures,
            model => {
                const { camera, scene, orbitControl } = getThreeObjects();
                dispatch({ type: "DONE_LOADING_MODEL" });
                fitCameraToSelection(camera, orbitControl, [model]);
                addObjectToScene(model, true);
                transformControl.attach(model);
            },
            (err, type) => {
                handle3dLoadErr(type);
            }
        );
    };

    const loadFBX = async blobs => {
        // import FBX File ...
        importFBX(
            blobs.fbx,
            blobs.textures,
            fbx => {
                const { camera, scene, orbitControl } = getThreeObjects();
                dispatch({ type: "DONE_LOADING_MODEL" });
                fitCameraToSelection(camera, orbitControl, [fbx]);
                addObjectToScene(fbx, true);
                transformControl.attach(fbx);
            },
            (err, type) => {
                handle3dLoadErr(type);
            }
        );
    };

    const clearForSnap = hideGround => {
        try {
            console.log("HHide", hideGround);
            const ground = scene.getObjectByName("ground");
            if (ground && hideGround) ground.visible = false;
            scene.getObjectByName("grid").visible = false;
            transformControl.detach();
            toggleLightHelpers();
        } catch (e) {}
        // clear grid and floor...
    };

    const toggleLightHelpers = (show = false) => {
        for (const light of state.lightsInScene) {
            if (light.type == "RectAreaLight") {
                const rectLight = scene.getObjectById(light.helperId);
                for (const child of rectLight.children) {
                    console.log("hide ", child.constructor.name);
                    child.visible = show;
                }
            } else {
                scene.getObjectById(light.helperId).visible = show;
            }
        }
        updateScene();
    };

    const fallbackFromSnap = hideGround => {
        try {
            const ground = scene.getObjectByName("ground");
            if (hideGround) ground.visible = true;
            scene.getObjectByName("grid").visible = true;
            transformControl.attach(scene.getObjectByName("#preview_model#"));
            toggleLightHelpers(true);
        } catch (e) {}
    };

    const snap = hideGround => {
        clearForSnap(hideGround);
        renderer.render(scene, camera);
        renderer.domElement.toBlob(blob => {
            encode(blob).then(imageData => {
                parent.postMessage(
                    {
                        pluginMessage: {
                            type: "applySnapshot",
                            imageData: imageData
                        }
                    },
                    "*"
                );
                fallbackFromSnap(hideGround);
            });
        });
    };

    // Object selection handlers
    const getIntersects = (point, objects) => {
        mouse.set(point.x * 2 - 1, -(point.y * 2) + 1);
        raycaster.setFromCamera(mouse, camera);
        console.log(5, "RAYCASTER", raycaster);
        return raycaster.intersectObjects(objects);
    };

    const getMousePosition = (dom, x, y) => {
        const rect = dom.getBoundingClientRect();
        return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
    };

    const onMouseDown = event => {
        event.preventDefault();
        const array = getMousePosition(port, event.clientX, event.clientY);
        onDownPosition.fromArray(array);
        console.log(1, "DOWN_POS", onDownPosition);
        document.addEventListener("mouseup", onMouseUp, false);
    };

    const onMouseUp = event => {
        const array = getMousePosition(port, event.clientX, event.clientY);
        onUpPosition.fromArray(array);
        console.log(2, "UP_POS", onDownPosition);
        handleClick();
        document.removeEventListener("mouseup", onMouseUp, false);
    };

    const handleClick = () => {
        if (onDownPosition.distanceTo(onUpPosition) === 0) {
            const intersects = getIntersects(onUpPosition, getAllObjects());
            console.log(4, "INTERSET", intersects);

            if (intersects.length > 0) {
                const object = intersects[0].object;

                if (object.userData.object !== undefined) {
                    // a helper
                    attachObjectToTransformControl(object.userData.object);
                } else {
                    attachObjectToTransformControl(object);
                }
            } else {
                transformControl.detach();
            }

            updateScene();
        }
    };

    const onDoubleClick = event => {
        const array = getMousePosition(port, event.clientX, event.clientY);
        onDoubleClickPosition.fromArray(array);

        const intersects = getIntersects(onDoubleClickPosition, getAllObjects());

        if (intersects.length > 0) {
            const intersect = intersects[0];

            setObjectAsPivotPoint(intersect.object);
        }
    };

    const attachObjectToTransformControl = object => {
        if (object.name == "grid") return;
        transformControl.detach();
        transformControl.attach(object);
        selectedID = object.id;
    };

    const getAllObjects = () => {
        return objectsForSelection;
    };

    const setObjectAsPivotPoint = object => {
        if (!object) return;
        orbitControl.target.set(object.position.x, object.position.y, object.position.z);
        orbitControl.update();
    };

    const addObjectToScene = (object, strip = false) => {
        if (!strip) {
            object.name += " #preview_model#";
            objectsForSelection.push(object);
        } else {
            if (object instanceof THREE.Group) {
                console.log(1, "A GROUP");
                object.traverse(obj => {
                    if (obj instanceof THREE.Mesh) {
                        obj.name += " #preview_model#";
                        objectsForSelection.push(obj);
                    }
                });
            }
        }
        console.log("OBJS", objectsForSelection);
        scene.add(object);
    };

    // Inspector selection handler ...
    const handleInspector = () => {
        const sceneTree = traverseAndGetData(new Tree(null), scene);
        console.log("SCENE TREE", sceneTree);
        dispatch({
            type: "SET_SCENE_TREE",
            payload: sceneTree
        });
    };

    const traverseAndGetData = (parent, node) => {
        for (const childNode of node.children) {
            if (!(treeBlackList as any).includes(childNode.constructor.name)) {
                const childTree = new Tree(parent);
                // set tree data
                childTree.id = childNode.id;
                childTree.type = childNode.constructor.name;
                childTree.name =
                    childNode.name.trim() == ""
                        ? childTree.type
                        : childNode.name.replace(" #preview_model#", "");
                childTree.visible = childNode.visible;
                childTree.castShadow = childNode.castShadow;
                childTree.receiveShadow = childNode.receiveShadow;
                if (selectedID && selectedID == childNode.id) childTree.active = true;
                parent.add(childTree);
                traverseAndGetData(childTree, childNode);
            }
        }

        return parent;
    };

    const handleUserSelectOnInspector = (selectedTreeNode: Tree) => {
        if (!selectedTreeNode) return;
        console.log("[INSPECTOR]: USER SELECTS", selectedTreeNode);
        attachObjectToTransformControl(scene.getObjectById(selectedTreeNode.id));
    };

    const handleItemHideToggle = id => {
        const item = scene.getObjectById(id);
        item.visible = !item.visible;
        updateScene();
    };

    const handleShadowToggle = (id, cast = false) => {
        const item = scene.getObjectById(id);
        if (cast) {
            if (item.hasOwnProperty("castShadow")) item.castShadow = !item.castShadow;
            if (item.hasOwnProperty("traverse"))
                item.traverse(eachItem => {
                    if (eachItem.hasOwnProperty("castShadow"))
                        eachItem.castShadow = item.castShadow;
                });
        } else {
            if (item.hasOwnProperty("receiveShadow")) item.receiveShadow = !item.receiveShadow;
            if (item.hasOwnProperty("traverse"))
                item.traverse(eachItem => {
                    if (eachItem.hasOwnProperty("receiveShadow"))
                        eachItem.receiveShadow = item.receiveShadow;
                });
        }
        updateScene();
    };

    const handleTransformControlMode = (mode: string) => {
        transformControl.setMode(mode);
    };

    const handleTransformControlPivot = () => {
        setObjectAsPivotPoint(transformControl.object);
    };

    const treeBlackList: string[] = [
        "TransformControls",
        "GridHelper",
        "DirectionalLightHelper",
        "HemisphereLightHelper",
        "PointLightHelper",
        "RectAreaLightHelper",
        "SpotLightHelper"
    ];

    return (
        <div>
            {state.loading && (
                <Loader height={props.height} width={props.width} text={state.loadingText}></Loader>
            )}
            <div
                className="viewport"
                ref={viewportRef}
                style={{
                    height: props.height ? props.height + "px" : "200px",
                    width: props.width + "px"
                }}></div>
        </div>
    );
}
