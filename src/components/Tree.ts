export default class Tree {

    public children: Array<Tree> = new Array<Tree>();
    public data: any;
    public toggled: boolean;
    public name: string;
    public id: number;
    public type: string;
    public visible: boolean = true;
    public castShadow: boolean;
    public receiveShadow: boolean;
    public active: boolean = false;

    constructor(public parent: Tree | null) {

    }

    add(child: Tree) {
        this.children.push(child);
    }

}