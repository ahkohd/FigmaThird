import * as React from "react";
import AppContext from "../context";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

import Loader from "./Loader";
import { encode } from "../utils";
import {
  importOBJ,
  importGLB,
  importFBX,
  fitCameraToSelection
} from "./Importer";

let scene;
let camera;
let orbitControl;
let transformControl;

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
  let renderer;

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

  const init = () => {
    // Container
    port = viewportRef.current;
    // Create scene.
    scene = new THREE.Scene();

    createRenderer();
    createCamera();
    createOrbitControl();
    setUpTransformControls();
    setUpFogWhiteLightScene();
    createMeshes();
    scene.add(transformControl);
    renderer.setAnimationLoop(updateScene);
    dispatch({ type: "SET_SNAP_HANDLER", payload: snap });
  };

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

  const createLights = () => {
    const ambientLight = new THREE.HemisphereLight(
      0xddeeff, // sky color
      0x202020, // ground color
      5 // intensity
    );
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);
    scene.add(ambientLight, mainLight);
  };

  const setUpFogWhiteLightScene = () => {
    // scene.background = new THREE.Color(0xa0a0a0);
    // scene.fog = new THREE.Fog(0xffffff, 5000, 10000);
    let light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    let light1 = new THREE.DirectionalLight(0xffffff, 1.5);
    light1.position.set(0, 20, 0);
    light1.castShadow = true;
    light1.shadow.camera.top = 18;
    light1.shadow.camera.bottom = -10;
    light1.shadow.camera.left = -12;
    light1.shadow.camera.right = 12;
    scene.add(light1);

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
    let material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    let geometry = new THREE.BoxGeometry(20, 20, 20);
    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 10, 0);
    mesh.castShadow = true;
    mesh.name = "preview_model";
    transformControl.attach(mesh);
    addObjectToScene(mesh);
  };

  const addGround = () => {
    // ground
    let mesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(1000, 1000),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    addObjectToScene(mesh);
  };

  const addGrid = () => {
    let grid = new THREE.GridHelper(1000, 50, 0x000000, 0x000000);
    (grid.material as any).opacity = 0.2;
    (grid.material as any).transparent = true;
    grid.name = "grid";
    fitCameraToSelection(camera, orbitControl, [grid], 0.1);
    scene.add(grid);
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
        transformControl.setSpace(
          transformControl.space === "local" ? "world" : "local"
        );
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
      scene.remove(scene.getObjectByName("preview_model"));
      let i = 0;
      for (const obj of objectsForSelection) {
        if (obj.name == "preview_model") {
          objectsForSelection.splice(i, 1);
          break;
        } else {
          i += 1;
        }
      }
    } catch (e) {}
  };

  const handleModelImport = () => {
    if (!state.importData) return;
    transformControl.detach();
    dispatch({ type: "LOADING_MODEL", payload: "Loading 3D Scene" });
    const type = state.importType;
    const data = state.importData;
    switch (type) {
      case "glb":
      case "glb_tex":
        loadGLTF({ glb: data.glb, bin: data.bin, textures: data.textures });
        break;
      case "obj":
      case "obj_mtl":
        loadOBJ({ obj: data.obj, mtl: data.mtl, textures: data.textures });
        break;
      case "fbx":
        loadFBX({ fbx: data.fbx, textures: data.textures });
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
        clearMeshesFromScene();
        fitCameraToSelection(camera, orbitControl, [glb.scene]);
        glb.scene.name = "preview_model";
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
        clearMeshesFromScene();
        fitCameraToSelection(camera, orbitControl, [model]);
        model.name = "preview_model";
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
        clearMeshesFromScene();
        fitCameraToSelection(camera, orbitControl, [fbx]);
        fbx.name = "preview_model";
        addObjectToScene(fbx, true);
        transformControl.attach(fbx);
      },
      (err, type) => {
        handle3dLoadErr(type);
      }
    );
  };

  const clearForSnap = () => {
    try {
      scene.getObjectByName("ground").visible = false;
      scene.getObjectByName("grid").visible = false;
      transformControl.detach();
    } catch (e) {}
    // clear grid and floor...
  };

  const fallbackFromSnap = () => {
    try {
      scene.getObjectByName("ground").visible = true;
      scene.getObjectByName("grid").visible = true;
      transformControl.attach(scene.getObjectByName("preview_model"));
    } catch (e) {}
  };

  const snap = (event?) => {
    clearForSnap();
    renderer.render(scene, camera);
    renderer.domElement.toBlob(blob => {
      encode(blob).then(imageData => {
        parent.postMessage(
          { pluginMessage: { type: "applySnapshot", imageData: imageData } },
          "*"
        );
        fallbackFromSnap();
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
  };

  const getAllObjects = () => {
    return objectsForSelection;
  };

  const setObjectAsPivotPoint = object => {
    orbitControl.target.set(
      object.position.x,
      object.position.y,
      object.position.z
    );
    orbitControl.update();
  };

  const addObjectToScene = (object, strip = false) => {
    if (!strip) {
      objectsForSelection.push(object);
    } else {
      if (object instanceof THREE.Group) {
        console.log(1, "A GROUP");
        object.traverse(obj => {
          if (obj instanceof THREE.Mesh) {
            console.log(obj.name);
            objectsForSelection.push(obj);
          }
        });
      }
    }
    scene.add(object);
  };

  return (
    <div>
      {state.loading && (
        <Loader
          height={props.height}
          width={props.width}
          text={state.loadingText}
        ></Loader>
      )}
      <div
        className="viewport"
        ref={viewportRef}
        style={{
          height: props.height ? props.height + "px" : "200px",
          width: props.width + "px"
        }}
      ></div>
    </div>
  );
}
