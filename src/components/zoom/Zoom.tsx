import React, { useEffect } from "react";
import { Step, useGlobalContext } from "../../App";
import "./Zoom.scss";

const zoomOptions = [
  // { value: 0.25, label: "25%" },
  // { value: 0.5, label: "50%" },
  // { value: 0.75, label: "75%" },
  // { value: 1, label: "100%" },
  { value: "fit", label: "Fit" },
  // { value: "fill", label: "Fill" },
];

const diffOptions = [
  { value: "origin", label: "Origin" },
  { value: "inpainted", label: "Inpainted" },
  { value: "mask", label: "Mask" },
];

const Zoom = () => {
  const { canvasControl, dispatch, state } = useGlobalContext();

  const changeDiff = (val) => {
    dispatch({
      type: "changeImageMode",
      value: {
        mode: val,
        index: state.focusImage,
      },
    });
    canvasControl.addImage(state.images[state.focusImage][val]);
  };

  return state.step >= Step.upload && typeof state.focusImage === "number" ? (
    <div className="flex zoom">
      {state.step >= Step.translated && (
        <select
          className="diff"
          onChange={(e) => changeDiff(e.target.value)}
          value={state.images[state.focusImage].imageMode}
        >
          {diffOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      <>
        <button
          className="flex-1 flex items-center justify-center w-11"
          onClick={() => canvasControl.zoom("zoomOut")}
        >
          <svg
            width={20}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208zm-280-24c-13.3 0-24 10.7-24 24s10.7 24 24 24h144c13.3 0 24-10.7 24-24s-10.7-24-24-24H136z" />
          </svg>
        </button>

        <button
          className="flex-1 flex items-center justify-center w-11"
          onClick={() => canvasControl.zoom("fit")}
        >
          Fit
        </button>

        <button
          className="flex-1 flex items-center justify-center w-11"
          onClick={() => canvasControl.zoom("zoomIn")}
        >
          <svg
            width={20}
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
          >
            <path d="M416 208c0 45.9-14.9 88.3-40 122.7l126.6 126.7c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208zm-232 88c0 13.3 10.7 24 24 24s24-10.7 24-24v-64h64c13.3 0 24-10.7 24-24s-10.7-24-24-24h-64v-64c0-13.3-10.7-24-24-24s-24 10.7-24 24v64h-64c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z" />
          </svg>
        </button>
      </>
    </div>
  ) : null;
};

export default Zoom;
