import * as React from "react";
import * as ReactDOM from "react-dom";
import AppContext from "./context";
import reducer from "./reducer";
import "./ui.css";
import ResizeObserver from "resize-observer-polyfill";
window.ResizeObserver = ResizeObserver;
import Viewport from "./components/ViewPort";
import Panel from "./components/Panel";
const App = () => {
    const initialState = React.useContext(AppContext);
    const [state, dispatch] = React.useReducer(reducer, initialState);
    return (React.createElement(AppContext.Provider, { value: { state, dispatch } },
        React.createElement(Viewport, { height: '200px' }),
        React.createElement(Panel, null)));
};
ReactDOM.render(React.createElement(App, null), document.getElementById("root"));
