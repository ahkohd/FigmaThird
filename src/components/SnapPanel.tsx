import * as React from "react";
import { Button, Checkbox, Text } from "figma-styled-components";
import AppContext from "../context";
import styled from "styled-components";
export default function SnapPanel() {
    const { state, dispatch }: any = React.useContext(AppContext);

    const GroundDiv = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
    `;

    return (
        <div className="panel">
            <div className="ui-section pad">
                <GroundDiv>
                    <Text>Hide ground on snap</Text>
                    <Checkbox
                        checked={state.hideGroundOnSnap.value}
                        onChange={event => {
                            dispatch({
                                type: "SET_HIDE_GROUND_ON_SNAP",
                                payload: {
                                    value: !state.hideGroundOnSnap.value,
                                    _t: new Date().getMilliseconds()
                                }
                            });
                            console.log("Dispatched");
                        }}
                    />
                </GroundDiv>
                <Button
                    className="panel__button panel__button--render"
                    fullWidth="true"
                    variant="primary"
                    onClick={event => {
                        dispatch({ type: "SNAP", payload: { _t: new Date().getMilliseconds() } });
                    }}>
                    Snap
                </Button>
            </div>
        </div>
    );
}
