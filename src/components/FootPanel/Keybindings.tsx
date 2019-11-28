import * as React from "react";
import { H2, KBD, FlexSpaceCenter, KText, FlexContainer } from "./Styled";

export default function Keybindings() {
    return (
        <>
            <H2>Transform Keyboard Shortcuts</H2>
            <FlexContainer>
                <FlexSpaceCenter>
                    <KBD>
                        <span>W</span>
                    </KBD>
                    <KText>Translate</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>E</span>
                    </KBD>
                    <KText>Rotate</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>R</span>
                    </KBD>
                    <KText>Scale</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>-</span>
                    </KBD>
                    <KText>Zoom In Gizmo</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>=</span>
                    </KBD>
                    <KText>Zoom Out Gizmo</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>X</span>
                    </KBD>
                    <KText>Toggle X Axis Gizmo</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>Y</span>
                    </KBD>
                    <KText>Toggle Y Axis Gizmo</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>Z</span>
                    </KBD>
                    <KText>Toggle Z Axis Gizmo</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <KBD>
                        <span>⎵</span>
                    </KBD>
                    <KText>Toggle Gizmo Visibility</KText>
                </FlexSpaceCenter>
            </FlexContainer>
        </>
    );
}
