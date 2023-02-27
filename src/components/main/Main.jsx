import React, { useEffect, useRef } from "react";
import { useGlobalContext } from "../../App";

import "./Main.scss";

const Main = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const [canvasRef, wrapperRef] = [useRef(null), useRef(null)];

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current) return;
    
    canvasControl.init(canvasRef.current, wrapperRef.current);
    canvasControl.setBackground(state.focusImage?.src);
  }, [state.focusImage, canvasRef, wrapperRef]);

  return (
    <div
      ref={wrapperRef}
      className='main flex items-center justify-center flex-auto'
    >
      {/* <img src={state.focusImage?.src} alt={state.focusImage?.alt} /> */}
      <canvas ref={canvasRef} id='canvas' />
    </div>
  );
};

export default Main;
