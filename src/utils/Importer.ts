import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Fits selected objects into the camera's view.
 * @param {THREE.PerspectiveCamera} camera PerspectiveCamera to fit the objects into its view.
 * @param {OrbitControls} controls OrbitControl control assigned to the perspective camera.
 * @param {THREE.Object3D[]} selection List of objects to fit into the camers's view.
 * @param {number} fitOffset Offset
 */

export function fitCameraToSelection(
    camera: THREE.PerspectiveCamera,
    controls: OrbitControls,
    selection: THREE.Object3D[],
    fitOffset: number = 1.2
) {
    const box = new THREE.Box3();

    for (const object of selection) box.expandByObject(object);

    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxSize = Math.max(size.x, size.y, size.z);
    const fitHeightDistance =
        maxSize / (2 * Math.atan((Math.PI * camera.fov) / 360));
    const fitWidthDistance = fitHeightDistance / camera.aspect;
    const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

    const direction = controls.target
        .clone()
        .sub(camera.position)
        .normalize()
        .multiplyScalar(distance);

    controls.maxDistance = distance * 10;
    controls.target.copy(center);

    camera.near = distance / 100;
    camera.far = distance * 100;
    camera.updateProjectionMatrix();

    camera.position.copy(controls.target).sub(direction);

    controls.update();
};

/**
 * Converts Model and Textures file list into Blob
 * @param {FileList} modelFiles Array FileList of models to convert to Blob.
 * @param {FileList} textures FileList of textures to convert to Blob.
 * @returns {Object} An object containing Blobs
 */

function mapInputToBlobList(modelFiles: FileList[], textures: FileList) {
    const blobs = {}
    for (const model of modelFiles) {
        if (!model) continue;
        blobs[model[0].name] = model[0];
    }

    if (!textures) return blobs;
    for (const texture of textures) {
        if (!texture) continue;
        blobs[texture.name] = texture;
    }
    return blobs;
}

/**
 * Imports OBJ model into scene.
 * @param {FileList} obj OBJ File.
 * @param {FileList} mtl MTL File.
 * @param {FileList} textures Textures File.
 * @param cb Callback function after model as been loaded.
 * @param onerror Callback when error ocurrs while importing model.
 */

export async function importOBJ(obj: FileList, mtl: FileList, textures: FileList, cb, onerror) {
    try {
        const blobs = mapInputToBlobList([obj, mtl], textures);
        const manager = new THREE.LoadingManager();
        const objectURLs = [];
        manager.setURLModifier((url: string) => {
            try {
                let out = URL.createObjectURL(blobs[url.replace(/^.*[\\\/]/, '')]);
                objectURLs.push(out);
                return out;
            } catch (e) {
                onerror(e, 'texture')
            }
        });

        const loaderMTL = new MTLLoader(manager);
        const loaderOBJ = new OBJLoader(manager);

        const loadOBJ = async (callback, materials?) => {
            if (materials) loaderOBJ.setMaterials(materials);
            loaderOBJ.load(obj[0].name, (model) => {
                enableShadowAndLightOnModel(model);
                callback(model);
                objectURLs.forEach((url) => URL.revokeObjectURL(url));
            });
        }
        // try load mtl ...
        if (mtl) {
            loaderMTL.load(mtl[0].name, async materials => {
                // our material is ready
                materials.preload();
                loadOBJ(cb, materials)
            });
        } else {
            loadOBJ(cb);
        }

    } catch (e) {
        onerror(e);
    }
}

/**
 * Imports GLB/GLTF models into scene.
 * @param {FileList} glb 
 * @param {FileList} bin 
 * @param {FileList} textures 
 * @param cb 
 * @param onerror 
 */

export async function importGLB(glb: FileList, bin: FileList, textures: FileList, cb, onerror) {
    try {
        const blobs = mapInputToBlobList([glb, bin], textures);
        const manager = new THREE.LoadingManager();
        const objectURLs = [];
        manager.setURLModifier((url: string) => {
            try {
                let out = URL.createObjectURL(blobs[url.replace(/^.*[\\\/]/, '')]);
                objectURLs.push(out);
                return out;
            } catch (e) {
                console.log(e)
                onerror(e, 'texture')
            }
        });
        const loaderGLTF = new GLTFLoader(manager);
        loaderGLTF.load(glb[0].name, (model) => {
            enableShadowAndLightOnModel(model, 'gltf');
            cb(model);
            objectURLs.forEach((url) => URL.revokeObjectURL(url));
        });
    } catch (e) {
        console.log(e)
        onerror(e);
    }
}

/**
 * Imports FBX models into scene.
 * @param {FileList} fbx 
 * @param {FileList} textures 
 * @param cb 
 * @param onerror 
 */

export async function importFBX(fbx: FileList, textures: FileList, cb, onerror) {
    try {
        if (textures) {
            const blobs = mapInputToBlobList([fbx], textures);
            console.log("FBX", blobs)
            const manager = new THREE.LoadingManager();
            const objectURLs = [];
            manager.setURLModifier((url: string) => {
                try {
                    let out = URL.createObjectURL(blobs[url.replace(/^.*[\\\/]/, '')]);
                    objectURLs.push(out);
                    return out;
                } catch (e) {
                    console.log(e)
                    onerror(e, 'texture')
                }
            });
            const loaderFBX = new FBXLoader(manager);
            loaderFBX.load(fbx[0].name, (model) => {
                enableShadowAndLightOnModel(model);
                cb(model);
                objectURLs.forEach((url) => URL.revokeObjectURL(url));
            }, (err) => {
                onerror(err);
            });
        } else {
            const loaderFBX = new FBXLoader();
            const fbx_uri: string = URL.createObjectURL(fbx[0]);
            loaderFBX.load(fbx_uri, (model) => {
                enableShadowAndLightOnModel(model);
                cb(model);
                URL.revokeObjectURL(fbx_uri);
            })
        }


    } catch (e) {
        console.log(e)
        onerror(e);
    }
}

/**
 * Traverses the whole scene and enable cast and recieve shadow on objects in scene.
 * @param {any} importedModel Imported model to traverse and enable shadows.
 * @param {string} type Type of model. Possible values includes 'glb'.
 */

export default function enableShadowAndLightOnModel(importedModel: any, type?: string) {
    const enableShadows = (type == 'gltf') ? importedModel.scene : importedModel;
    enableShadows.traverse(function (child) {
        if ((child as any).isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}


/**
 * Reads File and converts its content into a DataURL
 * @param {File} inputFile File to convert to DataURL
 */

export function readUploadedFileAsURL(inputFile: File) {
    const temporaryFileReader = new FileReader();
    return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
            temporaryFileReader.abort();
            reject(new DOMException("Problem parsing input file."));
        };

        temporaryFileReader.onload = () => {
            resolve(temporaryFileReader.result);
        };
        temporaryFileReader.readAsDataURL(inputFile);
    });
};
