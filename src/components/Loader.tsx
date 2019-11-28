import * as React from "react";

export default function Loader(props) {
  return (
    <div
      className="loader__backdrop"
      style={{ height: props.height + "px", width: props.width + "px" }}
    >
      <div className="loader__container">
        <p className="loader__text">{props.text ? props.text : "Loading"}</p>
        <progress className="loader__progress"></progress>
      </div>
    </div>
  );
}
