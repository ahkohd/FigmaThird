import * as React from "react";
import PointLightSubItem from "./PointLightSubItem";
import { RectAreaLightSubItem } from "./RectAreaLightSubItem";
import { SpotLightSubItem } from "./SpotLightSubItem";

export default function SubLightItem({ index, type, light, onLightDataChange }) {
    return (
        <>
            {type == "PointLight" && (
                <PointLightSubItem
                    index={index}
                    onLightDataChange={onLightDataChange}
                    light={light}
                />
            )}
            {type == "SpotLight" && (
                <SpotLightSubItem
                    index={index}
                    onLightDataChange={onLightDataChange}
                    light={light}
                />
            )}
            {type == "RectAreaLight" && (
                <RectAreaLightSubItem
                    index={index}
                    onLightDataChange={onLightDataChange}
                    light={light}
                />
            )}
        </>
    );
}
