import { Step, useGlobalContext } from "../../App";

const diffOptions = [
  { value: "origin", label: "Origin" },
  { value: "inpainted", label: "Inpainted" },
  { value: "mask", label: "Mask" },
];

const ChangeMode = () => {
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

  if (state.step >= Step.translated) {
  }
  return (
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
  );

  return null;
};

export default ChangeMode;
