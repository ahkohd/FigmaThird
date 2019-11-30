import * as React from "react";
import { H2, FlexSpaceCenter, KText, FlexContainer, ToolIcon, Label } from "./Styled";
import { Icon } from "figma-styled-components";

export default function Tools() {
    return (
        <>
            <H2>Tools</H2>
            <FlexContainer>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Icon name="ScrollingFrameAll" />
                    </ToolIcon>
                    <KText>Translate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Icon name="Swap" />
                    </ToolIcon>
                    <KText>Rotate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Icon name="ResizeToFit" />
                    </ToolIcon>
                    <KText>Scale Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Icon name="VectorHandles" />
                    </ToolIcon>
                    <KText>Set Pivot Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Icon name="Visible" />
                    </ToolIcon>
                    <KText>Visibility Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Label>C</Label>
                    </ToolIcon>
                    <KText>Cast Shadow</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter>
                    <ToolIcon>
                        <Label>R</Label>
                    </ToolIcon>
                    <KText>Recieve Shadow</KText>
                </FlexSpaceCenter>
            </FlexContainer>
        </>
    );
}
