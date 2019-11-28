import * as React from "react";
import { Treebeard, decorators } from "react-treebeard";
import AppContext from "../context";
import style from "../utils/ThreeBreadStyle";
import Header, { traverseNode } from "./TreeBread/TreeBreadCustomHeader";
import Container from "./TreeBread/TreeBreadCustomContainer";
import Toggle from "./TreeBread/TreeBreadCustomToggle";

import useViewportItemSelectedEffect from "../hooks/viewportItemSelectedEffect";
import Tree from "../utils/Tree";

export default function Inspector() {
    const { state }: any = React.useContext(AppContext);

    const [data, setData] = React.useState(state.sceneTree);
    const [cursor, setCursor]: any = React.useState(false);

    useViewportItemSelectedEffect(state, data, setData);

    // Effect when `sceneTree` data changes
    React.useEffect(() => {
        if (!state.sceneTree) return;
        setData(state.sceneTree);
    }, [state.sceneTree]);

    /**
     * Toggle a node toggle propert and set the node active.
     *  Also If the toggler is a `togglebutton` it reveales its child
     * nodes
     * @param {Tree} node to set active.
     * @param {boolean} toggled `toggled` value of the node.
     */

    const onToggle = (node: Tree, toggled: boolean) => {
        const _data = { ...data };
        if (cursor) {
            cursor.active = false;
            traverseNode(_data.children, childNode => {
                if (childNode.id != cursor.id) {
                    childNode.active = false;
                }
            });
        }
        node.active = true;
        console.log("THIS", (window as any).THIRD_INSPECTOR_TOGGLER);
        if (node.children && (window as any).THIRD_INSPECTOR_TOGGLER == "togglebutton") {
            node.toggled = toggled;
        }
        setCursor(node);
        setData(Object.assign({}, _data));
    };

    /**
     * Builds up Inspector tree UI
     * @param data Tree data that was populated based on objects in the Three.JS scene which resides in the viewport.
     */

    const buildTree = data => {
        return (
            <Treebeard
                data={data.children}
                decorators={{
                    ...decorators,
                    Header,
                    Container,
                    Toggle
                }}
                style={style}
                onToggle={onToggle}
            />
        );
    };

    return <div className="panel">{buildTree(data)}</div>;
}
