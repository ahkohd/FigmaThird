import * as React from "react";
import { Input, Icon } from "figma-styled-components";

export default function FileInput({
  onChange,
  placeholder = "Please select file",
  icon = "Draft",
  multiple = false,
  accept = "*"
}) {
  const [place, setPlace] = React.useState(placeholder);

  const handleChange = event => {
    let newPlace = "";
    if (event.target.files.length == 0) {
      setPlace(placeholder);
      return;
    }
    for (const file of event.target.files) {
      newPlace += file.name + ", ";
    }
    setPlace(newPlace.substring(0, newPlace.length - 2));
    onChange(event);
  };
  return (
    <div className="fileinput">
      <Input
        type="file"
        icon={<Icon name={icon} />}
        onChange={handleChange}
        className="fileinput__input"
        multiple={multiple}
        accept={accept}
      />
      <div className="fileinput__placeholder">{place}</div>
    </div>
  );
}
