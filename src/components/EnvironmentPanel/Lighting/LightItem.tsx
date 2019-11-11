import * as React from "react";

import { Input, IconButton, Icon } from "figma-styled-components";
import ColorSwatch from "./ColorSwatch";
import { hexToRgb } from "../utils";

export default function LightItem(props) {
    return (
        <div className="light">
            {/* colors */}
            {props.light.color.map((color, colorIndex) => {
                return (
                    <ColorSwatch
                        key={colorIndex.toString()}
                        color={color}
                        onColorChange={event => {
                            const newLightData = props.light;
                            newLightData.color[colorIndex] = hexToRgb(event.target.value);
                            props.onLightDataChange({
                                index: props.index,
                                ...newLightData
                            });
                        }}
                    />
                );
            })}
            {/* !colors */}
            <div className="light__name">{props.light.type}</div>
            <div className="light__textInput">
                <Input
                    type="number"
                    min="0"
                    step=".01"
                    icon={<Icon name="Effects" />}
                    value={props.light.intensity}
                    onChange={event =>
                        props.onLightDataChange({
                            index: props.index,
                            ...props.light,
                            intensity: parseFloat(event.target.value)
                        })
                    }
                />
            </div>
            <div className="light__action">
                <IconButton onClick={props.onDelete} icon={<Icon name="Trash" />} />
            </div>
        </div>
    );
}
