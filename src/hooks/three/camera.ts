import { PerspectiveCamera } from "three";

/**
 * Hook that creates ThreeJS PerspectiveCamera.
 * @param param1 [width, height] of viewport.
 */

export function useCamera([width, height]) {
    // Create camera.
    const camera = new PerspectiveCamera(
        35, // FOV
        width / height, // aspect
        0.1, // near clipping plane
        10000 // far clipping plane
    );
    camera.position.set(10, 20, 30);
    return camera;
}