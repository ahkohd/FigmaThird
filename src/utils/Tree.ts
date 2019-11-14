/**
 * A tree data structure to represent nodes in the inspector.
 * A superset of Data Attributes of [react-treebeard](https://github.com/storybookjs/react-treebeard#data-attributes)
 * And some few properites of ThreeJS [Object3D](https://threejs.org/docs/#api/en/core/Object3D) 
 */
export default class Tree {

    /**
     * Array of child nodes.
     * @member {Array<Tree>} children 
     */
    public children: Array<Tree> = new Array<Tree>();

    /**
     * Data payload
     * @member {any} data
     */
    public data: any;

    /**
     * Toggled flag. Sets the visibility of a node's children. It also sets the state for the toggle decorator.
     * [See react-tree-bread](https://github.com/storybookjs/react-treebeard#toggled)
     * @member {boolean} toggled
     */
    public toggled: boolean;

    /**
     * Name of the node. 
     * @member {string} name
     */
    public name: string;

    /**
     * ThreeJS object ID of the node in scene.
     * [See Object3D.id](https://threejs.org/docs/index.html#api/en/core/Object3D.id)
     * @member {number} id
     */
    public id: number;

    /**
     * Constructor name of object in ThreeJS scene.
     * @member {string} type Constructor name.
     */
    public type: string;

    /**
     * Visibility of the object in ThreeJS scene.
     * [See Object3D.visible](https://threejs.org/docs/index.html#api/en/core/Object3D.visible)
     * @member {boolean} visible 
     */
    public visible: boolean = true;

    /**
     * Cast shadow property of object in ThreeJS Scene.
     * [See Object3D.castShadow](https://threejs.org/docs/index.html#api/en/core/Object3D.castShadow)
     * @member {boolean} castShadow
     */
    public castShadow: boolean;

    /**
     * Receive shadow property of object in ThreeJS Scene.
     * [See Object3D.receiveShadow](https://threejs.org/docs/index.html#api/en/core/Object3D.receiveShadow)
     * @member {boolean} receiveShadow
     */
    public receiveShadow: boolean;


    public active: boolean = false;

    constructor(public parent: Tree | null) { }

    /**
     * Adds a new child node to this current node
     * @param Tree child  
     */
    add(child: Tree) {
        this.children.push(child);
    }

}