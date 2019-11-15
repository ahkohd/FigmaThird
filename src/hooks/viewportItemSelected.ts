/**
 * A custom hook that effects when user selects a object in the 3d Viewport.
 */

import * as React from 'react';
import Tree from '../utils/Tree';

/**
 * Traverse the Inspector's UI data tree and marks the currently selected item as `active` and unmarks the previously selected.
 * @param parentNode Data containing the tree
 * @param id currently selected object ID in the UI
 * @param done A `flag | function` if `false` then the traverse as not yet reached the currently selected node.
 * @param marked A flag, if true then the currently selected node as been marked. 
 */

const markSelected = (parentNode: Tree, id: number, done: any, marked: boolean = false) => {
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


export default function useViewportItemSelected(globalState, localData, setLocalData) {
    React.useEffect(() => {
        if (globalState.viewPortSelectedItem != null) {
            console.log("VIEWPORT SELECTED", globalState.viewPortSelectedItem);
            markSelected({ ...localData }, globalState.viewPortSelectedItem.id, newData => {
                console.log("2 set new data", newData);
                setLocalData(newData);
            });
        }
    }, [globalState.viewPortSelectedItem]);
}


// React.useEffect(() => {
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
