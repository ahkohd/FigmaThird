import {
    MeshStandardMaterial,
    BoxGeometry,
    Mesh,
    PlaneBufferGeometry,
    MeshPhongMaterial,
    GridHelper,
    TextureLoader,
    sRGBEncoding,
    ShadowMaterial
} from "three";
import imageTextureBase64 from "../../image";

/**
 * Setup viewport primitive objects.
 * @param param0
 */
export default function createMeshes({ track, addObjectToScene, transformControl }) {
    // Create cube and add to scene.
    // Create texture for material
    var texture = new TextureLoader().load(imageTextureBase64);
    texture.encoding = sRGBEncoding;
    let material = track(
        new MeshStandardMaterial({
            map: texture
        })
    );
    let geometry = new BoxGeometry(20, 20, 20);
    let mesh = track(new Mesh(geometry, material));

    mesh.position.set(0, 0, 0);
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
    const planeMaterial = track(new ShadowMaterial());
    planeMaterial.opacity = 0.2;


    let mesh = track(
        new Mesh(
            track(new PlaneBufferGeometry(1000, 1000, 100, 100)),
            planeMaterial
        )
    );

    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    mesh.name = "ground";
    mesh.position.y = -10;
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
    grid.position.y = -9.7;
    scene.add(grid);
    return grid;
}
