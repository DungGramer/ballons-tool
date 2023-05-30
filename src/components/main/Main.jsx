import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../../App";

import "./Main.scss";
import TopSidebar from "../top-sidebar/TopSidebar";
import Sidebar from "../sidebar/Sidebar";

const Main = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const [canvasRef, wrapperRef] = [useRef(null), useRef(null)];

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;

    canvasControl.init(canvasRef.current, wrapperRef.current);
    canvasControl.setBackground(state.focusImage?.src);

    // Add shortcut key
    document.addEventListener("keydown", canvasControl.shortcut);
    // Add mouse wheel event
    // document.addEventListener("wheel", canvasControl.mouseWheel);
    wrapperRef.current.addEventListener("wheel", canvasControl.mouseWheel);

    return () => {
      document.removeEventListener("keydown", canvasControl.shortcut);
      // document?.removeEventListener("wheel", canvasControl.mouseWheel);
      wrapperRef.current?.removeEventListener(
        "wheel",
        canvasControl.mouseWheel
      );
    };
  }, [state.focusImage]);

  return (
    <div className="flex-auto flex flex-col main-editor">
      <TopSidebar />
      <div className="main flex items-center justify-center  gap-6">
        {state.focusImage > -1 && state.images[state.focusImage]?.origin && (
          <div className="flex items-center justify-center">
            <img src={state.images[state.focusImage]?.origin} alt="" />
          </div>
        )}
        {state.focusImage > -1 && (
          <div className="relative" ref={wrapperRef}>
            <canvas ref={canvasRef} id="canvas" />
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
};

export default Main;
