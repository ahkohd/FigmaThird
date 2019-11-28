import * as React from "react";

export default function ColorSwatch(props) {
    return (
        <div
            className="light__color"
            style={{
                background: `rgb(${props.color.r * 255}, ${props.color.g * 255}, ${props.color.b *
                    255})`
            }}>
            <input className="light__color__input" type="color" onChange={props.onColorChange} />
        </div>
    );
}
