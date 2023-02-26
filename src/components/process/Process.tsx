import React from "react";
import { useGlobalContext } from "../../App";
import "./Process.scss";

const Process = () => {
  const { state } = useGlobalContext();

  if (state.process < 0 || state.process > 100) return null;

  return <progress value={state.process} max='100' id='progressBar' />;
};

export default Process;
