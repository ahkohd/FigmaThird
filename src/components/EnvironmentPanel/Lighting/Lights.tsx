import * as React from "react";
import { ILight } from "../../../utils/ILight";
import AppContext from "../../../context";
import { hexToRgb } from "../utils";
import LightItem from "./LightItem";
import SubLightItem from "./SubLightItem";

export default function Lights(props) {
    const { state, dispatch }: any = React.useContext(AppContext);
    const [sceneLights, setSceneLights]: any = React.useState(null);

    React.useEffect(() => {
        console.count("render");
        if (!state.lightsInScene) return;
        setSceneLights(state.lightsInScene);
    }, [state.lightsInScene]);

    const handleColorChange = (event, index, colorIndex, type) => {
        if (!sceneLights) return;
        const value = hexToRgb(event.target.value);
        dispatch({
            type: "UPDATE_LIGHT_OF_SCENE",
            payload: { index, value, colorIndex, type }
        });
        let _lights = sceneLights;
        _lights[index].color[colorIndex] = value;
        setSceneLights(_lights);
    };

    const buildLightItems = (eachLightDataInList: ILight[]) => {
        if (!eachLightDataInList) return;
        return eachLightDataInList.map((light, index) => {
            return (
                <>
                    <LightItem
                        id={light.id}
                        light={light}
                        onColorChange={handleColorChange}
                        onDelete={() => {
                            dispatch({
                                type: "SET_ITEM_FOR_DELETE",
                                payload: light.id
                            });
                        }}
                    />
                    {(["PointLight", "SpotLight", "RectAreaLight"] as any).includes(light.type) && (
                        <SubLightItem type={light.type} light={light} />
                    )}
                </>
            );
        });
    };

    return <div className="lights">{buildLightItems(sceneLights)}</div>;
}
