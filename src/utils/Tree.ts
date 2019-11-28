/**
 * A tree data structure to represent nodes in the inspector.
 * A superset of Data Attributes of [react-treebeard](https://github.com/storybookjs/react-treebeard#data-attributes)
 * And some few properites of ThreeJS [Object3D](https://threejs.org/docs/#api/en/core/Object3D) 
 */
export default class Tree {

    /**
     * Array of child nodes.
     * @member children 
     */
    public children: Array<Tree> = new Array<Tree>();

    /**
     * Data payload
     * @member data
     */
    public data: any;

    /**
     * Toggled flag. Sets the visibility of a node's children. It also sets the state for the toggle decorator.
     * [See react-tree-bread](https://github.com/storybookjs/react-treebeard#toggled)
     * @member toggled
     */
    public toggled: boolean;

    /**
     * Name of the node. 
     * @member name
     */
    public name: string;

    /**
     * ThreeJS object ID of the node in scene.
     * [See Object3D.id](https://threejs.org/docs/index.html#api/en/core/Object3D.id)
     * @member id
     */
    public id: number;

    /**
     * Constructor name of object in ThreeJS scene.
     * @member type Constructor name.
     */
    public type: string;

    /**
     * Visibility of the object in ThreeJS scene.
     * [See Object3D.visible](https://threejs.org/docs/index.html#api/en/core/Object3D.visible)
     * @member visible 
     */
    public visible: boolean = true;

    /**
     * Cast shadow property of object in ThreeJS Scene.
     * [See Object3D.castShadow](https://threejs.org/docs/index.html#api/en/core/Object3D.castShadow)
     * @member castShadow
     */
    public castShadow: boolean;

    /**
     * Receive shadow property of object in ThreeJS Scene.
     * [See Object3D.receiveShadow](https://threejs.org/docs/index.html#api/en/core/Object3D.receiveShadow)
     * @member receiveShadow
     */
    public receiveShadow: boolean;

    /**
     * Active flag. If active, the node will be highlighted. The highlight is derived from the `node.activeLink` style object in the theme.
     * [See react-tree-bread](https://github.com/storybookjs/react-treebeard#active)
     * @member active
     */
    public active: boolean = false;

    /**
     * Tree constructor
     * @param {Tree | null} parent Parent node, if null the node is the root of the tree.
     */
    constructor(public parent: Tree | null) { }

    /**
     * Adds a new child node to this current node
     * @param Tree child  
     */
    add(child: Tree) {
        this.children.push(child);
    }

}