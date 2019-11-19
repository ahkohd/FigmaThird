import * as React from "react";
import styled from "styled-components";
import { IconButton, Icon } from "figma-styled-components";
import AppContext from "../../context";
import Navbar from "./Navbar";
import Keybindings from "./Keybindings";
import Tools from "./Tools";
import Help from "./Help";
import About from "./About";

const FootPanelContainer = styled.div`
    width: 100%;
    height: 40vh;
    background: #2c2c2c;
    color: #fcfcfc;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 400;
    padding: 0;

    & svg {
        color: #aaa !important;
    }
`;

const FootPanelCloseButtonContainer = styled.div`
    position: absolute;
    top: 2px;
    right: 5px;
`;

const FootPanelTabContent = styled.div`
    width: 80%;
    display: table;
    padding: 10px 0;
    margin: 10px auto;
`;

export function FootPanel() {
    const { state, dispatch }: any = React.useContext(AppContext);
    const [tab, setTab] = React.useState("Keybindings");
    return (
        <>
            {state.showFootPanel && (
                <FootPanelContainer>
                    <FootPanelCloseButtonContainer>
                        <IconButton
                            icon={<Icon name="X" />}
                            onClick={event => dispatch({ type: "HIDE_FOOTPANEL" })}></IconButton>
                    </FootPanelCloseButtonContainer>
                    <Navbar
                        activeTab={tab}
                        navItems={["Keybindings", "Tools", "Help", "About"]}
                        onChange={activeTab => setTab(activeTab)}
                    />
                    <FootPanelTabContent>
                        {tab == "Keybindings" && <Keybindings />}
                        {tab == "Tools" && <Tools />}
                        {tab == "Help" && <Help />}
                        {tab == "About" && <About />}
                    </FootPanelTabContent>
                </FootPanelContainer>
            )}
        </>
    );
}
