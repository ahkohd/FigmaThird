import * as React from "react";
import { Label, Input, Icon } from "figma-styled-components";

export function SpotLightSubItem({ index, light, onLightDataChange }) {
    return (
        <>
            <div className="light--sub">
                <div
                    style={{
                        width: "100px"
                    }}>
                    <Input
                        icon={
                            <Label
                                style={{
                                    height: "100%",
                                    marginRight: "10px"
                                }}>
                                Decay
                            </Label>
                        }
                        className="light__textInput--faint"
                        value={light.decay || 0}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                decay: parseInt(event.target.value) || 0
                            })
                        }
                    />
                </div>
                <div
                    style={{
                        width: "60px"
                    }}>
                    <Input
                        icon={
                            <Label
                                style={{
                                    height: "100%"
                                }}>
                                D
                            </Label>
                        }
                        className="light__textInput--faint"
                        value={light.distance || 0}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                distance: parseInt(event.target.value) || 0
                            })
                        }
                    />
                </div>
            </div>
            <div className="light--sub">
                <div
                    style={{
                        width: "100px"
                    }}>
                    <Input
                        icon={
                            <Label
                                style={{
                                    height: "100%",
                                    marginRight: "10px"
                                }}>
                                Penumbra
                            </Label>
                        }
                        className="light__textInput--faint"
                        value={light.penumbra || 0}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                penumbra: parseInt(event.target.value) || 0
                            })
                        }
                    />
                </div>
                <div
                    style={{
                        width: "60px"
                    }}>
                    <Input
                        icon={<Icon name="Angle" />}
                        className="light__textInput--faint"
                        value={light.angle || 0}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                angle: parseInt(event.target.value) || 0
                            })
                        }
                    />
                </div>
            </div>
        </>
    );
}
