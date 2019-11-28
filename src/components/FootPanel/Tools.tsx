import * as React from "react";
import { H2, FlexSpaceCenter, KText, FlexContainer } from "./Styled";
import { Icon, IconButton } from "figma-styled-components";

export default function Tools() {
    return (
        <>
            <H2>Tools</H2>
            <FlexContainer>
                <FlexSpaceCenter minWidth={"50px"}>
                    <IconButton icon={<Icon name="ScrollingFrameAll" />} />
                    <KText>Translate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <IconButton icon={<Icon name="Swap" />} />
                    <KText>Rotate Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <IconButton icon={<Icon name="ResizeToFit" />} />
                    <KText>Scale Tool</KText>
                </FlexSpaceCenter>
                <FlexSpaceCenter minWidth={"50px"}>
                    <IconButton icon={<Icon name="VectorHandles" />} />
                    <KText>Pivot Tool</KText>
                </FlexSpaceCenter>
            </FlexContainer>
        </>
    );
}
