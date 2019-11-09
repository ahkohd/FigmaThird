import * as React from "react";
import {
    SectionTitle,
    Select,
    Input,
    IconButton,
    Icon,
    Text,
    Label
} from "figma-styled-components";

import lightTypes from "../utils/LightTypes";
import AppContext from "../context";
import { Light } from "../utils/Light";

export default function EnvironmentPanel(props) {
    const { state, dispatch }: any = React.useContext(
        AppContext
    );

    const [lights, setlights]: any = React.useState(null);

    const [lightType, setLightType]: any = React.useState(
        "HemisphereLight"
    );

    React.useEffect(() => {
        if (!state.lightsInScene) return;
        setlights(state.lightsInScene);
    }, [state.lightsInScene]);

    const buildLightOptions = () => {
        let out = [];
        lightTypes.forEach(lightType => {
            out.push({
                label: `${
                    lightType.split("Light")[0]
                } Light`,
                value: lightType
            });
        });
        return [{ label: "light", group: out }];
    };

    const handleLightSelect = event => {};

    const hexToRgb = hex => {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
            hex
        );
        return result
            ? {
                  r: parseInt(result[1], 16) / 255,
                  g: parseInt(result[2], 16) / 255,
                  b: parseInt(result[3], 16) / 255
              }
            : null;
    };

    const componentToHex = c => {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };

    const rgbToHex = (r, g, b) => {
        return (
            "#" +
            componentToHex(r) +
            componentToHex(g) +
            componentToHex(b)
        );
    };

    const handleColorChange = (
        event,
        index,
        colorIndex,
        type
    ) => {
        if (!lights) return;
        const value = hexToRgb(event.target.value);
        dispatch({
            type: "UPDATE_LIGHT_OF_SCENE",
            payload: { index, value, colorIndex, type }
        });
        let _lights = lights;
        _lights[index].color[colorIndex] = value;
        setlights(_lights);
    };

    const buildLightItems = (l: Light[]) => {
        if (!l) return;
        return l.map((light, index) => {
            return (
                <>
                    <div
                        className="light"
                        key={light.id.toString()}>
                        {light.color.map(
                            (c, colorIndex) => {
                                return (
                                    <div
                                        className="light__color"
                                        style={{
                                            background: `rgb(${c.r *
                                                255}, ${c.g *
                                                255}, ${c.b *
                                                255})`
                                        }}>
                                        <input
                                            className="light__color__input"
                                            type="color"
                                            onChange={event =>
                                                handleColorChange(
                                                    event,
                                                    index,
                                                    colorIndex,
                                                    light.type
                                                )
                                            }
                                        />
                                    </div>
                                );
                            }
                        )}
                        <div className="light__name">
                            {light.type}
                        </div>
                        <div className="light__textInput">
                            <Input
                                icon={
                                    <Icon name="Effects" />
                                }
                                value={light.intensity}
                                onChange={event => {}}
                            />
                        </div>
                        <div className="light__action">
                            <IconButton
                                onClick={event => {
                                    dispatch({
                                        type:
                                            "SET_ITEM_FOR_DELETE",
                                        payload: light.id
                                    });
                                }}
                                icon={<Icon name="Trash" />}
                            />
                        </div>
                    </div>
                    {([
                        "PointLight",
                        "SpotLight",
                        "RectAreaLight"
                    ] as any).includes(light.type) && (
                        <div className="light--sub">
                            {light.type == "PointLight" && (
                                <>
                                    <div
                                        style={{
                                            width: "85px"
                                        }}>
                                        <Input
                                            icon={
                                                <Label
                                                    style={{
                                                        height:
                                                            "100%",
                                                        marginRight:
                                                            "10px"
                                                    }}>
                                                    Decay
                                                </Label>
                                            }
                                            className="light__textInput--faint"
                                            value={
                                                light.decay ||
                                                2
                                            }
                                            onChange={event => {}}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            width: "60px"
                                        }}>
                                        <Input
                                            icon={
                                                <Label
                                                    style={{
                                                        height:
                                                            "100%"
                                                    }}>
                                                    D
                                                </Label>
                                            }
                                            className="light__textInput--faint"
                                            value={
                                                light.distance
                                            }
                                            onChange={event => {}}
                                        />
                                    </div>
                                </>
                            )}
                            {light.type ==
                                "RectAreaLight" && (
                                <>
                                    <div
                                        style={{
                                            width: "60px"
                                        }}>
                                        <Input
                                            icon={
                                                <Label
                                                    style={{
                                                        height:
                                                            "100%"
                                                    }}>
                                                    W
                                                </Label>
                                            }
                                            className="light__textInput--faint"
                                            value={
                                                light.width
                                            }
                                            onChange={event => {}}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            width: "60px"
                                        }}>
                                        <Input
                                            icon={
                                                <Label
                                                    style={{
                                                        height:
                                                            "100%"
                                                    }}>
                                                    H
                                                </Label>
                                            }
                                            className="light__textInput--faint"
                                            value={
                                                light.height
                                            }
                                            onChange={event => {}}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </>
            );
        });
    };

    return (
        <div className="panel">
            <div className="ui-section">
                <div className="pad">
                    <SectionTitle>Lighting</SectionTitle>
                    <div className="lightOptions">
                        <div>
                            <Icon name="Effects" />
                        </div>
                        <div className="lightOptions__select">
                            <Select
                                options={buildLightOptions()}
                                onChange={value =>
                                    setLightType(value)
                                }
                            />
                        </div>
                        <div className="lightOptions__action">
                            <IconButton
                                icon={<Icon name="Plus" />}
                                onClick={event => {
                                    dispatch({
                                        type:
                                            "REQUEST_ADD_LIGHT_TO_SCENE",
                                        payload:
                                            lightType +
                                            "-" +
                                            new Date().getMilliseconds()
                                    });
                                }}
                            />
                        </div>
                    </div>

                    <div className="lights">
                        {buildLightItems(lights)}
                    </div>
                </div>
            </div>
        </div>
    );
}
