import * as React from "react";
import * as ReactDOM from "react-dom";
import AppContext from "./context";
import reducer from "./reducer";
import "./ui.css";

import Viewport from "./components/ViewPort";
import Shelf from "./components/Shelf";
// a hack...
(window as any).THIRD_INSPECTOR_TOGGLER = null;
declare function require(path: string): any;

(window as any).third_alert = message => {
    parent.postMessage({ pluginMessage: { type: "alert", message } }, "*");
};

const App = () => {
    const initialState = React.useContext(AppContext);
    const [state, dispatch] = React.useReducer(reducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch } as any}>
            <div className="app">
                <Viewport height={450} width={550}></Viewport>
                <Shelf width={250}></Shelf>
            </div>
        </AppContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
