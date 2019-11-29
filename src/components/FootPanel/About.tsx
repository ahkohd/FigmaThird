import * as React from "react";
import { H2, FlexContainer, SectionTitle, Text, Link } from "./Styled";

export default function About() {
    return (
        <>
            <H2>About</H2>
            <FlexContainer>
                <div style={{ width: "80vw" }}>
                    <SectionTitle>Third</SectionTitle>
                    <Text>Import, lit and use 3D models right there in Figma.</Text>

                    <SectionTitle>Notes</SectionTitle>
                    <Text>
                        Made with ❤️ and Three.JS <br />
                        Feel free to contribute 👨‍❤️‍💋‍👨.
                        <Link onClick={() => window.open("https://github.com/ahkohd/FigmaThird")}>
                            (https://github.com/ahkohd/FigmaThird)
                        </Link>
                    </Text>

                    <SectionTitle>License</SectionTitle>
                    <Text>
                        MIT
                        <Link
                            onClick={() =>
                                window.open("https://github.com/ahkohd/FigmaThird/License.md")
                            }>
                            (https://github.com/ahkohd/FigmaThird/License.md)
                        </Link>
                    </Text>
                </div>
            </FlexContainer>
        </>
    );
}
