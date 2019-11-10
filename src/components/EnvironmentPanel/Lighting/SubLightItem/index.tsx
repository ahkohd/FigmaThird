import * as React from "react";
import PointLightSubItem from "./PointLightSubItem";
import { RectAreaLightSubItem } from "./RectAreaLightSubItem";
import { SpotLightSubItem } from "./SpotLightSubItem";

export default function SubLightItem({ type, light }) {
    return (
        <>
            {type == "PointLight" && <PointLightSubItem light={light} />}
            {type == "SpotLight" && <SpotLightSubItem light={light} />}
            {type == "RectAreaLight" && <RectAreaLightSubItem light={light} />}
        </>
    );
}
