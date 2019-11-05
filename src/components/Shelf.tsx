import * as React from "react";
import ModelImportPanel from "./ModelmportPanel";
import StatPanel from "./StatPanel";

export default function Shelf(props) {
  return (
    <div style={{ width: props.width + "px" }} className="shelf">
      <ModelImportPanel></ModelImportPanel>
      <StatPanel></StatPanel>
    </div>
  );
}
