import React from "react";
import "./Toolbar.scss";
import TextIcon from "remixicon-react/TextIcon";
import BrushFill from "remixicon-react/BrushFillIcon";
import { Tool, useGlobalContext } from "../../App";
import clsx from "clsx";

const Toolbar = () => {
  const { canvasControl, dispatch, state } = useGlobalContext();

  const addText = () => {
    dispatch({ type: "setTool", value: Tool.text });
    canvasControl.addText();
  };

  const addBrush = () => {
    dispatch({ type: "setTool", value: Tool.brush });
    // canvasControl.addBrush();
  };

  return (
    <div className="w-8 h-screen flex flex-col gap-3 ml-2 mt-2">
      <button onClick={addText}>
        <TextIcon
          className={clsx({
            "rounded border-solid border-2 border-gray-400":
              state.toolMode === Tool.text,
          })}
          size={32}
        />
      </button>
      <button onClick={addBrush}>
        <BrushFill
          className={clsx({
            "rounded border-solid border-2 border-gray-400":
              state.toolMode === Tool.brush,
          })}
          size={32}
        />
      </button>
    </div>
  );
};

export default Toolbar;
