import * as React from "react";
import Lighting from "./Lighting";
import Fog from "./Fog";

export default function EnvironmentPanel(props) {
    return (
        <div className="panel">
            <div className="ui-section">
                <Lighting />
                <Fog />
            </div>
        </div>
    );
}
