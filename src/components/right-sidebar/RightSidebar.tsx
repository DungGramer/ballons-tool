import React from "react";
import { Tool, useGlobalContext } from "../../App";
import BrushOptions from "./BrushOptions";
import "./RightSidebar.scss";
import TextOptions from "./TextOptions";

const RightSidebar = () => {
  const { state } = useGlobalContext();
  const toolMode = state.toolMode;

  const Tools = {
    [Tool.brush]: <BrushOptions />,
    [Tool.text]: <TextOptions />,
  };

  return (
    <div className="max-w-xs w-1/3 sidebar h-full shrink-0 right-sidebar">
      {Tools[toolMode]}
    </div>
  );
};

export default RightSidebar;
