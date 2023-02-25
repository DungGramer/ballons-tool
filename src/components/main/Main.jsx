import React from "react";
import { useGlobalContext } from "../../App";

const Main = () => {
  const { state, dispatch } = useGlobalContext();

  return (
    <div className="flex items-center justify-center flex-auto">
      <img src={state.focusImage?.src} alt={state.focusImage?.alt} />
    </div>
  );
};

export default Main;
