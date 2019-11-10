import * as React from "react";
import { Label, Input } from "figma-styled-components";

export function SpotLightSubItem({ light }) {
    return (
        <div className="light--sub">
            <div
                style={{
                    width: "85px"
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
                    value={light.decay || 2}
                    onChange={event => {}}
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
                    value={light.distance}
                    onChange={event => {}}
                />
            </div>
        </div>
    );
}
