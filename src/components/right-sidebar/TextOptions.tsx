import React from "react";
import { useGlobalContext } from "../../App";

let debounce: any = null;

const TextOptions = () => {
  const { canvasControl } = useGlobalContext();

  const changeColor = (e) => {
    clearTimeout(debounce);

    debounce = setTimeout(() => {
      canvasControl.editText({ fill: e.target.value });
    }, 200);
  };

  return (
    <div>
      <input type="color" onChange={changeColor} />
    </div>
  );
};

export default TextOptions;
