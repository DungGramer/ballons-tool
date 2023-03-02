import React from "react";
import { useGlobalContext } from "../../App";
import "./RightSidebar.scss";

const RightSidebar = () => {
  const { canvasControl } = useGlobalContext();

  const addText = () => {
    canvasControl.addText("xcvxcv");
  };

  return (
    <div className="max-w-xs w-1/3 sidebar h-screen">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={addText}
      >
        Add Text
      </button>
    </div>
  );
};

export default RightSidebar;
