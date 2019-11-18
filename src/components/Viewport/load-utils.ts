import { importFBX, importOBJ, importGLB } from "../../utils/Importer";

/**
 * Notify the user about a import error.
 * @param param0
 * @param type
 */

const handle3dLoadErr = ({ dispatch }, type) => {
    dispatch({ type: "DONE_LOADING_MODEL" });
    (window as any).third_alert(
        type == "texture"
            ? "😞 Unable to load model, please provide all textures."
            : "😢 An error occured while trying to load model!"
    );
};

/**
 * Loads FBX 3D model into scene.
 * @param param0
 * @param blobs
 */

export async function loadFBX({ track, dispatch, addObjectToScene, transformControl }, blobs) {
    // import FBX File ...
    importFBX(
        blobs.fbx,
        blobs.textures,
        fbx => {
            dispatch({ type: "DONE_LOADING_MODEL" });
            addObjectToScene(fbx, true);
            track(fbx);
            transformControl.attach(fbx);
        },
        (err, type) => {
            handle3dLoadErr(type, dispatch);
        }
    );
}

/**
 * Loads OBJ 3D model into scene.
 * @param param0
 * @param blobs
 */

export async function loadOBJ({ track, dispatch, addObjectToScene, transformControl }, blobs) {
    // import OBJ File ...
    importOBJ(
        blobs.obj,
        blobs.mtl,
        blobs.textures,
        model => {
            dispatch({ type: "DONE_LOADING_MODEL" });
            addObjectToScene(model, true);
            track(model);
            transformControl.attach(model);
        },
        (err, type) => {
            handle3dLoadErr(type, dispatch);
        }
    );
}

/**
 * Loads GLTF/GLB files into scene.
 * @param param0
 * @param blobs
 */

export async function loadGLTF({ track, dispatch, addObjectToScene, transformControl }, blobs) {
    // import GLTF File ...
    importGLB(
        blobs.glb,
        blobs.bin,
        blobs.textures,
        glb => {
            dispatch({ type: "DONE_LOADING_MODEL" });
            track(glb.scene);
            addObjectToScene(glb.scene, true);
            transformControl.attach(glb.scene);
        },
        (err, type) => {
            handle3dLoadErr(type, dispatch);
        }
    );
}
