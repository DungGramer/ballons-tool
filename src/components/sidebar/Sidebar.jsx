import React from "react";
import { useGlobalContext } from "../../App";
import './Sidebar.scss';

const Sidebar = () => {
  const { state, dispatch, canvasControl } = useGlobalContext();

  const focusImage = (e) => {
    const image = e.target;
    dispatch({ type: "focusImage", value: image });

    canvasControl.setBackground(image.src);
  };

  return (
    <div className='max-w-xs w-1/3 sidebar h-screen'>
      {state?.images?.map((image, index) => {
        return (
          <div key={index} className='flex flex-col gap-2 m-6'>
            <img src={URL.createObjectURL(image)} alt={image.name} onClick={focusImage} />
            {/* <p>{image.name}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default Sidebar;
