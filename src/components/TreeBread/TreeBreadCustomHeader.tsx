import * as React from "react";
import { Icon, IconButton } from "figma-styled-components";
import AppContext from "../../context";

export default function Header({
    onClick,
    style,
    customStyles,
    node
}) {
    const { state, dispatch }: any = React.useContext(
        AppContext
    );

    const iconType =
        node.children && node.children.length == 0
            ? "Component"
            : "Frame";
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

    return (
        <div
            style={{ ...style.base, width: "70%" }}
            onClick={event => {
                dispatch({
                    type: "SET_SELECT_OBJECT",
                    payload: node
                });
                onClick(event);
            }}>
            <div
                style={
                    node.selected
                        ? {
                              ...style.title,
                              ...customStyles.header.title,
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
                    <div style={{ color: "#555" }}>
                        {node.name}
                    </div>
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
                    <div
                        style={{ color: "#555" }}
                        onClick={() => {
                            node.visible = !node.visible;
                            dispatch({
                                type: "SET_ITEM_FOR_HIDE",
                                payload:
                                    node.id +
                                    "-" +
                                    new Date().getMilliseconds()
                            });
                        }}>
                        {node.visible ? (
                            <Icon name="Visible" />
                        ) : (
                            <Icon name="Hidden" />
                        )}
                    </div>
                    <div
                        style={{
                            transform: "scale(.8)",
                            color: "#555"
                        }}>
                        <IconButton
                            icon={<Icon name="Trash" />}
                            onClick={() => {
                                dispatch({
                                    type:
                                        "SET_ITEM_FOR_DELETE",
                                    payload: node.id
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
