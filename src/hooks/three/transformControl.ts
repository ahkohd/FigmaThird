import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Hook that creates ThreeJS Transform Controls.
 * @param orbitControl
 * @param camera Camera to add the TransformControls.
 * @param container Element holding the canvas.
 * @param updateScene Fuction to update scene.
 */

export function useTransformControl(orbitControl: OrbitControls, camera: THREE.PerspectiveCamera, container, updateScene) {
    const transformControl = new TransformControls(camera, container);
    transformControl.addEventListener("change", updateScene);
    transformControl.addEventListener("dragging-changed", function (event) {
        orbitControl.enabled = !event.value;
    });
    return transformControl;
}