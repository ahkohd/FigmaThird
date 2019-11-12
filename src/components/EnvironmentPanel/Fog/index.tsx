import * as React from "react";
import { SectionTitle, Checkbox, Text, Icon, Label, Input } from "figma-styled-components";
import styled from "styled-components";
import ColorSwatch from "../Lighting/ColorSwatch";
import AppContext from "../../../context";
import { hexToRgb } from "../utils";

const Flex = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
`;

const TransFlex = styled(Flex)`
    transform: translate(-10px);
`;

const ContainInput = styled.div`
    width: 55px;
    margin-left: 10px;
    margin-right: 5px;
`;
export default function Fog() {
    const { state, dispatch }: any = React.useContext(AppContext);
    return (
        <>
            <div className="divider" style={{ padding: "5px" }}></div>
            <div className="pad">
                <SectionTitle>Fog</SectionTitle>
                <Flex>
                    <TransFlex>
                        <Icon name="Styles" />
                        <Text>Show fog</Text>
                    </TransFlex>
                    <Checkbox
                        checked={state.fogData.visible}
                        onChange={event =>
                            dispatch({
                                type: "SET_FOG_DATA",
                                payload: {
                                    ...state.fogData,
                                    visible: !state.fogData.visible,
                                    _t: new Date().getMilliseconds()
                                }
                            })
                        }
                    />
                </Flex>
                <Flex>
                    <ColorSwatch
                        color={state.fogData.color}
                        onColorChange={event =>
                            dispatch({
                                type: "SET_FOG_DATA",
                                payload: {
                                    ...state.fogData,
                                    color: hexToRgb(event.target.value),
                                    _t: new Date().getMilliseconds()
                                }
                            })
                        }
                    />
                    <Flex>
                        <Label>Far</Label>
                        <ContainInput>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={state.fogData.far}
                                onChange={event =>
                                    dispatch({
                                        type: "SET_FOG_DATA",
                                        payload: {
                                            ...state.fogData,
                                            far: parseFloat(event.target.value),
                                            _t: new Date().getMilliseconds()
                                        }
                                    })
                                }
                            />
                        </ContainInput>
                    </Flex>
                    <Flex>
                        <Label>Near</Label>
                        <ContainInput>
                            <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={state.fogData.near}
                                onChange={event =>
                                    dispatch({
                                        type: "SET_FOG_DATA",
                                        payload: {
                                            ...state.fogData,
                                            near: parseFloat(event.target.value),
                                            _t: new Date().getMilliseconds()
                                        }
                                    })
                                }
                            />
                        </ContainInput>
                    </Flex>
                </Flex>
            </div>
        </>
    );
}
