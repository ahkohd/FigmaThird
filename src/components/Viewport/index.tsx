import * as React from "react";
import AppContext from "../../context";
import * as THREE from "three";
import Tree from "../../utils/Tree";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import ResourceTracker from "../../utils/ResourceTracker";
import Loader from "../Loader";
import { encode } from "../../utils/utils";
import { ILight } from "../../utils/ILight";
import { useRenderer } from "../../hooks/three/renderer";
import { useCamera } from "../../hooks/three/camera";
import { useOrbitControl } from "../../hooks/three/orbitControl";
import { useTransformControl } from "../../hooks/three/transformControl";
import { useFog } from "../../hooks/three/fog";
import { useStateChange } from "../../hooks/stateChange";
import {
    addHemiLight,
    addDirLight,
    addPointLight,
    addRectLight,
    addSpotLight,
    addAmbLight
} from "./light-utils";
import { loadGLTF, loadOBJ, loadFBX } from "./load-utils";
import createMeshes, { addGround, addGrid } from "./object-utils";
import {
    onMouseDown,
    cleanupKeyAndMouseEventListeners,
    setupKeyAndMouseEventListeners
} from "./keybinds-utils";

// ThreeJS specific vars.
let scene;
let camera;
let orbitControl;
let transformControl;
let renderer;
let grid;
let sceneFog;
let resourceTracker;
let track;

// ThreeJS Object selection vars
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let onDownPosition = new THREE.Vector2();
let onUpPosition = new THREE.Vector2();
let onDoubleClickPosition = new THREE.Vector2();
let objectsForSelection: any[] = [];

