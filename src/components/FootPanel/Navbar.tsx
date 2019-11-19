import * as React from "react";
import styled from "styled-components";

const NavbarWrapper = styled.div`
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #444;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const NavItem = styled.div`
    color: #aaa;
    margin: 0;
    padding: 0 20px;
    position: relative;
    height: 100%;
    display: flex;
    cursor: default;
    border-left: 1px solid transparent;
    border-right: 1px solid transparent;
`;

const NavItemActive = styled(NavItem)`
    border-left: 1px solid #444;
    border-right: 1px solid #444;
    &:after {
        content: "";
        bottom: -5px;
        left: 0;
        height: 10px;
        width: 100%;
        background: #2c2c2c;
        position: absolute;
    }
`;

const NavItemText = styled.p`
    margin: auto;
    font: caption;
    font-size: 12px;
`;

export default function Navbar({ navItems, activeTab, onChange }) {
    const [tab, setActiveTab] = React.useState(activeTab);

    const buildItems = navItems => {
        return navItems.map((item, index) =>
            tab == item ? (
                <NavItemActive
                    key={index}
                    onClick={event => {
                        setActiveTab(item);
                        onChange(item);
                    }}>
                    <NavItemText>{item}</NavItemText>
                </NavItemActive>
            ) : (
                <NavItem
                    key={index}
                    onClick={event => {
                        setActiveTab(item);
                        onChange(item);
                    }}>
                    <NavItemText>{item}</NavItemText>
                </NavItem>
            )
        );
    };
    return <NavbarWrapper>{buildItems(navItems)}</NavbarWrapper>;
}
