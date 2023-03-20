import clsx from "clsx";
import React from "react";
import ArrowGoBackFillIcon from "remixicon-react/ArrowGoBackFillIcon";
import BrushFill from "remixicon-react/BrushFillIcon";
import TextIcon from "remixicon-react/TextIcon";
import ZoomInLineIcon from "remixicon-react/ZoomInLineIcon";
import ZoomOutLineIcon from "remixicon-react/ZoomOutLineIcon";
import { Step, Tool, useGlobalContext } from "../../App";
import "./Toolbar.scss";

const Toolbar = () => {
  const { canvasControl, dispatch, state } = useGlobalContext();

  const addText = () => {
    if (state.toolMode === Tool.text) {
      dispatch({ type: "setTool", value: "" });
      return;
    }

    dispatch({ type: "setTool", value: Tool.text });
    canvasControl.disableBrush();
    canvasControl.addText();
  };

  const addBrush = () => {
    if (state.toolMode === Tool.brush) {
      dispatch({ type: "setTool", value: "" });
      canvasControl.disableBrush();
    } else {
      dispatch({ type: "setTool", value: Tool.brush });
      canvasControl.addBrush();
    }
  };

  // const changeDiff = (val) => {
  //   dispatch({
  //     type: "changeImageMode",
  //     value: {
  //       mode: val,
  //       index: state.focusImage,
  //     },
  //   });
  //   canvasControl.addImage(state.images[state.focusImage][val]);
  // };

  return (
    <div className="h-full flex items-center gap-5">
      {/* {state.step >= Step.translated && (
        <select
          className="diff"
          onChange={(e) => changeDiff(e.target.value)}
          value={state.images[state.focusImage]?.imageMode}
          title="Change Image Mode"
        >
          {diffOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )} */}
      <button onClick={() => canvasControl.zoom("zoomIn")} title="Zoom In">
        <ZoomInLineIcon />
      </button>
      <button onClick={() => canvasControl.zoom("fit")} title="Fit">
        Fit
      </button>
      <button onClick={() => canvasControl.zoom("zoomOut")} title="Zoom Out">
        <ZoomOutLineIcon />
      </button>
      <button title="Undo" onClick={() => canvasControl.undo()}>
        <ArrowGoBackFillIcon />
      </button>
      <button onClick={addBrush} title="Brush">
        <BrushFill
          className={clsx({
            "rounded border-solid border-2 border-gray-400":
              state.toolMode === Tool.brush,
          })}
          size={32}
        />
      </button>
      <button onClick={addText} title="Text">
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

const diffOptions = [
  { value: "origin", label: "Origin" },
  { value: "inpainted", label: "Inpainted" },
  { value: "mask", label: "Mask" },
];

export default Toolbar;