// Viewport component
export default function Viewport(props) {
    const { state, dispatch }: any = React.useContext(AppContext);

    const viewportRef = React.useRef();
    let port: HTMLDivElement;
    let selectedID: number;

    React.useEffect(() => {
        init();
        setupKeyAndMouseEventListeners({
            transformControl,
            getMousePosition,
            port,
            onDownPosition,
            onMouseUp,
            onDoubleClickPosition,
            getAllObjects,
            getIntersects,
            setObjectAsPivotPoint
        });
        return () => {
            cleanupKeyAndMouseEventListeners({
                transformControl,
                getMousePosition,
                port,
                onDownPosition,
                onMouseDown,
                onMouseUp
            });
        };
    }, []);

    // Import model data when importData state changes.
    useStateChange(state.importData, () => handleModelImport());

    // Effect when use opens the inspector view.
    useStateChange(
        state.activeTab,
        ({ nextState }) => nextState == "inspector" && handleInspector()
    );

    // Effect when user selects a node(item in list) at the inspector.
    useStateChange(state.selectItemInTree, ({ nextState }) =>
        handleUserSelectOnInspector(nextState.node)
    );

    // Effect when user toggles hide button on an item at the inspector.
    useStateChange(state.hideItemValue, ({ nextState }) =>
        handleItemHideToggle(parseInt(nextState.id))
    );

    // Effect when user toggles cast shadow button on an item at the inspector.
    useStateChange(state.shadowCItemValue, ({ nextState }) =>
        handleShadowToggle(parseInt(nextState.id), true)
    );

    // Effect when user toggles recive shadow button on an item at the inspector.
    useStateChange(state.shadowRItemValue, ({ nextState }) =>
        handleShadowToggle(parseInt(nextState.id))
    );

    // Effect when user clicks delete button on an item at the inspector.
    useStateChange(state.hideItemDelete, ({ nextState }) => removeItemFromScene(nextState.id));

    // Effect when user clicks translate mode change buttons.
    useStateChange(state.transformControlMode, ({ nextState }) =>
        handleTransformControlMode(nextState.type)
    );

    // Watch for when user requests to set current transform object as pivot.
    useStateChange(state.transformControlPivot, () => handleTransformControlPivot());

    // Effect when user changes light color change.
    useStateChange(state.updateLightData, ({ nextState }) => handleLightDataChange(nextState));

    // Effect when user clicks add light button.
    useStateChange(state.requestAddLight, ({ nextState }) => handleAddLight(nextState));

    // Effect when user changes fog data.
    useStateChange(state.fogData, ({ nextState }) => sceneFog.setFog(nextState));

    // Effect when user toggles show grid check box at the inspector.
    useStateChange(state.showGrid, ({ nextState }) => handleGridToggle(nextState));

    // Effect when user clicks snap button.
    useStateChange(state.snap, ({ nextState }) => snap(state.hideGroundOnSnap.value));

    // Setup viewport ...
    const init = () => {
        // Create a resource tracker.
        resourceTracker = new ResourceTracker();
        track = resourceTracker.track.bind(resourceTracker);
        // Setup viewport.
        port = viewportRef.current;
        // Create scene.
        scene = new THREE.Scene();
        renderer = useRenderer(port, [props.width, props.height]);
        camera = useCamera([props.width, props.height]);
        orbitControl = useOrbitControl(camera, port, updateScene);
        RectAreaLightUniformsLib.init();
        transformControl = useTransformControl(orbitControl, camera, port, updateScene);
        setupViewportEnvironment();
        createMeshes({ track, addObjectToScene, transformControl });
        sceneFog = useFog(scene, updateScene);
        scene.add(transformControl);
        renderer.setAnimationLoop(updateScene);
    };

    /**
     * updates THREE JS scene.
     */
    const updateScene = () => {
        renderer.render(scene, camera);
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
                addHemiLight({ scene, track, dispatch }, [new THREE.Color(), new THREE.Color()], 1);
                break;
            case "DirectionalLight":
                addDirLight({ scene, track, dispatch }, [new THREE.Color()], 1);
                break;
            case "PointLight":
                addPointLight({ scene, track, dispatch }, [new THREE.Color()], 20, 100);
                break;
            case "RectAreaLight":
                addRectLight({ scene, track, dispatch }, [new THREE.Color()], 1, 50, 50);
                break;
            case "SpotLight":
                addSpotLight({ scene, track, dispatch }, [new THREE.Color()], 100);
                break;
            case "AmbientLight":
                addAmbLight({ scene, track, dispatch }, [new THREE.Color()], 1);
                break;
        }
    };

    const setupViewportEnvironment = () => {
        addHemiLight(
            { scene, track, dispatch },
            [new THREE.Color(0xffffff), new THREE.Color(0x444444)],
            1
        );
        addDirLight({ scene, track, dispatch }, [new THREE.Color(0xffffff)], 1.5);
        addGround({ track, objectsForSelection, scene });
        grid = addGrid({ track, scene });
    };

    const handleGridToggle = toggle => {
        grid.visible = toggle;
        updateScene();
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
                loadGLTF(
                    { dispatch, addObjectToScene, transformControl },
                    {
                        glb: data.glb,
                        bin: data.bin,
                        textures: data.textures
                    }
                );
                break;
            case "obj":
            case "obj_mtl":
                loadOBJ(
                    { dispatch, addObjectToScene, transformControl },
                    {
                        obj: data.obj,
                        mtl: data.mtl,
                        textures: data.textures
                    }
                );
                break;
            case "fbx":
                loadFBX(
                    { dispatch, addObjectToScene, transformControl },
                    {
                        fbx: data.fbx,
                        textures: data.textures
                    }
                );
                break;
        }
    };

    const clearForSnap = hideGround => {
        try {
            const ground = scene.getObjectByName("ground");
            if (ground && hideGround) ground.visible = false;
            scene.getObjectByName("grid").visible = false;
            transformControl.detach();
            toggleLightHelpers();
        } catch (e) {}
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

    const attachObjectToTransformControl = (object, viewport = true) => {
        if (object.name == "grid") return;
        transformControl.detach();
        transformControl.attach(object);
        selectedID = object.id;
        if (viewport) {
            console.log("NOT Viewport");
            dispatch({
                type: "SET_VIEWPORT_SELECTED_ITEM",
                payload: { id: selectedID, _t: new Date().getTime() }
            });
        }
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
        attachObjectToTransformControl(scene.getObjectById(selectedTreeNode.id), false);
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
