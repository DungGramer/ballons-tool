import React, { useRef } from "react";
import { useGlobalContext } from "../../App";
import "./Sidebar.scss";

const Sidebar = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const currentIndexFocus = useRef(null);

  const focusImage = (e, newIndex) => {
    if (currentIndexFocus.current === newIndex) return; //? Block focus on same image

    const oldIndex = currentIndexFocus.current;
    
    console.log(canvasControl.exportJSON());
    if (typeof oldIndex === "number") {
      dispatch({
        type: "setImageState",
        value: {
          index: oldIndex,
          data: canvasControl.exportJSON(),
        },
      });
    }
    if (state.images[newIndex]?.state) {
      canvasControl.importJSON(state.images[newIndex]?.state);
    } else {
      canvasControl.clear();
      canvasControl.setBackground(state.images[newIndex].origin || "");

      if (["inpainted", "mask"].includes(state.imageMode)) {
        canvasControl.addImage(state.images[newIndex][state.imageMode] || "");
      }
    }

    currentIndexFocus.current = newIndex;

    dispatch({
      type: "focusImage",
      value: newIndex,
    });
  };

  return (
    <div className="max-w-xs w-1/3 sidebar h-screen">
      {state?.images?.map((image, index) => {
        return (
          <div key={index} className="flex flex-col gap-2 sidebar-item">
            <img
              src={image.origin}
              alt={image.name}
              onClick={(e) => focusImage(e, index)}
            />
            {/* <p>{image.name}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
