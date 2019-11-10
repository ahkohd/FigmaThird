import * as React from "react";
import { SectionTitle, Icon, Select, IconButton, Label, Input } from "figma-styled-components";
import lightTypes from "../../../utils/LightTypes";
import AppContext from "../../../context";

export default function AddLight(props) {
    const [selectedLightType, setSelectedLightType]: any = React.useState("HemisphereLight");
    const { dispatch }: any = React.useContext(AppContext);

    const buildLightOptions = () => {
        let output = [];
        lightTypes.forEach(lightType => {
            output.push({
                label: `${lightType.split("Light")[0]} Light`,
                value: lightType
            });
        });
        return [{ label: "light", group: output }];
    };

    return (
        <div className="lightOptions">
            <div>
                <Icon name="Effects" />
            </div>
            <div className="lightOptions__select">
                <Select
                    options={buildLightOptions()}
                    onChange={value => setSelectedLightType(value)}
                />
            </div>
            <div className="lightOptions__action">
                <IconButton
                    icon={<Icon name="Plus" />}
                    onClick={event => {
                        dispatch({
                            type: "REQUEST_ADD_LIGHT_TO_SCENE",
                            payload: selectedLightType + "-" + new Date().getMilliseconds()
                        });
                    }}
                />
            </div>
        </div>
    );
}
