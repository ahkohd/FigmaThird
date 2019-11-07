import React, { PureComponent } from "react";
import { VelocityComponent } from "velocity-react";
import AppContext from "../../context";

class Container extends PureComponent {
  renderToggle() {
    const { animations }: any = this.props;

    if (!animations) {
      return this.renderToggleDecorator();
    }

    return (
      <VelocityComponent
        animation={animations.toggle.animation}
        duration={animations.toggle.duration}
      >
        {this.renderToggleDecorator()}
      </VelocityComponent>
    );
  }

  renderToggleDecorator() {
    const { style, decorators, onClick, node }: any = this.props;
    return (
      <decorators.Toggle style={style.toggle} node={node} onClick={onClick} />
    );
  }

  render() {
    const {
      style,
      decorators,
      terminal,
      node,
      onSelect,
      customStyles,
      onClick
    }: any = this.props;
    return (
      <AppContext.Consumer>
        {({ state, dispatch }: any) => (
          <div
            style={node.active ? { ...style.container } : { ...style.link }}
            onClick={event => {
              dispatch({ type: "SET_SELECT_OBJECT", payload: node });
              onClick(event);
            }}
          >
            {!terminal ? this.renderToggle() : null}
            <decorators.Header
              node={node}
              style={style.header}
              customStyles={customStyles}
              onSelect={onSelect}
            />
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default Container;
