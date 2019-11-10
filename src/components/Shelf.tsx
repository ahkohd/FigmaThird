import * as React from "react";
import ModelImportPanel from "./ModelmportPanel";
import StatPanel from "./StatPanel";
import { Label } from "figma-styled-components";
import AppContext from "../context";
import EnvironmentPanel from "./EnvironmentPanel";
import Inspector from "./Inspector";

export default function Shelf(props) {
    const { state, dispatch }: any = React.useContext(AppContext);

    React.useEffect(() => {
        dispatch({
            type: "SET_IMPORT_TYPE",
            payload: "obj"
        });
    }, [state.activeTab]);

    return (
        <div style={{ width: props.width + "px" }} className="shelf">
            <div className="tab">
                <Label
                    className={`
            tab__item 
            ${state.activeTab == "inspector" && " tab__item--active"}
            `}
                    onClick={event =>
                        dispatch({
                            type: "SET_ACTIVE_TAB",
                            payload: "inspector"
                        })
                    }>
                    Inspector
                </Label>
                <Label
                    className={`
         tab__item 
         ${state.activeTab == "scene" && " tab__item--active"}
         `}
                    onClick={event =>
                        dispatch({
                            type: "SET_ACTIVE_TAB",
                            payload: "scene"
                        })
                    }>
                    Scene
                </Label>
                <Label
                    className={`
         tab__item 
         ${state.activeTab == "import" && " tab__item--active"}
         `}
                    onClick={event =>
                        dispatch({
                            type: "SET_ACTIVE_TAB",
                            payload: "import"
                        })
                    }>
                    Import
                </Label>
            </div>
            {state.activeTab == "import" && <ModelImportPanel></ModelImportPanel>}
            {state.activeTab == "scene" && <EnvironmentPanel></EnvironmentPanel>}
            {state.activeTab == "inspector" && <Inspector></Inspector>}

            <StatPanel></StatPanel>
        </div>
    );
}
