import { Fog, Scene, Color } from "three";

/**
 * Hook that creates and manages ThreeJS scene fog.
 * @param scene ThreeJS scene.
 * @param updateScene Scene update callback function.
 */

export function useFog(scene: Scene, updateScene: Function) {
    console.log("FOG HOOK /");
    const color = 0xffffff; // white
    const near = 10;
    const far = 100;
    const fog = scene.fog = new Fog(color, near, far);

    return {
        fog, setFog: (changedData) => {
            console.log("FOG HOOK /", changedData);
            if (!changedData.visible) {
                fog.near = 0.1;
                fog.far = 50000;
                updateScene();
                return;
            }
            fog.color = new Color(
                `rgb(${changedData.color.r * 255}, ${changedData.color.g * 255}, ${changedData.color.b *
                255})`
            );
            fog.far = changedData.far;
            fog.near = changedData.near;
        }
    };
}