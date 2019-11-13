import * as React from "react";
import { Treebeard, decorators } from "react-treebeard";
import AppContext from "../context";
import style from "../utils/ThreeBreadStyle";
import Header, { traverseNode } from "./TreeBread/TreeBreadCustomHeader";
import Container from "./TreeBread/TreeBreadCustomContainer";
import Toggle from "./TreeBread/TreeBreadCustomToggle";

export default function Inspector() {
    const { state, dispatch }: any = React.useContext(AppContext);
    const [data, setData] = React.useState(state.sceneTree);
    const [cursor, setCursor]: any = React.useState(false);

    React.useEffect(() => {
        if (state.viewPortSelectedItem != null) {
            console.log("VIEWPORT SELECTED", state.viewPortSelectedItem);
            markSelected({ ...data }, state.viewPortSelectedItem.id, newData => {
                console.log("2 set new data", newData);
                setData(newData);
            });
        }
    }, [state.viewPortSelectedItem]);

    const markSelected = (parentNode, id, done, marked = false) => {
        for (const child of parentNode.children) {
            if (child.id == id) {
                console.log("1 MARKED @{SELECTED}", id);
                child.active = true;
                marked = true;
                markSelected(child, id, false, true);
            } else {
                child.active = false;
                if (child.children.length > 0 && marked == false) child.toggled = true;
                markSelected(child, id, false);
            }
        }
        if (done) {
            done(parentNode);
        }
    };

    // formal marked that opens other groups when another stuff is selected
    // const markSelected = (parentNode, id, done) => {
    //     for (const child of parentNode.children) {
    //         if (child.id == id) {
    //             console.log("1 MARKED", id);
    //             child.active = true;
    //         } else {
    //             child.active = false;
    //             if (child.children.length > 0) child.toggled = true;
    //         }
    //         markSelected(child, id, false);
    //     }
    //     if (done) {
    //         done(parentNode);
    //     }
    // };

    React.useEffect(() => {
        if (!state.sceneTree) return;
        setData(state.sceneTree);
    }, [state.sceneTree]);

    const onToggle = (node, toggled) => {
        // return;
        if (cursor) {
            cursor.active = false;
            traverseNode(data.children, childNode => {
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
        setData(Object.assign({}, data));
    };

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
