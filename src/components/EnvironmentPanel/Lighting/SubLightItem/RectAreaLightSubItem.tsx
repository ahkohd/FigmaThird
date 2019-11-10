import * as React from "react";
import { Label, Input } from "figma-styled-components";

export function RectAreaLightSubItem({ light }) {
    return (
        <div className="light--sub">
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
                            W
                        </Label>
                    }
                    className="light__textInput--faint"
                    value={light.width}
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
                            H
                        </Label>
                    }
                    className="light__textInput--faint"
                    value={light.height}
                    onChange={event => {}}
                />
            </div>
        </div>
    );
}
