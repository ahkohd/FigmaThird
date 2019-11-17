import {
    MeshStandardMaterial,
    BoxGeometry,
    Mesh,
    PlaneBufferGeometry,
    MeshPhongMaterial,
    GridHelper
} from "three";

/**
 * Setup viewport primitive objects.
 * @param param0
 */
export default function createMeshes({ track, addObjectToScene, transformControl }) {
    // Create cube and add to scene.
    let material = track(
        new MeshStandardMaterial({
            color: 0x00ff00
        })
    );
    let geometry = track(new BoxGeometry(20, 20, 20));
    let mesh = track(new Mesh(geometry, material));
    mesh.position.set(0, 10, 0);
    mesh.castShadow = true;
    mesh.name = "Cube";
    transformControl.attach(mesh);
    addObjectToScene(mesh);
}

/**
 * Add a plane to the scene to serve as ground.
 * @param param0
 */
export function addGround({ track, objectsForSelection, scene }) {
    // ground
    let mesh = track(
        new Mesh(
            new PlaneBufferGeometry(1000, 1000, 100, 100),
            new MeshPhongMaterial({
                color: 0xffffff,
                depthWrite: false
            })
        )
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    objectsForSelection.push(mesh);
    scene.add(mesh);
}

/**
 * Add a grid helper to the scene.
 * @param param0
 */
export function addGrid({ track, scene }) {
    let grid = track(new GridHelper(1000, 50, 0x000000, 0x000000));
    (grid.material as any).opacity = 0.2;
    (grid.material as any).transparent = true;
    grid.name = "grid";
    scene.add(grid);
    return grid;
}
