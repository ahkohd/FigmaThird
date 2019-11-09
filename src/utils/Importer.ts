import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import * as THREE from "three";

export function fitCameraToSelection(
    camera,
    controls,
    selection,
    fitOffset = 1.2
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

function mapInputToBlobList(modelFiles, textures) {
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

export async function importOBJ(obj, mtl, textures, cb, onerror) {
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

export async function importGLB(glb, bin, textures, cb, onerror) {
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
            cb(model);
            objectURLs.forEach((url) => URL.revokeObjectURL(url));
        });
    } catch (e) {
        console.log(e)
        onerror(e);
    }
}

export async function importFBX(fbx, textures, cb, onerror) {
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
                cb(model);
                objectURLs.forEach((url) => URL.revokeObjectURL(url));
            }, (err) => {
                onerror(err);
            });
        } else {
            const loaderFBX = new FBXLoader();
            const fbx_uri: string = URL.createObjectURL(fbx[0]);
            loaderFBX.load(fbx_uri, (model) => {
                cb(model);
                URL.revokeObjectURL(fbx_uri);
            })
        }


    } catch (e) {
        console.log(e)
        onerror(e);
    }
}



export function readUploadedFileAsURL(inputFile) {
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
