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
                        min="0"
                        type="number"
                        step="0.01"
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
                        value={light.decay}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                decay: parseFloat(event.target.value)
                            })
                        }
                    />
                </div>
                <div
                    style={{
                        width: "60px"
                    }}>
                    <Input
                        type="number"
                        step="0.01"
                        min="0"
                        icon={
                            <Label
                                style={{
                                    height: "100%"
                                }}>
                                D
                            </Label>
                        }
                        className="light__textInput--faint"
                        value={light.distance}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                distance: parseFloat(event.target.value)
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
                        type="number"
                        step="0.01"
                        min="0"
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
                        value={light.penumbra}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                penumbra: parseFloat(event.target.value)
                            })
                        }
                    />
                </div>
                <div
                    style={{
                        width: "60px"
                    }}>
                    <Input
                        type="number"
                        min="0"
                        max="1.05"
                        step="0.01"
                        icon={<Icon name="Angle" />}
                        className="light__textInput--faint"
                        value={light.angle}
                        onChange={event =>
                            onLightDataChange({
                                index,
                                ...light,
                                angle: parseFloat(event.target.value)
                            })
                        }
                    />
                </div>
            </div>
        </>
    );
}
