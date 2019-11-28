import * as React from "react";
import { ILight } from "../../../utils/ILight";
import AppContext from "../../../context";
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

    const handleLightDataChange = (changedLightData: ILight) => {
        if (!sceneLights) return;
        console.log(11, changedLightData);
        dispatch({
            type: "UPDATE_LIGHT_OF_SCENE",
            payload: changedLightData
        });
        let _lights = sceneLights;
        _lights[changedLightData.index] = changedLightData;
        setSceneLights(_lights);
    };

    const buildLightItems = (eachLightDataInList: ILight[]) => {
        if (!eachLightDataInList) return;
        return eachLightDataInList.map((light, index) => {
            return (
                <React.Fragment key={light.id.toString()}>
                    <LightItem
                        index={index}
                        light={light}
                        onColorChange={handleLightDataChange}
                        onLightDataChange={handleLightDataChange}
                        onDelete={() => {
                            dispatch({
                                type: "SET_ITEM_FOR_DELETE",
                                payload: { id: light.id, timestamp: new Date().getMilliseconds() }
                            });
                        }}
                    />
                    {(["PointLight", "SpotLight", "RectAreaLight"] as any).includes(light.type) && (
                        <SubLightItem
                            key={light.id.toString()}
                            index={index}
                            type={light.type}
                            light={light}
                            onLightDataChange={handleLightDataChange}
                        />
                    )}
                </React.Fragment>
            );
        });
    };

    return <div className="lights">{buildLightItems(sceneLights)}</div>;
}
