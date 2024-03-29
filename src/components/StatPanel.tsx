import * as React from "react";
import { Icon, Text, IconButton, Checkbox } from "figma-styled-components";
import AppContext from "../context";
import styled from "styled-components";

const ItemDiv = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translate(35px);
`;

export default function StatPanel(props) {
    const { state, dispatch }: any = React.useContext(AppContext);

    return (
        <div className="footstat">
            <div className="footstat__block">
                <IconButton
                    icon={<Icon name="ScrollingFrameAll" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload: { type: "translate", timestamp: new Date().getMilliseconds() }
                        });
                    }}></IconButton>
                <IconButton
                    icon={<Icon name="Swap" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload: { type: "rotate", timestamp: new Date().getMilliseconds() }
                        });
                    }}></IconButton>
                <IconButton
                    icon={<Icon name="ResizeToFit" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload: { type: "scale", timestamp: new Date().getMilliseconds() }
                        });
                    }}></IconButton>
                <IconButton
                    icon={<Icon name="VectorHandles" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_OBJECT_AS_PIVOT",
                            payload: { timestamp: new Date().getMilliseconds() }
                        });
                    }}></IconButton>

                <IconButton
                    icon={<Icon name="Library" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SHOW_FOOTPANEL"
                        });
                    }}></IconButton>

                <ItemDiv>
                    <Text>Grid</Text>
                    <Checkbox
                        checked={state.showGrid}
                        onChange={event =>
                            dispatch({ type: "SET_SHOW_GRID", payload: !state.showGrid })
                        }
                    />
                </ItemDiv>
            </div>
        </div>
    );
}
