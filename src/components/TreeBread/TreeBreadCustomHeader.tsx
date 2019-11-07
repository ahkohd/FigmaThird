import * as React from "react";
import { Icon } from "figma-styled-components";

export default function Header({ onSelect, style, customStyles, node }) {
  const iconType =
    node.children && node.children.length == 0 ? "Component" : "Frame";
  const extraStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start"
  };

  return (
    <div style={style.base} onClick={onSelect}>
      <div
        style={
          node.selected
            ? { ...style.title, ...customStyles.header.title, ...extraStyle }
            : { ...style.title, ...extraStyle }
        }
      >
        <Icon name={iconType} />
        <div style={{ color: "#555" }}>{node.name}</div>
      </div>
    </div>
  );
}
