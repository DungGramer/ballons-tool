import React from "react";
import { Tool, useGlobalContext } from "../../App";
import BrushOptions from "./BrushOptions";
import "./RightSidebar.scss";
import TextOptions from "./TextOptions";

const RightSidebar = () => {
  const { state } = useGlobalContext();

  return (
    <div className="max-w-xs w-1/3 sidebar h-screen">
      {state.toolMode === Tool.brush && <BrushOptions />}
      {state.toolMode === Tool.text && <TextOptions />}
    </div>
  );
};

export default RightSidebar;
