import * as React from "react";
import styled from "@emotion/styled";
import AppContext from "../../context";

const Polygon = styled("polygon", {
    shouldForwardProp: prop => ["className", "children", "points"].indexOf(prop) !== -1
})(({ style }: any) => style);

export const Div = styled("div", {
    shouldForwardProp: prop => ["className", "children"].indexOf(prop) !== -1
})(({ style }: any) => style);

const Toggle = ({ style, onClick, node }) => {
    const { height, width } = style;
    const midHeight = height * 0.5;
    const points = `0,0 0,${height} ${width},${midHeight}`;

    return (
        <div
            style={style.base}
            onClick={event => {
                event.stopPropagation();
                onClick();
            }}>
            <Div style={style.wrapper}>
                {node.children && node.children.length > 0 && (
                    <svg {...{ height, width }}>
                        <Polygon points={points} style={style.arrow} />
                    </svg>
                )}
            </Div>
        </div>
    );
};

export default Toggle;
