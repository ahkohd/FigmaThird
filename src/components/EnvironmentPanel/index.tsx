import * as React from "react";
import Lighting from "./Lighting";

export default function EnvironmentPanel(props) {
    return (
        <div className="panel">
            <div className="ui-section">
                <Lighting />
            </div>
        </div>
    );
}
