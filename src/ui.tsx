import * as React from "react";
import * as ReactDOM from "react-dom";
import AppContext from "./context";
import reducer from "./reducer";
import setupAddons from "./utils/window-addons";
import "./ui.css";

import Viewport from "./components/Viewport";
import Shelf from "./components/Shelf";

// Set up window addons
setupAddons();

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
