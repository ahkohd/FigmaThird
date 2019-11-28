import * as React from "react";
import { H2, FlexSpaceCenter, KText, FlexContainer, ToolIcon } from "./Styled";
import { Icon } from "figma-styled-components";

export default function Tools() {
    return (
        <>
            <H2>Tools</H2>
            <FlexContainer>
                <FlexSpaceCenter minWidth={"50px"}>
                    <ToolIcon>
                        <Icon name="ScrollingFrameAll" />
                    </ToolIcon>
                    <KText>Translate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <ToolIcon>
                        <Icon name="Swap" />
                    </ToolIcon>
                    <KText>Rotate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <ToolIcon>
                        <Icon name="ResizeToFit" />
                    </ToolIcon>
                    <KText>Scale Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <ToolIcon>
                        <Icon name="VectorHandles" />
                    </ToolIcon>
                    <KText>Pivot Tool</KText>
                </FlexSpaceCenter>
            </FlexContainer>
        </>
    );
}
