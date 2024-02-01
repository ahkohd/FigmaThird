import { WebGLRenderer } from "three";

/**
 * Hook that creates ThreeJS WebGL renderer.
 * @param container Container element of the canvas that holds the renderer.
 * @param param2 [width, height] of viewport.
 */

export function useRenderer(container: HTMLDivElement, [width, height]: number[]) {
    const renderer = new WebGLRenderer({
        antialias: true,
        alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    return renderer;
}

