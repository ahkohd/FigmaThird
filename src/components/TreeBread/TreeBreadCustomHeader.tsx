import * as React from "react";
import { Icon, IconButton, Text, Label } from "figma-styled-components";
import AppContext from "../../context";
import styled from "styled-components";

export function traverseNode(parentNode, cb) {
    for (const node of parentNode) {
        cb(node);
        traverseNode(node.children, cb);
    }
}

export default function Header({ onClick, style, customStyles, node, active }) {
    const { state, dispatch }: any = React.useContext(AppContext);

    const iconType = node.children && node.children.length == 0 ? "Component" : "Frame";
    const extraStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        postion: "relative"
    };

    const extraStyle2 = {
        display: "flex",
        alignItems: "center"
    };

    const LiteLabel = styled.span`
        background: transparent;
        color: #999;
        font-family: "Inter", sans-serif;
    `;

    return (
        <div
            style={{ ...style.base, width: "70%" }}
            onClick={event => {
                dispatch({
                    type: "SET_SELECT_OBJECT",
                    payload: { node, timestamp: new Date().getMilliseconds() }
                });
                // a hack, see ui.tsx
                (window as any).THIRD_INSPECTOR_TOGGLER = "header";
                onClick();
            }}
            className="TreeHeader">
            <div
                style={
                    active
                        ? {
                              ...style.base.title,
                              ...extraStyle
                          }
                        : { ...style.title, ...extraStyle }
                }>
                <div
                    className="l"
                    style={{
                        ...extraStyle2,
                        justifyContent: "flex-start"
                    }}>
                    <Icon name={iconType} />
                    <div style={{ color: "#555" }}>{node.name}</div>
                </div>
                <div
                    className="r"
                    style={{
                        ...extraStyle2,
                        justifyContent: "flex-end",
                        width: "20px",
                        position: "absolute",
                        top: "0px",
                        right: "5px"
                    }}>
                    {node.receiveShadow != null && (
                        <div
                            style={{ color: "#555" }}
                            onClick={event => {
                                event.stopPropagation();
                                node.receiveShadow = !node.receiveShadow;

                                traverseNode(node.children, eachNode => {
                                    eachNode.receiveShadow = node.receiveShadow;
                                });

                                dispatch({
                                    type: "SET_ITEM_RSHADOW",
                                    payload: {
                                        id: node.id,
                                        timestamp: new Date().getMilliseconds()
                                    }
                                });
                            }}>
                            <IconButton
                                icon={
                                    node.receiveShadow ? (
                                        node.receiveShadow && <Text>R</Text>
                                    ) : (
                                        <LiteLabel>R</LiteLabel>
                                    )
                                }
                            />
                        </div>
                    )}
                    {node.castShadow != null && (
                        <div
                            style={{ color: "#555" }}
                            onClick={event => {
                                event.stopPropagation();
                                node.castShadow = !node.castShadow;
                                traverseNode(node.children, eachNode => {
                                    eachNode.castShadow = node.castShadow;
                                });
                                dispatch({
                                    type: "SET_ITEM_CSHADOW",
                                    payload: {
                                        id: node.id,
                                        timestamp: new Date().getMilliseconds()
                                    }
                                });
                            }}>
                            <IconButton
                                icon={
                                    node.castShadow ? (
                                        node.castShadow && <Text> C</Text>
                                    ) : (
                                        <LiteLabel>C</LiteLabel>
                                    )
                                }
                            />
                        </div>
                    )}

                    <div
                        style={{ color: "#555" }}
                        onClick={event => {
                            event.stopPropagation();
                            node.visible = !node.visible;
                            dispatch({
                                type: "SET_ITEM_FOR_HIDE",
                                payload: { id: node.id, timestamp: new Date().getMilliseconds() }
                            });
                        }}>
                        {node.visible ? <Icon name="Visible" /> : <Icon name="Hidden" />}
                    </div>
                    <div
                        style={{
                            transform: "scale(.8)",
                            color: "#555"
                        }}>
                        <IconButton
                            icon={<Icon name="Trash" />}
                            onClick={() => {
                                event.stopPropagation();
                                dispatch({
                                    type: "SET_ITEM_FOR_DELETE",
                                    payload: {
                                        id: node.id,
                                        timestamp: new Date().getMilliseconds()
                                    }
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
