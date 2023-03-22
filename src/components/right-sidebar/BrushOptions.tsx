import React from "react";
import { useGlobalContext } from "../../App";

const BrushOptions = () => {
  const { canvasControl } = useGlobalContext();

  return <div>
    <div className="flex items-center gap-2">
      <label htmlFor="brush-size">Size</label>
      <input
        type="range"
        id="brush-size"
        min="1"
        max="100"
        defaultValue="25"
        onChange={(e) => canvasControl.setBrushSize(+e.target.value)}
      />
    </div>
  </div>;
};

export default BrushOptions;
