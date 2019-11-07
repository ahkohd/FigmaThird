export default class Tree {

    public children: Array<Tree> = new Array<Tree>();
    public data: any;
    public toggled: boolean = false
    public name: string;
    public id: number;
    public type: string;
    public visible: boolean;
    public castShadow: boolean;
    public receiveShadow: boolean;
    public active: boolean;

    constructor(public parent: Tree | null) {

    }

    add(child: Tree) {
        this.children.push(child);
    }

}