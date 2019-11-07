import * as React from "react";
import { Treebeard } from "react-treebeard";
import AppContext from "../context";

export default function Inspector() {
  const { state, dispatch }: any = React.useContext(AppContext);

  const [data, setData] = React.useState(state.sceneTree);
  const [cursor, setCursor]: any = React.useState(false);

  React.useEffect(() => {
    setData(state.sceneTree);
  }, [state.sceneTree]);

  const onToggle = (node, toggled) => {
    if (cursor) {
      cursor.active = false;
    }
    node.active = true;
    if (node.children) {
      node.toggled = toggled;
    }
    setCursor(node);
    setData(Object.assign({}, data));
  };

  return (
    <div className="panel">
      <Treebeard data={data} onToggle={onToggle} />
    </div>
  );
}
