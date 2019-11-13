import * as React from "react";
import { VelocityComponent } from "velocity-react";

function Container(props) {
    const { style, decorators, terminal, node, customStyles, onClick, animations }: any = props;

    const renderToggle = () => {
        if (!animations) {
            return renderToggleDecorator();
        }

        return (
            <VelocityComponent
                animation={animations.toggle.animation}
                duration={animations.toggle.duration}>
                {renderToggleDecorator()}
            </VelocityComponent>
        );
    };

    const renderToggleDecorator = () => {
        return <decorators.Toggle style={style.toggle} node={node} onClick={onClick} />;
    };

    return (
        <div
            className="NodeContainer"
            style={node.active ? { ...style.container } : { ...style.link }}>
            {!terminal ? renderToggle() : null}
            <decorators.Header
                node={node}
                active={node.active}
                style={style.header}
                customStyles={customStyles}
                onClick={onClick}
            />
        </div>
    );
}

export default Container;
