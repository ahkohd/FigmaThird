import * as React from "react";
import { H2, FlexContainer, SectionTitle, Text } from "./Styled";

export default function Lights() {
    return (
        <>
            <H2>Lights</H2>
            <FlexContainer>
                <div>
                    <SectionTitle>Hemisphere Light</SectionTitle>
                    <Text>
                        A light source positioned directly above the scene, with color fading from
                        the sky color to the ground color.
                    </Text>

                    <SectionTitle>Ambient Light</SectionTitle>
                    <Text>
                        This light globally illuminates all objects in the scene equally. This light
                        cannot be used to cast shadows as it does not have a direction.
                    </Text>

                    <SectionTitle>Point Light</SectionTitle>
                    <Text>
                        A light that gets emitted from a single point in all directions. A common
                        use case for this is to replicate the light emitted from a bare lightbulb.
                    </Text>

                    <SectionTitle>Directional Light</SectionTitle>
                    <Text>
                        A light that gets emitted in a specific direction. This light will behave as
                        though it is infinitely far away and the rays produced from it are all
                        parallel. The common use case for this is to simulate daylight; the sun is
                        far enough away that its position can be considered to be infinite, and all
                        light rays coming from it are parallel.
                    </Text>

                    <SectionTitle>RectArea Light</SectionTitle>
                    <Text>
                        RectAreaLight emits light uniformly across the face a rectangular plane.
                        This light type can be used to simulate light sources such as bright windows
                        or strip lighting. Note that there is no shadow support.
                    </Text>

                    <SectionTitle>Spot Light</SectionTitle>
                    <Text>
                        This light gets emitted from a single point in one direction, along a cone
                        that increases in size the further from the light it gets.
                    </Text>
                </div>
            </FlexContainer>
        </>
    );
}
