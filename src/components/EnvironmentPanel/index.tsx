import * as React from "react";
import Lighting from "./Lighting";
import Fog from "./Fog";
import Ground from "./Ground";

export default function EnvironmentPanel() {
    return (
        <div className="panel">
            <div className="ui-section">
                <Lighting />
                <Fog />
                {/* <Ground /> */}
            </div>
        </div>
    );
}
