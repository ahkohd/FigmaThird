import * as React from "react";
import { Label, Input } from "figma-styled-components";

export function RectAreaLightSubItem({ index, light, onLightDataChange }) {
    return (
        <div className="light--sub">
            <div
                style={{
                    width: "60px"
                }}>
                <Input
                    min="0"
                    type="number"
                    step="0.01"
                    onChange={event =>
                        onLightDataChange({
                            index,
                            ...light,
                            width: parseFloat(event.target.value)
                        })
                    }
                    icon={
                        <Label
                            style={{
                                height: "100%"
                            }}>
                            W
                        </Label>
                    }
                    className="light__textInput--faint"
                    value={light.width}
                />
            </div>
            <div
                style={{
                    width: "60px"
                }}>
                <Input
                    min="0"
                    type="number"
                    step="0.01"
                    icon={
                        <Label
                            style={{
                                height: "100%"
                            }}>
                            H
                        </Label>
                    }
                    className="light__textInput--faint"
                    value={light.height}
                    onChange={event =>
                        onLightDataChange({
                            index,
                            ...light,
                            height: parseFloat(event.target.value)
                        })
                    }
                />
            </div>
        </div>
    );
}
