import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Hook that creates ThreeJS OrbitControls and attach it to the camera.
 * @param camera Camera to add the OrbitControls.
 * @param container Element holding the canvas.
 * @param updateScene Fuction to update scene.
 */

export function useOrbitControl(camera: THREE.PerspectiveCamera, container, updateScene) {
    const orbitControl = new OrbitControls(camera, container);
    orbitControl.update();
    orbitControl.addEventListener("change", updateScene);
    orbitControl.maxDistance = 8000;
    orbitControl.minDistance = 20;
    return orbitControl;
}