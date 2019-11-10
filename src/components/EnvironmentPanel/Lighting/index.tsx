import * as React from "react";
import { SectionTitle } from "figma-styled-components";
import AddLight from "./AddLight";
import Lights from "./Lights";

export default function Lighting(props) {
    return (
        <div className="pad">
            <SectionTitle>Lighting</SectionTitle>
            <AddLight />
            <Lights />
        </div>
    );
}
