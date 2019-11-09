import * as React from "react";
import {
    Icon,
    Text,
    IconButton
} from "figma-styled-components";
import AppContext from "../context";

export default function StatPanel(props) {
    const { state, dispatch }: any = React.useContext(
        AppContext
    );

    return (
        <div className="footstat">
            <div className="footstat__block">
                <IconButton
                    icon={<Icon name="ScrollingFrameAll" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload:
                                "translate-" +
                                new Date().getMilliseconds()
                        });
                    }}>
                    Translate
                </IconButton>
                <IconButton
                    icon={<Icon name="Swap" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload:
                                "rotate-" +
                                new Date().getMilliseconds()
                        });
                    }}>
                    Rotate
                </IconButton>
                <IconButton
                    icon={<Icon name="ResizeToFit" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type: "SET_TRANSFORM_MODE",
                            payload:
                                "scale-" +
                                new Date().getMilliseconds()
                        });
                    }}>
                    Scale
                </IconButton>
                <IconButton
                    icon={<Icon name="VectorHandles" />}
                    className="footstat__btn"
                    onClick={event => {
                        dispatch({
                            type:
                                "SET_TRANSFORM_OBJECT_AS_PIVOT",
                            payload: new Date().getMilliseconds()
                        });
                    }}>
                    Set Pivot
                </IconButton>
            </div>
        </div>
    );
}
