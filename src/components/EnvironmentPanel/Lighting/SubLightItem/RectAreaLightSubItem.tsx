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
                    onChange={event =>
                        onLightDataChange({
                            index,
                            ...light,
                            width: parseInt(event.target.value) || 0
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
                            height: parseInt(event.target.value) || 0
                        })
                    }
                />
            </div>
        </div>
    );
}
