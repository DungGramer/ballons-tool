import React from "react";
import "./Toolbar.scss";
import TextIcon from "remixicon-react/TextIcon";
import ZoomInLineIcon from "remixicon-react/ZoomInLineIcon";
import ZoomOutLineIcon from "remixicon-react/ZoomOutLineIcon";
import ArrowGoBackFillIcon from "remixicon-react/ArrowGoBackFillIcon";
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
    <div className="h-full flex items-center gap-5">
      <button onClick={() => canvasControl.zoom("zoomIn")}>
        <ZoomInLineIcon />
      </button>
      <button onClick={() => canvasControl.zoom("fit")}>Fit</button>
      <button onClick={() => canvasControl.zoom("zoomOut")}>
        <ZoomOutLineIcon />
      </button>
      <button>
        <ArrowGoBackFillIcon />
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
      <button onClick={addText}>
        <TextIcon
          className={clsx({
            "rounded border-solid border-2 border-gray-400":
              state.toolMode === Tool.text,
          })}
          size={32}
        />
      </button>
    </div>
  );
};

export default Toolbar;
