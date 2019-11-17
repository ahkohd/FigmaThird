export default class ResourceTracker {
    public resources: Set<any>;
    constructor() {
        this.resources = new Set();
    }
    track(resource) {
        if (resource.dispose) {
            this.resources.add(resource);
        }
        return resource;
    }
    untrack(resource) {
        this.resources.delete(resource);
    }
    dispose() {
        for (const resource of this.resources) {
            resource.dispose();
        }
        this.resources.clear();
    }
}