import * as React from "react";
import { H2, FlexContainer, SectionTitle, Text } from "./Styled";

export default function Help() {
    return (
        <>
            <H2>Heads Up</H2>
            <FlexContainer>
                <div>
                    <SectionTitle>Import</SectionTitle>
                    <Text>
                        Use the import panel to import 3D models and their textures, Third will take
                        care generating materials and applying them to the imported 3D models. You
                        can import more than one model into the viewport.
                    </Text>

                    <SectionTitle>Inspector</SectionTitle>
                    <Text>
                        Use the Inspector to inspect 3D objects in the Viewport. You can perform
                        actions on selected object. Actions such as toggling object's visibilty,
                        casting and recieving shadow.
                    </Text>

                    <SectionTitle>Lighting</SectionTitle>
                    <Text>
                        At the Scene tab, you can add lights of various type and color to lit your
                        imported 3D model. You can also add fog to achive intresting effects. See
                        the Lights to get more details about type of lights available and how to use
                        them.
                    </Text>

                    <SectionTitle>Render</SectionTitle>
                    <Text>
                        After setting up your scene, position your viewport to the view of your
                        choice. Create an object in Figma that as a Fill (i.e Rectangle, Circle...)
                        select it. Focus on Third and navigate to the Render tab. Hit the Render
                        button to render your view into the selected object in Figma.
                    </Text>
                </div>
            </FlexContainer>
        </>
    );
}
