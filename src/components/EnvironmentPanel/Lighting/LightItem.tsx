import * as React from "react";

import { Input, IconButton, Icon } from "figma-styled-components";
import ColorSwatch from "./ColorSwatch";

export default function LightItem(props) {
    return (
        <div className="light" key={props.id.toString()}>
            {/* colors */}
            {props.light.color.map((c, colorIndex) => {
                return (
                    <ColorSwatch
                        color={c}
                        onColorChange={event => {
                            props.onColorChange(event, props.index, colorIndex, props.light.type);
                        }}
                    />
                );
            })}
            {/* !colors */}
            <div className="light__name">{props.light.type}</div>
            <div className="light__textInput">
                <Input
                    icon={<Icon name="Effects" />}
                    value={props.light.intensity}
                    onChange={event => {}}
                />
            </div>
            <div className="light__action">
                <IconButton onClick={props.onDelete} icon={<Icon name="Trash" />} />
            </div>
        </div>
    );
}
