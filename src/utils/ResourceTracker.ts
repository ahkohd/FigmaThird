import { Object3D } from "three";

/**
 * ResourceTracker helps to track resources in
 * the THREE.JS scene.
 */
export default class ResourceTracker {
    /**
     * A set of resources in scene.
     * @member resources
     */
    public resources: Set<any>;

    constructor() {
        // Intialize a new set
        this.resources = new Set();
    }

    /**
     * Add a new resource to keep track of.
     * @param resource
     */
    track(resource: any) {
        if (resource.dispose || resource instanceof Object3D) {
            console.log("@{Resource Tracker} Tracking...", resource.name, resource.id);
            this.resources.add(resource);
        }
        return resource;
    }

    /**
     * Untracks a resource.
     * @param resource
     */
    untrack(resource) {
        this.resources.delete(resource);
    }

    /**
     * Disposes all objects in scene and clear the
     * resources set.
     */
    disposeAll() {
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }

    /**
     * If a resource is present in resources set,
     * It disposes it and remove it from set.
     * @param resource
     */

    dispose(resource) {
        if (this.resources.has(resource)) {
            this.untrack(resource);
            if (resource.material) {
                console.log("@{Resource Tracker}: Disposed Material", resource.material.name);
                resource.material.dispose();
            }
            if (resource.texture) {
                console.log("@{Resource Tracker}: Disposed Texture", resource.texture.name);
                resource.texture.dispose();
            }
            if (resource instanceof Object3D) {
                if (resource.parent) {
                    console.log("@{Resource Tracker}: Disposed Object3D", resource.name);
                    resource.parent.remove(resource);
                }
            } else {
                console.log("@{Resource Tracker}: Disposed", resource.name);
                resource.dispose();
            }
        }
    }

    /**
     * Untrack and dispose an object by its object ID.
     * @param objectId
     */

    disposeById(objectId: number) {
        for (const resource of this.resources) {
            console.log(123, resource.id);
            if (resource.id == objectId) {
                this.dispose(resource);
                break;
            }
        }
    }
}
