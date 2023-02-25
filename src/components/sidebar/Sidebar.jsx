import React from "react";
import { useGlobalContext } from "../../App";

const Sidebar = () => {
  const { state, dispatch } = useGlobalContext();

  const focusImage = (e) => {
    const image = e.target;
    dispatch({ type: "focusImage", value: image });
  };

  return (
    <div className='max-w-xs w-1/3'>
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
