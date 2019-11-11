import * as React from "react";
import { Label, Input } from "figma-styled-components";

export default function PointLightSubItem({ index, light, onLightDataChange }) {
    return (
        <div className="light--sub">
            <div
                style={{
                    width: "85px"
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
                    value={light.decay || 2}
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
                    min="0"
                    type="number"
                    step="0.01"
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
    );
}
