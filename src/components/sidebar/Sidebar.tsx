import React, { useRef } from "react";
import { useGlobalContext } from "../../App";
import "./Sidebar.scss";

const Sidebar = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();
  const currentFocus = useRef(null);

  const focusImage = (e, index) => {
    if (currentFocus.current === index) return; //? Block focus on same image

    currentFocus.current = index;
    dispatch({
      type: "focusImage",
      value: index,
    });

    canvasControl.setBackground(state.images[index].origin || "");

    if (['inpainted', 'mask'].includes(state.imageMode)) {
      canvasControl.addImage(state.images[index][state.imageMode] || "");
    }

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
